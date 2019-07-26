package ru.mycrg.gis.service.export;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessRequest;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.MqExportProcessRequest;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.common.enums.ProcessType;
import ru.mycrg.gis.dto.*;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.exceptions.CrgConflictException;
import ru.mycrg.gis.queue.MqSender;
import ru.mycrg.gis.repository.ProcessRepository;
import ru.mycrg.gis.service.BaseProcessService;
import ru.mycrg.gis.service.ProjectService;
import ru.mycrg.gis.service.WsNotificationService;
import ru.mycrg.gis.service.fgistp.EntityType;
import ru.mycrg.gis.service.fgistp.MapperUtil;
import ru.mycrg.gis.service.fgistp.rules.FgistpRuleService;

import java.io.IOException;
import java.security.Principal;

import static ru.mycrg.common.CrgConstants.DEFAULT_DB_NAME;
import static ru.mycrg.common.enums.ProcessStatus.PENDING;

@Service
public class ExportService extends BaseProcessService {

    private static Logger log = LoggerFactory.getLogger(ExportService.class);

    private final MqSender mqSender;
    private final FgistpRuleService ruleService;
    private final ProjectService projectService;
    private final WsNotificationService wsNotificationService;

    public ExportService(MqSender mqSender,
                         FgistpRuleService ruleService,
                         ProcessRepository processRepository,
                         ProjectService projectService,
                         WsNotificationService wsNotificationService) {
        super(processRepository);

        this.mqSender = mqSender;
        this.ruleService = ruleService;
        this.projectService = projectService;
        this.wsNotificationService = wsNotificationService;
    }

    public Process export(Long orgId, Long projectId, ExportRequestModel request, Principal principal) {
        ProjectModel project = projectService.getProject(orgId, projectId);

        if (request.getFormat() != null && !request.getFormat().equals("ESRI Shapefile")) {
            throw new CrgConflictException("Формат: " + request.getFormat() + ", не поддерживается");
        }

        Process process = create(principal.getName(),
                String.format("Экспорт. Проект: %s. Кол-во слоев: %d", project.getInternalName(),
                        request.getLayers().size()),
                ProcessType.EXPORT, request);

        MqExportProcessRequest payload = new MqExportProcessRequest();
        payload.setFormat(request.getFormat());
        payload.setDocSchema(request.getDocSchema());

        request.getLayers().forEach(layerName -> {
            EntityType ruleByClassName = ruleService.getRuleByName(layerName);

            // TODO: Может не плеваться 404 если один из слоев ненайден а просто не добавлять его.
            // Можно сразу выставить в процессе эту фичу как ошибочную
            // Во всех операциях (импорт, валидация) можно внедрить тоже самое

            payload.addRule(MapperUtil.mapEntityTypeToDto(ruleByClassName));
            payload.addResource(
                    new ResourceProjection(DEFAULT_DB_NAME + orgId, project.getWorkspaceName(), layerName));
        });

        BaseMqProcessRequest mqRequest = new BaseMqProcessRequest(process.getId(), ProcessType.EXPORT, payload);
        mqSender.send(mqRequest);

        BaseMqProcessResponse processResponse = new BaseMqProcessResponse(mqRequest);
        processResponse.setDescription("Инициализация");
        processResponse.setStatus(PENDING);
        processResponse.setPayload(payload);

        wsNotificationService.send(new WsMessageDto<>(ProcessType.EXPORT, processResponse), request.getWsUiId());

        return process;
    }

    @Override
    public void handleMqResponse(BaseMqProcessResponse mqResponse) {
        String pathToFile = mqResponse.getPayload().toString();

        if (mqResponse.getId() == null) {
            log.warn("Return invalid response");
        }

        Process process = getProcessById(mqResponse.getId());
        switch (mqResponse.getStatus()) {
            case PENDING:
            case SUB_ERROR:
            case SUB_DONE:  addSubStep(process, mqResponse);        break;
            case ERROR:     error(process, mqResponse.getError());  break;
            case DONE:      complete(process, pathToFile);          break;
            default:
                log.warn("Not supported process status. {}", process);
        }

        String wsUiId = "";
        JsonNode extra = process.getExtra();
        if (extra != null && extra.get("wsUiId") != null) {
            wsUiId = extra.get("wsUiId").asText();
        }

        wsNotificationService.send(new WsMessageDto<>(mqResponse.getType(), mqResponse), wsUiId);
    }

    private void addSubStep(Process process, BaseMqProcessResponse mqResponse) {
        String tableName = mqResponse.getPayload().toString();
        process.setStatus(mqResponse.getStatus());

        try {
            String content = "{}";
            if (process.getDetails() != null) {
                content = process.getDetails().toString();
            }

            DetailsModel details = mapper.readValue(content, DetailsModel.class);

            SubProcessModel subProcess = new SubProcessModel(tableName, mqResponse.getDescription(),
                    mqResponse.getError());

            details.addSubProcess(subProcess);

            JsonNode jsonNode = MapperUtil.convertToJsonNode(details);

            process.setDetails(jsonNode);
        } catch (IOException e) {
            log.error("Failed write details to process / Error: {}", e.getMessage());
        }

        log.debug("Add subStep to process: {}", process.getId());
    }

}
