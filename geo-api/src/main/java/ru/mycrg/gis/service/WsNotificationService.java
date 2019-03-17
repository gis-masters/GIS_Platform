package ru.mycrg.gis.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.common.GmlMqResponse;
import ru.mycrg.common.enums.ProcessStatus;

import java.util.UUID;

@Service
public class WsNotificationService {

    private static Logger log = LoggerFactory.getLogger(WsNotificationService.class);

    private final SimpMessagingTemplate simpMessagingTemplate;


    public WsNotificationService(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    public void send(String msg) {
        GmlMqResponse payload = new GmlMqResponse();
        payload.setId(UUID.randomUUID());
        payload.setPathToFile("test 1");
        payload.setPathToLog("test 1");
        payload.setStatus(ProcessStatus.DONE);

        simpMessagingTemplate.convertAndSend("/topic/export", payload);
    }

}
