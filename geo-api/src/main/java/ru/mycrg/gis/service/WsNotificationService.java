package ru.mycrg.gis.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.gis.dto.WsMessageDto;

@Service
public class WsNotificationService {

    private static Logger log = LoggerFactory.getLogger(WsNotificationService.class);

    private final SimpMessagingTemplate simpMessagingTemplate;


    public WsNotificationService(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    public void send(WsMessageDto payload, String userId) {
        simpMessagingTemplate.convertAndSend("/topic/" + userId + "/events", payload);
    }

}
