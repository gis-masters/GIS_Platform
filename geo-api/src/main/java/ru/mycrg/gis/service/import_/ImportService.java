package ru.mycrg.gis.service.import_;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessRequest;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.FeatureDescriptionDto;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.common.enums.ProcessType;
import ru.mycrg.common.import_.ImportMqResponse;
import ru.mycrg.common.import_.ImportMqTask;
import ru.mycrg.gis.dto.DetailsModel;
import ru.mycrg.gis.dto.ProjectModel;
import ru.mycrg.gis.dto.TaskModel;
import ru.mycrg.gis.dto.WsMessageDto;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.queue.MqSender;
import ru.mycrg.gis.repository.ProcessRepository;
import ru.mycrg.gis.service.BaseProcessService;
import ru.mycrg.gis.service.ProjectService;
import ru.mycrg.gis.service.WsNotificationService;
import ru.mycrg.gis.service.dataSchema.DataSchemaService;
import ru.mycrg.gis.service.dataSchema.MapperUtil;

import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@Service
public class ImportService extends BaseProcessService {

    private static Logger log = LoggerFactory.getLogger(ImportService.class);

    private final DataSchemaService schemaService;
    private final MqSender mqSender;
    private final ProjectService projectService;
    private final WsNotificationService wsNotificationService;

    public ImportService(MqSender mqSender,
                         DataSchemaService schemaService,
                         ProjectService projectService,
                         ProcessRepository processRepository,
                         WsNotificationService wsNotificationService) {
        super(processRepository);

        this.mqSender = mqSender;
        this.schemaService = schemaService;
        this.projectService = projectService;
        this.wsNotificationService = wsNotificationService;
    }

    public Process initProcess(Long orgId, Long projectId, WorkImport workImport, Principal principal) {
        ProjectModel projectModel = projectService.getProject(orgId, projectId);

        Process process = create(principal.getName(),
                String.format("Импорт %d слоя(ёв) в проект: %s",
                        workImport.getImportTasks().size(), projectModel.getInternalName()),
                ProcessType.IMPORT, workImport.getWsUiId());

        List<ImportMqTask> importMqRequest = new ArrayList<>();
        workImport.getImportTasks().forEach(uiTask -> {
            FeatureDescriptionDto featureDescription = schemaService.getDescriptionByName(uiTask.getWorkTableName());
            ImportMqTask importMqTask = new ImportMqTask(featureDescription,
                    new ResourceProjection(
                            projectModel.getDatabaseName(),
                            "public", // Источником рабочего импорта является хранилище "scratch - public схема в БД"
                            uiTask.getLayerName()),
                    new ResourceProjection(
                            projectModel.getDatabaseName(),
                            projectModel.getWorkspaceName(),
                            uiTask.getWorkTableName()),
                    uiTask.getMapping(),
                    uiTask.getSrs()
            );

            importMqRequest.add(importMqTask);
        });

        mqSender.send(new BaseMqProcessRequest(process.getId(), ProcessType.IMPORT, importMqRequest));

        return process;
    }

    @Override
    public void handleMqResponse(BaseMqProcessResponse mqResponse) {
        if (mqResponse.getId() == null) {
            log.warn("Return invalid mqResponse");
        }

        Process process = getProcessById(mqResponse.getId());
        switch (mqResponse.getStatus()) {
            case TASK_ERROR:
            case TASK_DONE: handleTask(process, mqResponse);        break;
            case ERROR:     error(process, mqResponse.getError());  break;
            case DONE:      complete(process, null);           break;
            default:
                log.warn("Not supported process status. {}", process);
        }

        String wsUiId = process.getExtra().asText();
        wsNotificationService.send(new WsMessageDto<>(mqResponse.getType(), mqResponse), wsUiId);
    }

    private void handleTask(Process process, BaseMqProcessResponse mqResponse) {
        try {
            log.debug("Add task to process: {}", process.getId());
            process.setStatus(mqResponse.getStatus());

            TaskModel task = new TaskModel();
            if (!mqResponse.getPayload().equals("")) {
                ImportMqResponse rPayload = mapper.convertValue(mqResponse.getPayload(), ImportMqResponse.class);
                task = new TaskModel(rPayload.getTargetLayer(), mqResponse.getDescription(), mqResponse.getError());
            } else if (mqResponse.getDescription() != null) {
                task = new TaskModel(mqResponse.getDescription(), mqResponse.getError());
            } else {
                log.warn("Task for processId: {} not have any description/payload?", process.getId());
            }

            String content = "{}";
            if (process.getDetails() != null) {
                content = process.getDetails().toString();
            }

            DetailsModel details = mapper.readValue(content, DetailsModel.class);
            details.addTask(task);

            JsonNode jsonNode = MapperUtil.convertToJsonNode(details);

            process.setDetails(jsonNode);
        } catch (IOException e) {
            log.error("Failed write details to process / Error: {}", e.getMessage());
        }
    }

}
