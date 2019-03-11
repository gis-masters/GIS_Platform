package ru.mycrg.gis.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import ru.mycrg.gis.dto.GmlRequestDto;
import ru.mycrg.gis.service.gml.GmlService;

import java.util.concurrent.CompletableFuture;

@Controller
public class GmlController {

    private static Logger log = LoggerFactory.getLogger(GmlController.class);

    @Autowired
    private GmlService gmlService;

    @ResponseBody
    @PostMapping("/gml")
    public CompletableFuture<String> initGmlGeneration(@RequestBody GmlRequestDto request) {
        log.debug("Gml generation request");

        return gmlService.initProcess(request);
    }

}
