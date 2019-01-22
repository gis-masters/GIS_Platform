package ru.mycrg.gis.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;
import ru.mycrg.gis.dto.TableProjection;

import java.util.List;

@Controller
public class ValidationController {

    private static Logger log = LoggerFactory.getLogger(ValidationController.class);

    @ResponseBody
    @GetMapping("/validation/{}")
    public List<TableProjection> getDbTables(@PathVariable String name) {
        log.info("Request validation: {}", name);

        return validationService.validate(name);
    }

}
