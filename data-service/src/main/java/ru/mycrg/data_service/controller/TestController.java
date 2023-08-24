package ru.mycrg.data_service.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.data_service.queue.MessageBusProducer;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;
import ru.mycrg.gisog_service_contract.ResponseFromGisogdRfEvent;
import ru.mycrg.gisog_service_contract.dto.Document;
import ru.mycrg.gisog_service_contract.dto.Status;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
public class TestController extends BaseController {

    private static final Logger log = LoggerFactory.getLogger(TestController.class);

    private final MessageBusProducer messageBusProducer;

    public TestController(MessageBusProducer messageBusProducer) {
        this.messageBusProducer = messageBusProducer;
    }

    @GetMapping("/fiz-fiz")
    public ResponseEntity<?> test(@RequestParam(defaultValue = "1") Long taskId,
                                  @RequestParam(defaultValue = "SUCCESS") Status status) {
        log.debug("TestController: {}", taskId);

        Map<String, Object> content = new HashMap<>();
        content.put("id", taskId);

        Document parent = new Document();
        parent.setGuid(UUID.randomUUID());
        parent.setName("dl_data_section13");
        parent.setSchema("data");
        parent.setContentType("dl_data_section13");
        parent.setContent(content);

        PublishToGisogdRfEvent publishToGisogdRfEvent =
                new PublishToGisogdRfEvent(1L, taskId, parent, new ArrayList<>());

        Map<String, String> errors = new HashMap<>();
        errors.put("Date", "The Date field is required.");
        errors.put("Number", "The Date field is required.");
        errors.put("PersonName", "The Date field is required.");

        ResponseFromGisogdRfEvent responseFromGisogdRfEvent =
                new ResponseFromGisogdRfEvent(publishToGisogdRfEvent,
                                              status,
                                              errors);

        messageBusProducer.produce(responseFromGisogdRfEvent);

        return ResponseEntity.ok("Event published: " + responseFromGisogdRfEvent);
    }
}
