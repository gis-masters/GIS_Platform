package ru.mycrg.gis.service.validation;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vladmihalcea.hibernate.type.json.internal.JacksonUtil;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.common.PropertyViolation;
import ru.mycrg.common.ValidationMqRequest;
import ru.mycrg.common.ValidationMqResponse;
import ru.mycrg.common.enums.ValidationStatus;
import ru.mycrg.gis.dto.ValidationRequestDto;
import ru.mycrg.gis.entity.User;
import ru.mycrg.gis.entity.ValidationResult;
import ru.mycrg.gis.exceptions.ValidationAlreadyStartedException;
import ru.mycrg.gis.queue.MqSender;
import ru.mycrg.gis.repository.UserRepository;
import ru.mycrg.gis.repository.ValidationResultRepository;
import ru.mycrg.gis.service.fgistp.EntityType;
import ru.mycrg.gis.service.fgistp.MapperUtil;
import ru.mycrg.gis.service.fgistp.rules.FgistpRuleService;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static ru.mycrg.gis.service.validation.ValidationRequestType.SAME_DATA;
import static ru.mycrg.gis.service.validation.ValidationRequestType.SAME_USER;
import static ru.mycrg.gis.service.validation.ValidationRequestType.UNIQE;

@Service
public class ValidationServiceImpl implements IValidationService {

    private static Logger log = LoggerFactory.getLogger(ValidationServiceImpl.class);

    private final MqSender mqSender;
    private final FgistpRuleService ruleService;
//    private final UserRepository userRepository;
//    private final ValidationResultRepository validationResultRepository;

    private List<ValidationProcess> processes = new ArrayList<>();

    @Autowired
    public ValidationServiceImpl(MqSender mqSender,
                                 FgistpRuleService ruleService,
                                 UserRepository userRepository,
                                 ValidationResultRepository validationResultRepository) {
        this.mqSender = mqSender;
        this.ruleService = ruleService;
//        this.userRepository = userRepository;
//        this.validationResultRepository = validationResultRepository;
    }

    @Override
    public void initValidation(String userName, List<ValidationRequestDto> request) {
        if (ruleService.isCacheEmpty()) {
            ruleService.updateRules();
        }

        request.stream()
                .map((ValidationRequestDto requestDto) -> initValidationProcess(requestDto, userName))
                .forEach(mqSender::startValidation);
    }

    @Override
    public void progress(ValidationMqResponse response) {
        if (response.isPending() || response.isDone()) {
            getProcessById(response.getId())
                    .ifPresentOrElse(process -> {
                                // TODO После или при добавлении ответа определять завершен ли процесс
                                process.addResponse(response);
                            },
                            () -> log.warn("Not found validation process by id: {}", response.getId()));
        }

        if (response.isEmpty()) {
            log.info("Try validate empty table!");

            getProcessById(response.getId())
                    .ifPresentOrElse(process -> {
                                process.setStatus(ValidationStatus.EMPTY);
                            },
                            () -> log.warn("Not found validation process by id: {}", response.getId()));
        } else if (response.isError()) {
            getProcessById(response.getId())
                    .ifPresentOrElse(process -> {
                                process.setStatus(ValidationStatus.ERROR);
                            },
                            () -> log.warn("Not found validation process by id: {}", response.getId()));
        }
    }

//    private JsonNode convertToJson(List<PropertyViolation> propertyViolations) {
//        try {
//            String asString = new ObjectMapper().writer()
//                    .withDefaultPrettyPrinter()
//                    .writeValueAsString(propertyViolations);
//            return JacksonUtil.toJsonNode(asString);
//        } catch (JsonProcessingException e) {
//            log.error("Failed convert to json: {}", e.getMessage());
//
//            return JacksonUtil.toJsonNode("");
//        }
//    }

    private Optional<ValidationMqRequest> initValidationProcess(ValidationRequestDto requestDto, String userName) {
        switch (checkNewRequest(requestDto, userName)) {
            case UNIQE:
                log.info("UNIQE request");

                ValidationProcess validationProcess = new ValidationProcess();
                validationProcess.setUserName(userName);
                validationProcess.setRequest(requestDto);

                processes.add(validationProcess);

                return Optional.of(preparePayload(validationProcess.getId(), requestDto));
            case SAME_USER:
                // TODO: Слоя могут пересекаться в разных запросах. Например первый запрос от пользователя был
                // на валидацию слоя: функциональные зоны. А второй запрос более общий: функциональные зоны и др. слоя
                // На данный момент это не предусматриваем и вернем ошибку HttpStatus.CONFLICT
                log.info("Ignore request from SAME_USER");

                throw new ValidationAlreadyStartedException("Ожидайте выполнения предыдущего запроса");
            case SAME_DATA:
                log.warn("SAME_DATA request. Not implemented yet... Behavior as UNIQE request");

                // TODO: Пришел запрос на теже данные что обрабатываются в данный момент...
                // мы можем подложить ответ на активный запрос и в этот запрос тоже
                // в целом валидация по полной таблице происходит за секунд 5
                // данна ситуация маловероятна, но возможна
                ValidationProcess process = new ValidationProcess();
                process.setUserName(userName);
                process.setRequest(requestDto);

                processes.add(process);

                return Optional.of(preparePayload(process.getId(), requestDto));
            default:
                log.warn("Validation request unsupported type");
                return Optional.empty();
        }
    }

    private ValidationRequestType checkNewRequest(ValidationRequestDto requestDto, String userName) {
        var ref = new Object() {
            ValidationRequestType result = UNIQE;
        };

        activeProcess().forEach(process -> {
            if (userName.equals(process.getUserName())) {
                ref.result = SAME_USER;
            }

            if (process.getRequest().equals(requestDto)) {
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
