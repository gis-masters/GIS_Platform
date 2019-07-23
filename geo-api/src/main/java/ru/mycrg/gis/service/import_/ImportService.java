package ru.mycrg.gis.service.import_;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessRequest;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.common.enums.ProcessType;
import ru.mycrg.common.import_.ImportFeature;
import ru.mycrg.common.import_.ImportMqRequest;
import ru.mycrg.common.import_.ImportMqResponse;
import ru.mycrg.gis.dto.DetailsModel;
import ru.mycrg.gis.dto.ProjectModel;
import ru.mycrg.gis.dto.SubProcessModel;
import ru.mycrg.gis.dto.WsMessageDto;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.queue.MqSender;
import ru.mycrg.gis.repository.ProcessRepository;
import ru.mycrg.gis.service.*;
import ru.mycrg.gis.service.fgistp.MapperUtil;

import java.io.IOException;
import java.security.Principal;

@Service
public class ImportService extends BaseProcessService {

    private static Logger log = LoggerFactory.getLogger(ImportService.class);

    private final MqSender mqSender;
    private final ProjectService projectService;
    private final WsNotificationService wsNotificationService;

    public ImportService(MqSender mqSender,
                         ProjectService projectService,
                         ProcessRepository processRepository,
                         WsNotificationService wsNotificationService) {
        super(processRepository);

        this.mqSender = mqSender;
        this.projectService = projectService;
        this.wsNotificationService = wsNotificationService;
    }

    public Process initProcess(Long orgId, Long projectId, WorkImport workImport, Principal principal) {
        ProjectModel projectModel = projectService.getProject(orgId, projectId);

        Process process = create(principal.getName(),
                String.format("Импорт %d слоёв(я) в проект: %s",
                        workImport.getImportTasks().size(), projectModel.getInternalName()),
                ProcessType.IMPORT, workImport.getWsUiId());

        ImportMqRequest payload = new ImportMqRequest();
        workImport.getImportTasks().forEach(importTask -> {
            ImportFeature importFeature = new ImportFeature(
                    new ResourceProjection(
                            projectModel.getDatabaseName(),
                            "public", // Источником рабочего импорта является хранилище "scratch - public схема в БД"
                            importTask.getLayerName()),
                    new ResourceProjection(
                            projectModel.getDatabaseName(),
                            projectModel.getWorkspaceName(),
                            importTask.getWorkTableName()),
                    importTask.getMapping());

            payload.addImportFeature(importFeature);
        });

        mqSender.send(new BaseMqProcessRequest(process.getId(), ProcessType.IMPORT, payload));

        return process;
    }

    @Override
    public void handleMqResponse(BaseMqProcessResponse response) {
        ImportMqResponse mqResponse = (ImportMqResponse) response;
        if (mqResponse.getId() == null) {
            log.warn("Return invalid mqResponse");
        }

        Process process = getProcessById(mqResponse.getId());
        switch (mqResponse.getStatus()) {
            case PENDING:
            case SUB_ERROR:
            case SUB_DONE:  addSubStep(process, mqResponse);     break;
            case ERROR:     error(process, response.getError()); break;
            case DONE:      complete(process, null);        break;
            default:
                log.warn("Not supported process status. {}", process);
        }

        String wsUiId = process.getExtra().asText();
        wsNotificationService.send(new WsMessageDto<>(mqResponse.getType(), mqResponse), wsUiId);
    }

    private void addSubStep(Process process, ImportMqResponse response) {
        process.setStatus(response.getStatus());

        try {
            String content = "{}";
            if (process.getDetails() != null) {
                content = process.getDetails().toString();
            }

            DetailsModel details = mapper.readValue(content, DetailsModel.class);

            SubProcessModel subProcess = new SubProcessModel(response.getDirection(),
                    response.getDescription(), response.getError());

            details.addSubProcess(subProcess);

            JsonNode jsonNode = MapperUtil.convertToJsonNode(details);

            process.setDetails(jsonNode);
        } catch (IOException e) {
            log.error("Failed write details to process / Error: {}", e.getMessage());
        }

        log.debug("Add subStep to process: {}", process.getId());
    }
}
