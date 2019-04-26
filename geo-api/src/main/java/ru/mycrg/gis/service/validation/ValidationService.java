package ru.mycrg.gis.service.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.common.ValidationMqProcessRequest;
import ru.mycrg.common.enums.RequestType;
import ru.mycrg.gis.dto.ValidationRequestDto;
import ru.mycrg.gis.dto.WsMessageDto;
import ru.mycrg.gis.queue.MqSender;
import ru.mycrg.gis.service.BaseProcessService;
import ru.mycrg.gis.service.CrgProcess;
import ru.mycrg.gis.service.WsNotificationService;
import ru.mycrg.gis.service.fgistp.EntityType;
import ru.mycrg.gis.service.fgistp.MapperUtil;
import ru.mycrg.gis.service.fgistp.rules.FgistpRuleService;

import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import static ru.mycrg.gis.enums.ProcessType.VALIDATION;

@Service
public class ValidationService extends BaseProcessService {

    private static Logger log = LoggerFactory.getLogger(ValidationService.class);

    private final MqSender mqSender;
    private final FgistpRuleService ruleService;
    private final WsNotificationService wsNotificationService;

    @Autowired
    public ValidationService(MqSender mqSender,
                             FgistpRuleService ruleService,
                             WsNotificationService wsNotificationService) {
        this.mqSender = mqSender;
        this.ruleService = ruleService;
        this.wsNotificationService = wsNotificationService;
    }

    /**
     * Запустить процесс валидации.
     *
     * @param name    Имя пользователя
     * @param request Список ресурсов {@link ValidationRequestDto}
     */
    public CompletableFuture<BaseMqProcessResponse> validate(String name,
                                                             ValidationRequestDto request,
                                                             RequestType type) {
        return initProcess(name, request, type, 0, 25);
    }

    /**
     * Получить общую информацию о валидации слоя.
     * @param name    Имя пользователя
     * @param request Список ресурсов {@link ValidationRequestDto}
     */
    public CompletableFuture<BaseMqProcessResponse> getInfo(String name,
                                                            ValidationRequestDto request,
                                                            RequestType type) {
        return initProcess(name, request, type, 0, 25);
    }

    /**
     * Выборка непосредственно ошибок валидации.
     * @param name    Имя пользователя
     * @param request Список ресурсов {@link ValidationRequestDto}
     * @param nPage   Номер страницы
     * @param nSize   Размер страницы
     */
    public CompletableFuture<BaseMqProcessResponse> getResult(String name,
                                                              ValidationRequestDto request,
                                                              RequestType type, int nPage, int nSize) {
        return initProcess(name, request, type, nPage, nSize);
    }

    private CompletableFuture<BaseMqProcessResponse> initProcess(String name,
                                                                 ValidationRequestDto request,
                                                                 RequestType type, int page, int size) {
        if (ruleService.isCacheEmpty()) {
            ruleService.updateRules();
        }

        CrgProcess process = new CrgProcess(request);

        processes.add(process);

        ValidationMqProcessRequest mqRequest = new ValidationMqProcessRequest(process.getId(), type, page, size);

        request.getResources().forEach(requestDto -> {
            EntityType entityType = ruleService.getRuleByName(requestDto.getTableName());
            mqRequest.addFeatureProjections(MapperUtil.mapEntityTypeToDto(entityType));
            mqRequest.addResourceProjections(new ResourceProjection(requestDto.getDbName(),
                    requestDto.getSchemaName(), requestDto.getTableName()));
        });

        mqSender.sendValidationRequest(mqRequest);

        return process.getFutureResponse();
    }

    @Override
    public void handleMqResponse(BaseMqProcessResponse response) {
        if (response.getId() == null) {
            log.warn("Return invalid response");
        }

        Optional<CrgProcess> processById = getProcessById(response.getId());
        if (processById.isPresent()) {
            CrgProcess process = processById.get();
            wsNotificationService.send(new WsMessageDto<>(VALIDATION, response), process.getRequest().getWsUiId());

            process.complete(response);
        } else {
            log.warn("Not found validation process by id: {}", response.getId());
        }
    }

}
