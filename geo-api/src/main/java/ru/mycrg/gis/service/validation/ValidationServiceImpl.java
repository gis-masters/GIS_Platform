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
import ru.mycrg.gis.dto.ValidationRequestDto;
import ru.mycrg.gis.entity.User;
import ru.mycrg.gis.entity.ValidationResult;
import ru.mycrg.gis.queue.MqSender;
import ru.mycrg.gis.repository.UserRepository;
import ru.mycrg.gis.repository.ValidationResultRepository;
import ru.mycrg.gis.service.fgistp.EntityType;
import ru.mycrg.gis.service.fgistp.MapperUtil;
import ru.mycrg.gis.service.fgistp.rules.FgistpRuleService;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ValidationServiceImpl implements IValidationService {

    private static Logger log = LoggerFactory.getLogger(ValidationServiceImpl.class);

    private final MqSender mqSender;
    private final FgistpRuleService ruleService;
    private final UserRepository userRepository;
    private final ValidationResultRepository validationResultRepository;

    private List<ValidationProcess> processes = new ArrayList<>();

    @Autowired
    public ValidationServiceImpl(MqSender mqSender,
                                 FgistpRuleService ruleService,
                                 UserRepository userRepository,
                                 ValidationResultRepository validationResultRepository) {
        this.mqSender = mqSender;
        this.ruleService = ruleService;
        this.userRepository = userRepository;
        this.validationResultRepository = validationResultRepository;
    }

    @Override
    public void initValidation(String userName, List<ValidationRequestDto> request) {
        if (ruleService.isCacheEmpty()) {
            ruleService.updateRules();
        }

        request
                .stream()
                .map((ValidationRequestDto requestDto) -> initValidationProcess(requestDto, userName))
                .map(this::preparePayload)
                .forEach(mqSender::startValidation);
    }

    @Override
    public void progress(ValidationMqResponse response) {
        if (response.isPending() || response.isDone()) {
            getProcessById(response.getId())
                    .ifPresentOrElse(process -> {
                        process.addResponse(response);
                        persistResponse(process, response);
                    },
                    () -> log.warn("Not found validation process by id: {}", response.getId()));
        }

        if (response.isEmpty()) {
            log.info("Try validate empty table!");
        }
    }

    @Transactional
    public void persistResponse(ValidationProcess process, ValidationMqResponse response) {
        if (!response.getViolations().isEmpty()) {
            log.info("Response has: {} violations", response.getViolations().size());

            User user = userRepository.findUserByUsername(process.getUserName()).get();

            response.getViolations().forEach(constraintViolation -> {
                ValidationResult validationResult = new ValidationResult();
                validationResult.setUser(user);
                validationResult.setLastModified(LocalDateTime.now());
                validationResult.setObjectId(constraintViolation.getId());
                validationResult.setViolations(convertToJson(constraintViolation.getPropertyViolations()));

                validationResultRepository.save(validationResult);
            });
        } else {
            log.info("validation result empty");
        }
    }

    private JsonNode convertToJson(List<PropertyViolation> propertyViolations) {
        try {
            String asString = new ObjectMapper().writer()
                    .withDefaultPrettyPrinter()
                    .writeValueAsString(propertyViolations);
            return JacksonUtil.toJsonNode(asString);
        } catch (JsonProcessingException e) {
            log.error("Failed convert to json: {}", e.getMessage());

            return JacksonUtil.toJsonNode("");
        }
    }

    private RegistrationInfo initValidationProcess(ValidationRequestDto requestDto, String userName) {
        ValidationProcess validationProcess = new ValidationProcess();
        validationProcess.setUserName(userName);
        validationProcess.setRequest(requestDto);

        processes.add(validationProcess);

        return new RegistrationInfo(validationProcess.getId(), requestDto);
    }

    @NotNull
    private ValidationMqRequest preparePayload(RegistrationInfo info) {
        ValidationRequestDto requestDto = info.getRequestDto();

        EntityType entityType = ruleService.getRuleByClassName(requestDto.getTableName());

        return new ValidationMqRequest(
                info.getId(),
                requestDto.getDbName(),
                requestDto.getSchemaName(),
                MapperUtil.mapEntityTypeToDto(entityType));
    }

    private Optional<ValidationProcess> getProcessById(UUID id) {
        return processes.stream()
                .filter(processInfo -> processInfo.getId().equals(id))
                .findFirst();
    }

}

class RegistrationInfo {
    private UUID id;
    private ValidationRequestDto requestDto;

    public RegistrationInfo(UUID id, ValidationRequestDto requestDto) {
        this.id = id;
        this.requestDto = requestDto;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public ValidationRequestDto getRequestDto() {
        return requestDto;
    }

    public void setRequestDto(ValidationRequestDto requestDto) {
        this.requestDto = requestDto;
    }
}