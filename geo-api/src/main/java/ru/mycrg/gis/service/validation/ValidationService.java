package ru.mycrg.gis.service.validation;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.common.ValidationMqProcessRequest;
import ru.mycrg.common.ValidationMqResponse;
import ru.mycrg.common.enums.ProcessType;
import ru.mycrg.gis.dto.*;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.queue.IMqEvents;
import ru.mycrg.gis.queue.MqSender;
import ru.mycrg.gis.repository.ProcessRepository;
import ru.mycrg.gis.service.*;
import ru.mycrg.gis.service.fgistp.EntityType;
import ru.mycrg.gis.service.fgistp.MapperUtil;
import ru.mycrg.gis.service.fgistp.rules.FgistpRuleService;

import java.io.IOException;
import java.security.Principal;

import static ru.mycrg.common.CrgConstants.DEFAULT_DB_NAME;

@Service
public class ValidationService extends BaseProcessService {

    private static Logger log = LoggerFactory.getLogger(ValidationService.class);

    private final IMqEvents mqEvents;
    private final FgistpRuleService ruleService;
    private final ProjectService projectService;
    private final OrganizationService organizationService;
    private final WsNotificationService wsNotificationService;

    @Autowired
    public ValidationService(MqSender mqEvents,
                             FgistpRuleService ruleService,
                             ProjectService projectService,
                             ProcessRepository processRepository,
                             OrganizationService organizationService,
                             WsNotificationService wsNotificationService) {
        super(processRepository);

        this.mqEvents = mqEvents;
        this.ruleService = ruleService;
        this.projectService = projectService;
        this.organizationService = organizationService;
        this.wsNotificationService = wsNotificationService;
    }

    /**
     * Запустить процесс валидации.
     *
     * @param orgId     Организация
     * @param projectId Проект
     * @param principal
     * @param request   Список ресурсов {@link ValidationRequestDto}
     */
    public Process validate(Long orgId, Long projectId, Principal principal, ValidationRequestDto request) {
        if (ruleService.isCacheEmpty()) {
            ruleService.updateRules();
        }

        ProjectModel projectById = projectService.getProject(orgId, projectId, principal);
        Process process = create(principal.getName(), "", ProcessType.VALIDATION_INIT, request);

        ValidationMqProcessRequest mqRequest = new ValidationMqProcessRequest(process.getId(),
                ProcessType.VALIDATION_INIT, 0, 25);

        request.getLayers().forEach(layerName -> {
            EntityType entityType = ruleService.getRuleByName(layerName);
            mqRequest.addFeatureProjections(MapperUtil.mapEntityTypeToDto(entityType));
            mqRequest.addResourceProjections(
                    new ResourceProjection(DEFAULT_DB_NAME + orgId, projectById.getWorkspaceName(), layerName));
        });

        mqEvents.sendValidationRequest(mqRequest);

        return process;
    }

    /**
     * Получить общую информацию о валидации слоя.
     *
     * @param orgId     Организация
     * @param projectId Проект
     * @param principal
     * @param request   Список ресурсов {@link ValidationRequestDto}
     */
    public Process getInfo(Long orgId, Long projectId, Principal principal, ValidationRequestDto request) {
        return initProcess(orgId, projectId, principal, request, ProcessType.VALIDATION_INFO, 0, 25);
    }

    /**
     * Выборка непосредственно ошибок валидации.
     * @param orgId     Организация
     * @param projectId Проект
     * @param principal
     * @param layerName Название слоя
     * @param nPage     Номер страницы
     * @param nSize     Размер страницы
     */
    public Process getResult(Long orgId, Long projectId, Principal principal, String layerName, int nPage, int nSize) {
        return initProcess(orgId, projectId, principal, new ValidationRequestDto(layerName),
                ProcessType.VALIDATION_GET, nPage, nSize);
    }

    private Process initProcess(Long orgId, Long projectId, Principal principal, ValidationRequestDto request,
                                ProcessType type, int page, int size) {
        if (ruleService.isCacheEmpty()) {
            ruleService.updateRules();
        }

        ProjectModel projectById = projectService.getProject(orgId, projectId, principal);
        Process process = create(principal.getName(), "", type, request);

        ValidationMqProcessRequest mqRequest = new ValidationMqProcessRequest(process.getId(), type, page, size);

        request.getLayers().forEach(layerName -> {
            EntityType entityType = ruleService.getRuleByName(layerName);
            mqRequest.addFeatureProjections(MapperUtil.mapEntityTypeToDto(entityType));
            mqRequest.addResourceProjections(
                    new ResourceProjection(DEFAULT_DB_NAME + orgId, projectById.getWorkspaceName(), layerName));
        });

        mqEvents.sendValidationRequest(mqRequest);

        return process;
    }

    @Override
    public void handleMqResponse(BaseMqProcessResponse response) {
        ValidationMqResponse mqResponse = (ValidationMqResponse) response;
        if (mqResponse.getId() == null) {
            log.warn("Return invalid response");
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

        String wsUiId = process.getExtra().get("wsUiId").toString();
        if (ProcessType.VALIDATION_INIT.equals(mqResponse.getType())) {
            wsNotificationService.send(new WsMessageDto<>(mqResponse.getType(), mqResponse), wsUiId);
        }
    }

    private void addSubStep(Process process, ValidationMqResponse response) {
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
