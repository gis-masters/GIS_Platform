package ru.mycrg.gis.service.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.common.ValidationMqProcessRequest;
import ru.mycrg.common.enums.ProcessType;
import ru.mycrg.gis.dto.ValidationRequestDto;
import ru.mycrg.gis.dto.WsMessageDto;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.queue.MqSender;
import ru.mycrg.gis.service.*;
import ru.mycrg.gis.service.fgistp.EntityType;
import ru.mycrg.gis.service.fgistp.MapperUtil;
import ru.mycrg.gis.service.fgistp.rules.FgistpRuleService;

import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Service
public class ValidationService implements Processable {

    private static Logger log = LoggerFactory.getLogger(ValidationService.class);

    private final MqSender mqSender;
    private final FgistpRuleService ruleService;
    private final ProcessService processService;
    private final WsNotificationService wsNotificationService;

    @Autowired
    public ValidationService(MqSender mqSender,
                             FgistpRuleService ruleService,
                             ProcessService processService,
                             WsNotificationService wsNotificationService) {
        this.mqSender = mqSender;
        this.ruleService = ruleService;
        this.processService = processService;
        this.wsNotificationService = wsNotificationService;
    }

    /**
     * Запустить процесс валидации.
     *
     * @param userName Имя пользователя
     * @param request  Список ресурсов {@link ValidationRequestDto}
     */
    public Process validate(String userName, ValidationRequestDto request) {
        return initProcess(userName, request, ProcessType.VALIDATION_INIT, 0, 25);
    }

    /**
     * Получить общую информацию о валидации слоя.
     *
     * @param userName Имя пользователя
     * @param request  Список ресурсов {@link ValidationRequestDto}
     */
    public Process getInfo(String userName, ValidationRequestDto request) {
        return initProcess(userName, request, ProcessType.VALIDATION_INFO, 0, 25);
    }

    /**
     * Выборка непосредственно ошибок валидации.
     *
     * @param userName Имя пользователя
     * @param request  Список ресурсов {@link ValidationRequestDto}
     * @param nPage    Номер страницы
     * @param nSize    Размер страницы
     */
    public Process getResult(String userName, ValidationRequestDto request, int nPage, int nSize) {
        return initProcess(userName, request, ProcessType.VALIDATION_GET, nPage, nSize);
    }

    private Process initProcess(String userName, ValidationRequestDto request, ProcessType type, int page, int size) {
        if (ruleService.isCacheEmpty()) {
            ruleService.updateRules();
        }

        Process process = processService.create(userName, "", type, request);

        ValidationMqProcessRequest mqRequest = new ValidationMqProcessRequest(process.getId(), type, page, size);

        request.getResources().forEach(requestDto -> {
            EntityType entityType = ruleService.getRuleByName(requestDto.getTableName());
            mqRequest.addFeatureProjections(MapperUtil.mapEntityTypeToDto(entityType));
            mqRequest.addResourceProjections(new ResourceProjection(requestDto.getDbName(),
                    requestDto.getSchemaName(), requestDto.getTableName()));
        });

        mqSender.sendValidationRequest(mqRequest);

        return process;
    }

    @Override
    public void handleMqResponse(BaseMqProcessResponse response) {
        if (response.getId() == null) {
            log.warn("Return invalid response");
        }

        Optional<Process> processById = processService.getProcessById(response.getId());
        if (processById.isPresent()) {
            Process process = processById.get();

//            if (ProcessType.VALIDATION_INIT.equals(response.getType())) {
//                wsNotificationService.send(new WsMessageDto<>(response.getType(), response), process.getRequest().getWsUiId());
//            }

            processService.complete(process);
        } else {
            log.warn("Not found validation process by id: {}", response.getId());
        }
    }

}
