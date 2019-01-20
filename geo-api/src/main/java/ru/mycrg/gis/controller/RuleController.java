package ru.mycrg.gis.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;
import ru.mycrg.gis.service.fgistp.EntityType;
import ru.mycrg.gis.service.fgistp.FgistpRules;
import ru.mycrg.gis.exceptions.CrgNotFoundException;
import ru.mycrg.gis.service.fgistp.FgistpRuleNotFoundException;
import ru.mycrg.gis.service.fgistp.FgistpRuleService;

@Controller
public class RuleController {

    private static Logger log = LoggerFactory.getLogger(RuleController.class);

    @Autowired
    private FgistpRuleService fgistpRuleService;

    @ResponseBody
    @GetMapping("/fgistp/rules")
    public FgistpRules getRules() {
        log.info("Request /fgistp/rules");

        if (fgistpRuleService.isXsdRulesEmpty()) {
            log.warn("Not found rules in DB. Try generate new from default source.");

            return fgistpRuleService.loadRulesFromXsdSchema();
        } else {
            FgistpRules rules = fgistpRuleService.getRules();

            if (rules.getEntityTypes().isEmpty()) {
                return fgistpRuleService.updateRules();
            } else {
                return rules;
            }
        }
    }

    @ResponseBody
    @GetMapping("/fgistp/rules/update")
    public FgistpRules update() {
        log.info("Request for update rules");

        return fgistpRuleService.updateRules();
    }

    @ResponseBody
    @GetMapping("/fgistp/rules/{className}")
    public EntityType getByName(@PathVariable String className) {
        log.info("Get rule by name: {}", className);

        try {
            return fgistpRuleService.getRuleByClassName(className);
        } catch (FgistpRuleNotFoundException e) {
            log.error("");

            throw new CrgNotFoundException("Not found rule by name: " + className);
        }
    }

}
