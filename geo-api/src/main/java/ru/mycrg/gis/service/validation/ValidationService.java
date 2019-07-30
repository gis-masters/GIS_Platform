package ru.mycrg.gis.service.validation;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.common.*;
import ru.mycrg.common.enums.ProcessType;
import ru.mycrg.gis.dto.*;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.queue.MqSender;
import ru.mycrg.gis.repository.ProcessRepository;
import ru.mycrg.gis.service.BaseProcessService;
import ru.mycrg.gis.service.ProjectService;
import ru.mycrg.gis.service.WsNotificationService;
import ru.mycrg.gis.service.fgistp.FeatureDescription;
import ru.mycrg.gis.service.fgistp.MapperUtil;
import ru.mycrg.gis.service.fgistp.rules.FgistpRuleService;

import java.io.IOException;
import java.security.Principal;

import static ru.mycrg.common.CrgConstants.DEFAULT_DB_NAME;

@Service
public class ValidationService extends BaseProcessService {

    private static Logger log = LoggerFactory.getLogger(ValidationService.class);

    private final MqSender mqSender;
    private final FgistpRuleService ruleService;
    private final ProjectService projectService;
    private final WsNotificationService wsNotificationService;

    @Autowired
    public ValidationService(MqSender mqSender,
                             FgistpRuleService ruleService,
                             ProjectService projectService,
                             ProcessRepository processRepository,
                             WsNotificationService wsNotificationService) {
        super(processRepository);

        this.mqSender = mqSender;
        this.ruleService = ruleService;
        this.projectService = projectService;
        this.wsNotificationService = wsNotificationService;
    }

    /**
     * Запустить процесс валидации.
     *
     * @param orgId     Организация
     * @param projectId Проект
     * @param principal Пользователь
     * @param request   Список ресурсов {@link ValidationRequestDto}
     */
    public Process validate(Long orgId, Long projectId, Principal principal, ValidationRequestDto request) {
        if (ruleService.isCacheEmpty()) {
            ruleService.updateRules();
        }

        ProjectModel projectById = projectService.getProject(orgId, projectId);
        Process process = create(
                principal.getName(),
                String.format("Валидация %d слоёв(я) Проекта: %s",
                        request.getLayers().size(), projectById.getInternalName()),
                ProcessType.VALIDATION, request);

        ValidationMqProcessRequest payload = new ValidationMqProcessRequest(0, 25);

        request.getLayers().forEach(layerName -> {
            FeatureDescription featureDescription = ruleService.getRuleByName(layerName);
            payload.addFeatureProjections(MapperUtil.mapFeatureDescriptionToDto(featureDescription));
            payload.addResourceProjections(
                    new ResourceProjection(DEFAULT_DB_NAME + orgId, projectById.getWorkspaceName(), layerName));
        });

        mqSender.send(new BaseMqProcessRequest(process.getId(), ProcessType.VALIDATION, payload));

        return process;
    }

    @Override
    public void handleMqResponse(BaseMqProcessResponse mqResponse) {
        if (mqResponse.getId() == null) {
            log.warn("Return invalid response");
        }

        Process process = getProcessById(mqResponse.getId());
        switch (mqResponse.getStatus()) {
            case PENDING:
            case SUB_ERROR:
            case SUB_DONE:  addSubStep(process, mqResponse);   break;
            case ERROR:     error(process, mqResponse.getError());  break;
            case DONE:      complete(process, null);           break;
            default:
                log.warn("Not supported process status. {}", process);
        }

        String wsUiId = process.getExtra().get("wsUiId").asText();
    if (ProcessType.VALIDATION.equals(mqResponse.getType())) {
            wsNotificationService.send(new WsMessageDto<>(mqResponse.getType(), mqResponse), wsUiId);
        }
    }

    private void addSubStep(Process process, BaseMqProcessResponse response) {
        process.setStatus(response.getStatus());

        try {
            String content = "{}";
            if (process.getDetails() != null) {
                content = process.getDetails().toString();
            }

            DetailsModel details = mapper.readValue(content, DetailsModel.class);

            SubProcessModel subProcess = new SubProcessModel(response.getPayload().toString(),
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
