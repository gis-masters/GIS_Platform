package ru.mycrg.gis.service.validation;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.common.ValidationMqRequest;
import ru.mycrg.common.ValidationMqResponse;
import ru.mycrg.gis.dto.ValidationRequestDto;
import ru.mycrg.gis.queue.MqSender;
import ru.mycrg.gis.service.fgistp.EntityType;
import ru.mycrg.gis.service.fgistp.MapperUtil;
import ru.mycrg.gis.service.fgistp.rules.FgistpRuleService;

import java.util.*;

@Service
public class ValidationServiceImpl implements IValidationService {

    private static Logger log = LoggerFactory.getLogger(ValidationServiceImpl.class);

    private final MqSender mqSender;
    private final FgistpRuleService ruleService;

    private List<ValidationProcess> processes = new ArrayList<>();

    @Autowired
    public ValidationServiceImpl(MqSender mqSender, FgistpRuleService ruleService) {
        this.mqSender = mqSender;
        this.ruleService = ruleService;
    }

    @Override
    public void initValidation(String userName, List<ValidationRequestDto> request) {
        if (ruleService.isCacheEmpty()) {
            ruleService.updateRules();
        }

        request
                .stream()
                .map(this::registerValidationRequest)
                .map(this::preparePayload)
                .forEach(mqSender::startValidation);
    }

    @Override
    public void progress(ValidationMqResponse response) {
        if (response.isPending() || response.isDone()) {
            getProcessById(response.getId())
                    .ifPresentOrElse(process -> process.addResponse(response),
                    () -> log.warn("Not found validation process by id: {}", response.getId()));

            log.info("========== {} / found violations: {}", response.getId(), response.getViolations().size());
            response.getViolations().forEach(constraintViolation -> {
                log.info("*** {} ***", constraintViolation.getId());
                constraintViolation.getPropertyViolations().forEach(propertyViolation -> {
                    log.info("    {}", propertyViolation.getName());
                    propertyViolation.getErrors().forEach(s -> log.info("       - {}", s));
                });
            });
        }

        if (response.isEmpty()) {
            log.info("Try validate empty table!");
        }
    }

    private RegistrationInfo registerValidationRequest(ValidationRequestDto requestDto) {
        ValidationProcess validationProcess = new ValidationProcess();
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