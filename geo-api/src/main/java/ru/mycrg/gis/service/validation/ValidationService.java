package ru.mycrg.gis.service.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.common.ValidationMqRequest;
import ru.mycrg.common.enums.RequestType;
import ru.mycrg.gis.dto.ValidationRequestDto;
import ru.mycrg.gis.dto.ValidationResponseDto;
import ru.mycrg.gis.queue.MqSender;
import ru.mycrg.gis.service.BaseProcessService;
import ru.mycrg.gis.service.fgistp.EntityType;
import ru.mycrg.gis.service.fgistp.MapperUtil;
import ru.mycrg.gis.service.fgistp.rules.FgistpRuleService;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class ValidationService extends BaseProcessService {

    private static Logger log = LoggerFactory.getLogger(ValidationService.class);

    private final MqSender mqSender;
    private final FgistpRuleService ruleService;

    @Autowired
    public ValidationService(MqSender mqSender,
                             FgistpRuleService ruleService) {
        this.mqSender = mqSender;
        this.ruleService = ruleService;
    }

    /**
     * Запустить процесс валидации.
     *
     * @param name    Имя пользователя
     * @param request Список ресурсов {@link ValidationRequestDto}
     */
    public CompletableFuture<List<ValidationResponseDto>> validate(String name,
                                                                   List<ValidationRequestDto> request) {
        return initProcess(name, request, 0, 25, RequestType.INIT);
    }

    /**
     * Получить общую информацию о валидации слоя.
     *
     * @param name    Имя пользователя
     * @param request Список ресурсов {@link ValidationRequestDto}
     */
    public CompletableFuture<List<ValidationResponseDto>> getInfo(String name,
                                                                  List<ValidationRequestDto> request) {
        return initProcess(name, request, 0, 25, RequestType.INFO);
    }

    /**
     * Выборка непосредственно ошибок валидации.
     *
     * @param name    Имя пользователя
     * @param request Список ресурсов {@link ValidationRequestDto}
     * @param nPage   Номер страницы
     * @param nSize   Размер страницы
     */
    public CompletableFuture<List<ValidationResponseDto>> getResult(String name,
                                                                    List<ValidationRequestDto> request,
                                                                    int nPage, int nSize) {
        return initProcess(name, request, nPage, nSize, RequestType.GET);
    }

    private CompletableFuture<List<ValidationResponseDto>> initProcess(String userName,
                                                                       List<ValidationRequestDto> request,
                                                                       int page, int size,
                                                                       RequestType type) {
        if (ruleService.isCacheEmpty()) {
            ruleService.updateRules();
        }

        ValidationProcess process = new ValidationProcess();
        process.setUserName(userName);
        process.setRequestType(type);
        process.addRequest(request);

        processes.add(process);

        process.getRequests().forEach(requestDto -> {
            ValidationMqRequest mqRequest = new ValidationMqRequest(process.getId(), type, page, size);

            EntityType entityType = ruleService.getRuleByName(requestDto.getTableName());
            mqRequest.addFeatureProjections(MapperUtil.mapEntityTypeToDto(entityType));
            mqRequest.addResourceProjections(new ResourceProjection(requestDto.getDbName(),
                    requestDto.getSchemaName(), requestDto.getTableName()));

            mqSender.sendValidationRequest(mqRequest);
        });

        return process.getFutureResponse();
    }

}
