package ru.mycrg.gis.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import ru.mycrg.gis.service.import_.ImportService;
import ru.mycrg.gis.service.import_.WorkImport;

import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Controller
public class GisController {

    private static Logger log = LoggerFactory.getLogger(GisController.class);

    @Autowired
    private ImportService importService;

    @ResponseBody
    @PostMapping("/db/import")
    public CompletableFuture<Map<String, String>> initImport(@RequestBody WorkImport workImport) {
        log.debug("InitImport request");

        return importService.initProcess(workImport);
    }

}
