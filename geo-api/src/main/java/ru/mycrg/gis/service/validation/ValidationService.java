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
import ru.mycrg.gis.dto.ValidationRequestDto;
import ru.mycrg.gis.dto.WsMessageDto;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.entity.Project;
import ru.mycrg.gis.queue.MqSender;
import ru.mycrg.gis.repository.ProcessRepository;
import ru.mycrg.gis.service.*;
import ru.mycrg.gis.service.fgistp.EntityType;
import ru.mycrg.gis.service.fgistp.MapperUtil;
import ru.mycrg.gis.service.fgistp.rules.FgistpRuleService;

import java.io.IOException;
import java.util.Optional;

import static ru.mycrg.common.CrgConstants.DEFAULT_DB_NAME;

@Service
public class ValidationService extends BaseProcessService {

    private static Logger log = LoggerFactory.getLogger(ValidationService.class);

    private final MqSender mqSender;
    private final FgistpRuleService ruleService;
    private final OrganizationService organizationService;
    private final WsNotificationService wsNotificationService;

    @Autowired
    public ValidationService(MqSender mqSender,
                             FgistpRuleService ruleService,
                             ProcessRepository processRepository,
                             OrganizationService organizationService,
                             WsNotificationService wsNotificationService) {
        super(processRepository);

        this.mqSender = mqSender;
        this.ruleService = ruleService;
        this.organizationService = organizationService;
        this.wsNotificationService = wsNotificationService;
    }

    /**
     * Запустить процесс валидации.
     *
     * @param orgId     Организация
     * @param projectId Проект
     * @param userName  Имя пользователя
     * @param request   Список ресурсов {@link ValidationRequestDto}
     */
    public Process validate(Long orgId, Long projectId, String userName, ValidationRequestDto request) {
        return initProcess(orgId, projectId, userName, request, ProcessType.VALIDATION_INIT, 0, 25);
    }

    /**
     * Получить общую информацию о валидации слоя.
     *
     * @param orgId     Организация
     * @param projectId Проект
     * @param userName  Имя пользователя
     * @param request   Список ресурсов {@link ValidationRequestDto}
     */
    public Process getInfo(Long orgId, Long projectId, String userName, ValidationRequestDto request) {
        return initProcess(orgId, projectId, userName, request, ProcessType.VALIDATION_INFO, 0, 25);
    }

    /**
     * Выборка непосредственно ошибок валидации.
     *
     * @param orgId     Организация
     * @param projectId Проект
     * @param userName  Имя пользователя
     * @param request   Список ресурсов {@link ValidationRequestDto}
     * @param nPage     Номер страницы
     * @param nSize     Размер страницы
     */
    public Process getResult(Long orgId, Long projectId, String userName, ValidationRequestDto request, int nPage, int nSize) {
        return initProcess(orgId, projectId, userName, request, ProcessType.VALIDATION_GET, nPage, nSize);
    }

    private Process initProcess(Long orgId, Long projectId, String userName, ValidationRequestDto request,
                                ProcessType type, int page, int size) {
        if (ruleService.isCacheEmpty()) {
            ruleService.updateRules();
        }

        Project projectById = organizationService.getProjectById(orgId, projectId);
        Process process = create(userName, "", type, request);

        ValidationMqProcessRequest mqRequest = new ValidationMqProcessRequest(process.getId(), type, page, size);

        request.getLayers().forEach(layerName -> {
            EntityType entityType = ruleService.getRuleByName(layerName);
            mqRequest.addFeatureProjections(MapperUtil.mapEntityTypeToDto(entityType));
            mqRequest.addResourceProjections(
                    new ResourceProjection(DEFAULT_DB_NAME + orgId, projectById.getGeoserverName(), layerName));
        });

        mqSender.sendValidationRequest(mqRequest);

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
            case SUB_DONE:  addSubStep(process, mqResponse);   break;
            case ERROR:     error(process);     break;
            case DONE:      complete(process);  break;
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
