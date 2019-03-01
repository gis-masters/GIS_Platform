package ru.mycrg.gis.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import ru.mycrg.gis.service.fgistp.rules.FgistpRuleService;

@Component
public class InitApplication {

    private static Logger log = LoggerFactory.getLogger(InitApplication.class);

    private final FgistpRuleService ruleService;

    public InitApplication(FgistpRuleService ruleService) {
        this.ruleService = ruleService;
    }

    @EventListener(ContextRefreshedEvent.class)
    public void contextRefreshedEvent() {
        log.debug("Context refreshed event");

        if (ruleService.isXsdRulesEmpty()) {
            ruleService.loadRulesFromXsdSchema();
        }
    }
}
