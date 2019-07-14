package ru.mycrg.gis.service.export;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.MqExportProcessRequest;
import ru.mycrg.common.MqExportResponse;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.common.enums.ProcessType;
import ru.mycrg.gis.dto.*;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.queue.IMqEvents;
import ru.mycrg.gis.queue.MqSender;
import ru.mycrg.gis.repository.ProcessRepository;
import ru.mycrg.gis.service.*;
import ru.mycrg.gis.service.fgistp.MapperUtil;
import ru.mycrg.gis.service.fgistp.rules.FgistpRuleService;

import java.io.IOException;
import java.security.Principal;

import static ru.mycrg.common.CrgConstants.DEFAULT_DB_NAME;

@Service
public class ExportService extends BaseProcessService {

    private static Logger log = LoggerFactory.getLogger(ExportService.class);

    private final IMqEvents mqEvents;
    private final FgistpRuleService ruleService;
    private final ProjectService projectService;
    private final WsNotificationService wsNotificationService;

    public ExportService(MqSender mqEvents,
                         FgistpRuleService ruleService,
                         ProcessRepository processRepository,
                         ProjectService projectService,
                         WsNotificationService wsNotificationService) {
        super(processRepository);

        this.mqEvents = mqEvents;
        this.ruleService = ruleService;
        this.projectService = projectService;
        this.wsNotificationService = wsNotificationService;
    }

    public Process export(Long orgId, Long projectId, ExportRequestModel request, Principal principal) {
        ProjectModel project = projectService.getProject(orgId, projectId, principal);

        log.debug("Try export {} layers", request.getLayers().size());

        Process process = create(principal.getName(),
                String.format("Экспорт. Проект: %s Кол-во слоев: %d", project.getInternalName(), request.getLayers().size()),
                ProcessType.EXPORT, request);

        MqExportProcessRequest mqRequest = new MqExportProcessRequest(process.getId());
        mqRequest.setDocSchema(request.getFormat());

        request.getLayers().forEach(layerName -> {
            // TODO
            // EntityType ruleByClassName = ruleService.getRuleByName(layerName);
            // mqRequest.addRule(MapperUtil.mapEntityTypeToDto(ruleByClassName));
            mqRequest.addResource(
                    new ResourceProjection(DEFAULT_DB_NAME + orgId, project.getWorkspaceName(), layerName));
        });

        mqEvents.sendGmlInit(mqRequest);

        return process;
    }

    @Override
    public void handleMqResponse(BaseMqProcessResponse response) {
        MqExportResponse mqResponse = (MqExportResponse) response;

        if (mqResponse.getId() == null) {
            log.warn("Return invalid response");
        }

        Process process = getProcessById(mqResponse.getId());
        switch (mqResponse.getStatus()) {
            case PENDING:
            case SUB_ERROR:
            case SUB_DONE:
                addSubStep(process, mqResponse);
                break;
            case ERROR:
                error(process);
                break;
            case DONE:
                complete(process);
                break;
            default:
                log.warn("Not supported process status. {}", process);
        }

        String wsUiId = process.getExtra().get("wsUiId").toString();
        wsNotificationService.send(new WsMessageDto<>(mqResponse.getType(), mqResponse), wsUiId);
    }

    private void addSubStep(Process process, MqExportResponse response) {
        process.setStatus(response.getStatus());

        try {
            String content = "{}";
            if (process.getDetails() != null) {
                content = process.getDetails().toString();
            }

            DetailsModel details = mapper.readValue(content, DetailsModel.class);

            SubProcessModel subProcess = new SubProcessModel(response.getLayerName(),
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
