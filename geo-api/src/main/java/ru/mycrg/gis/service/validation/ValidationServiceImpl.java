package ru.mycrg.gis.service.validation;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.common.ValidationMqRequest;
import ru.mycrg.common.ValidationMqResponse;
import ru.mycrg.common.enums.RequstType;
import ru.mycrg.common.enums.ValidationStatus;
import ru.mycrg.gis.dto.ValidationRequestDto;
import ru.mycrg.gis.dto.ValidationResponseDto;
import ru.mycrg.gis.exceptions.ValidationAlreadyStartedException;
import ru.mycrg.gis.queue.MqSender;
import ru.mycrg.gis.service.fgistp.EntityType;
import ru.mycrg.gis.service.fgistp.MapperUtil;
import ru.mycrg.gis.service.fgistp.rules.FgistpRuleService;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

import static ru.mycrg.gis.service.validation.ValidationRequestType.*;

@Service
public class ValidationServiceImpl implements IValidationService {

    private static Logger log = LoggerFactory.getLogger(ValidationServiceImpl.class);

    private final MqSender mqSender;
    private final FgistpRuleService ruleService;

    private List<ValidationProcess> processes = new ArrayList<>();

    @Autowired
    public ValidationServiceImpl(MqSender mqSender,
                                 FgistpRuleService ruleService) {
        this.mqSender = mqSender;
        this.ruleService = ruleService;
    }

    @Override
    public CompletableFuture<List<ValidationResponseDto>> getResults(ValidationRequestDto request, int page, int size,
                                                               String userName) {
        if (ruleService.isCacheEmpty()) {
            ruleService.updateRules();
        }

        ValidationProcess process = new ValidationProcess();
        process.setUserName(userName);
        process.addRequest(request);

        processes.add(process);

        ValidationMqRequest validationMqRequest = new ValidationMqRequest();
        validationMqRequest.setId(process.getId());
        validationMqRequest.setDbName(request.getDbName());
        validationMqRequest.setSchemaName(request.getSchemaName());

        EntityType ruleByClassName = ruleService.getRuleByClassName(request.getTableName());
        validationMqRequest.setTableName(ruleByClassName.getTableName());

        validationMqRequest.setType(RequstType.GET);
        validationMqRequest.setPage(page);
        validationMqRequest.setSize(size);

        mqSender.startValidation(validationMqRequest);

        return process.getFutureResponse();
    }

    @Override
    public CompletableFuture<List<ValidationResponseDto>> getCommonInfo(String userName, ValidationRequestDto request) {
        if (ruleService.isCacheEmpty()) {
            ruleService.updateRules();
        }

        ValidationProcess process = new ValidationProcess();
        process.setUserName(userName);
        process.addRequest(request);

        processes.add(process);

        ValidationMqRequest validationMqRequest = new ValidationMqRequest();
        validationMqRequest.setId(process.getId());
        validationMqRequest.setDbName(request.getDbName());
        validationMqRequest.setSchemaName(request.getSchemaName());

        EntityType ruleByClassName = ruleService.getRuleByClassName(request.getTableName());
        validationMqRequest.setTableName(ruleByClassName.getTableName());

        validationMqRequest.setType(RequstType.INFO);

        mqSender.startValidation(validationMqRequest);

        return process.getFutureResponse();
    }

    @Override
    public CompletableFuture<List<ValidationResponseDto>> initValidation(String userName, List<ValidationRequestDto> request) {
        if (ruleService.isCacheEmpty()) {
            ruleService.updateRules();
        }

        ValidationProcess process = new ValidationProcess();
        process.setUserName(userName);

        request.stream()
                .distinct()
                .forEach((ValidationRequestDto requestDto) -> {
                    process.addRequest(requestDto);

                    ValidationRequestType requestType = checkNewRequest(requestDto, userName);
                    if (requestType == UNIQE || requestType == SAME_DATA) {
                        ValidationMqRequest payload = preparePayload(process.getId(), requestDto);
                        payload.setType(RequstType.INIT);

                        mqSender.startValidation(payload);
                    } else if (requestType == SAME_USER) {
                        log.info("Ignore request from SAME_USER");

                        throw new ValidationAlreadyStartedException("Ожидайте выполнения предыдущего запроса");
                    } else {
                        log.warn("Validation request unsupported type");
                    }
                });

        processes.add(process);

        return process.getFutureResponse();
    }

    @Override
    public void progress(ValidationMqResponse response) {
        if (response.getId() == null) {
            log.warn("Return invalid response");
        }

        // TODO: При валидации не комплитить ответ пустыми данными если при валидации не выявлено ошибок
        // дожидаться каких либо ошибок либо DONE статуса

        getProcessById(response.getId()).ifPresentOrElse(
                process -> process.addResponse(response),
                () -> log.warn("Not found validation process by id: {}", response.getId()));
    }

//    private ValidationProcess initValidationProcess(ValidationRequestDto requestDto, String userName) {
//        ValidationProcess process = new ValidationProcess();
//        process.setUserName(userName);
////        process.setRequest(requestDto);
//
//        processes.add(process);
//
//
//        return process;

//        switch (checkNewRequest(requestDto, userName)) {
//            case UNIQE:
//                log.info("UNIQE request");
//
//
//                return Optional.of(preparePayload(process.getId(), requestDto));
//            case SAME_USER:
//                // TODO: Слоя могут пересекаться в разных запросах. Например первый запрос от пользователя был
//                // на валидацию слоя: функциональные зоны. А второй запрос более общий: функциональные зоны и др. слоя
//                // На данный момент это не предусматриваем и вернем ошибку HttpStatus.CONFLICT
//                log.info("Ignore request from SAME_USER");
//
//                throw new ValidationAlreadyStartedException("Ожидайте выполнения предыдущего запроса");
//            case SAME_DATA:
//                log.warn("SAME_DATA request. Not implemented yet... Behavior as UNIQE request");
//
//                // TODO: Пришел запрос на теже данные что обрабатываются в данный момент...
//                // мы можем подложить ответ на активный запрос и в этот запрос тоже
//                // в целом валидация по полной таблице происходит за секунд 5
//                // данна ситуация маловероятна, но возможна
////                ValidationProcess process = new ValidationProcess();
////                process.setUserName(userName);
////                process.setRequest(requestDto);
//
////                processes.add(process);
//
//                return Optional.of(preparePayload(process.getId(), requestDto));
//            default:
//                return Optional.empty();
//        }
//    }

    private ValidationRequestType checkNewRequest(ValidationRequestDto requestDto, String userName) {
        var ref = new Object() {
            ValidationRequestType result = UNIQE;
        };

        activeProcess().forEach(process -> {
            if (userName.equals(process.getUserName())) {
                ref.result = SAME_USER;
            }

            if (process.getRequests().contains(requestDto)) {
                ref.result = SAME_DATA;
            }
        });

        return ref.result;
    }

    @NotNull
    private ValidationMqRequest preparePayload(UUID id, ValidationRequestDto requestDto) {
        EntityType entityType = ruleService.getRuleByClassName(requestDto.getTableName());

        return new ValidationMqRequest(
                id,
                requestDto.getDbName(),
                requestDto.getSchemaName(),
                MapperUtil.mapEntityTypeToDto(entityType));
    }

    private Optional<ValidationProcess> getProcessById(UUID id) {
        return processes.stream()
                .filter(processInfo -> processInfo.getId().equals(id))
                .findFirst();

    }

    private List<ValidationProcess> activeProcess() {
        return processes
                .stream()
                .filter(process -> process.getStatus() == ValidationStatus.PENDING)
                .collect(Collectors.toList());
    }

}
