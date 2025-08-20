package ru.mycrg.data_service.service;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dto.WsMessageDto;

@Service
public class WsNotificationService {

    private final Logger log = LoggerFactory.getLogger(WsNotificationService.class);

    private final SimpMessagingTemplate simpMessagingTemplate;

    public WsNotificationService(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    public void send(@NotNull WsMessageDto<Object> payload, String wsUiId) {
        if (wsUiId == null || wsUiId.isBlank()) {
            throw new IllegalArgumentException("Invalid wsUiId: " + wsUiId);
        }

        simpMessagingTemplate.convertAndSend("/topic/" + wsUiId + "/events", payload);

        log.debug("WS. Msg type: {} Send to: /topic/{}/events", payload.getType(), wsUiId);
    }
}
