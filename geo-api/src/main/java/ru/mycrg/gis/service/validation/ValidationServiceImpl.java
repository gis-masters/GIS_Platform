package ru.mycrg.gis.service.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.common.ValidationRequest;
import ru.mycrg.common.ValidationResponse;
import ru.mycrg.gis.dto.ValidationRequestDto;
import ru.mycrg.gis.queue.MqSender;
import ru.mycrg.gis.service.fgistp.EntityType;
import ru.mycrg.gis.service.fgistp.MapperUtil;
import ru.mycrg.gis.service.fgistp.rules.FgistpRuleService;

import java.util.List;

@Service
public class ValidationServiceImpl implements IValidationService {

    private static Logger log = LoggerFactory.getLogger(ValidationServiceImpl.class);

    private final MqSender mqSender;
    private final FgistpRuleService ruleService;

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

        request.forEach(requestDto -> {
            EntityType entityType = ruleService.getRuleByClassName(requestDto.getTableName());

            ValidationRequest payload = new ValidationRequest();
            payload.setDbName(requestDto.getDbName());
            payload.setSchemaName(requestDto.getSchemaName());
            payload.setEntityType(MapperUtil.mapEntityTypeToDto(entityType));

            mqSender.startValidation(payload);
        });
    }

    @Override
    public void progress(ValidationResponse response) {
        if (response.isPending() || response.isDone()) {

            log.info("========== {} / found violations: {}", response.getTableName(), response.getViolations().size());
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
}
