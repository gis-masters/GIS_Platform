package ru.mycrg.gis.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.common.GmlMqResponse;
import ru.mycrg.gis.dto.WsMessageDto;
import ru.mycrg.gis.enums.ProcessType;
import ru.mycrg.gis.service.WsNotificationService;
import ru.mycrg.gis.service.import_.ImportService;
import ru.mycrg.gis.service.import_.WorkImport;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Controller
public class GisController {

    private static Logger log = LoggerFactory.getLogger(GisController.class);

    @Autowired
    private ImportService importService;

    @Autowired
    private WsNotificationService notificationService;

    @ResponseBody
    @PostMapping("/db/import")
    public CompletableFuture<Map<String, String>> initImport(@RequestBody WorkImport workImport) {
        log.debug("InitImport request");

        return importService.initProcess(workImport);
    }

    @ResponseBody
    @GetMapping("/testws")
    public String initImport(@RequestParam("stringId") String stringId) {
        log.debug("++++ ---- {}", stringId);

        GmlMqResponse mqResponse = new GmlMqResponse();
        mqResponse.setId(UUID.randomUUID());

        WsMessageDto payload = new WsMessageDto();
        payload.setType(ProcessType.EXPORT);
        payload.setPayload(mqResponse);

        notificationService.send(payload, stringId);

        return "OK";
    }

}
