package ru.mycrg.gis.service.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.common.ValidationResponse;
import ru.mycrg.gis.queue.MqSender;
import ru.mycrg.gis.service.fgistp.EntityType;
import ru.mycrg.gis.service.fgistp.MapperUtil;
import ru.mycrg.gis.service.fgistp.rules.FgistpRuleService;

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
    public void initValidation(String className) {

        if (ruleService.isCacheEmpty()) {
            ruleService.updateRules();
        }

        EntityType entityType = ruleService.getRuleByClassName(className);

        mqSender.startValidation(MapperUtil.mapEntityTypeToDto(entityType));
    }

    @Override
    public void progress(ValidationResponse response) {
        if (response.isDone()) {
            log.info("Validation done");
        }
    }
}
