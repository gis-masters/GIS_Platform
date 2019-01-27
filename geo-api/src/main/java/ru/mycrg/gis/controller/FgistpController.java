package ru.mycrg.gis.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.gis.dto.ValidationRequestDto;
import ru.mycrg.gis.service.fgistp.EntityType;
import ru.mycrg.gis.service.fgistp.rules.FgistpRuleService;
import ru.mycrg.gis.service.fgistp.rules.FgistpRules;
import ru.mycrg.gis.service.validation.IValidationService;

import java.security.Principal;
import java.util.List;

@Controller
public class FgistpController {

    private static Logger log = LoggerFactory.getLogger(FgistpController.class);

    @Autowired
    private FgistpRuleService fgistpRuleService;

    @Autowired
    private IValidationService validationService;

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

        return fgistpRuleService.getRuleByClassName(className);
    }

    @ResponseBody
    @PostMapping("/fgistp/validation")
    public HttpStatus initValidation(@RequestBody List<ValidationRequestDto> request, Principal principal) {
        log.info("Request validation: {}", request.size());

        validationService.initValidation(principal.getName(), request);

        return HttpStatus.ACCEPTED;
    }

}
