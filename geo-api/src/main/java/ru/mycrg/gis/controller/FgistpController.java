package ru.mycrg.gis.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import javassist.NotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.gis.dto.TableProjection;
import ru.mycrg.gis.dto.fgistp.FgistpClassType;
import ru.mycrg.gis.dto.fgistp.FgistpRules;
import ru.mycrg.gis.exceptions.CrgNotFoundException;
import ru.mycrg.gis.service.GisStorageDaoService;
import ru.mycrg.gis.service.WorkImport;
import ru.mycrg.gis.service.fgistp.FgistpRuleNotFoundException;
import ru.mycrg.gis.service.fgistp.FgistpRuleService;

import java.util.List;

@Controller
public class FgistpController {

    private static Logger log = LoggerFactory.getLogger(FgistpController.class);

    @Autowired
    private FgistpRuleService fgistpRuleService;

    @ResponseBody
    @GetMapping("/fgistp/rules")
    public FgistpRules getRules() {
        log.info("Request /fgistp/rules");

        return fgistpRuleService.getRules();
    }

    @ResponseBody
    @GetMapping("/fgistp/rules/update")
    public FgistpRules update() {
        log.info("Request for update rules");

        return fgistpRuleService.updateRules();
    }

    @ResponseBody
    @GetMapping("/fgistp/rules/{className}")
    public FgistpClassType getByName(@PathVariable String className) {
        log.info("Get rule by name: {}", className);

        try {
            return fgistpRuleService.getRuleByClassName(className);
        } catch (FgistpRuleNotFoundException e) {
            log.error("");

            throw new CrgNotFoundException("Not found rule by name: " + className);
        }
    }

}
