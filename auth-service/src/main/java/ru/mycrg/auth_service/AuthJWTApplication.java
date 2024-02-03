package ru.mycrg.auth_service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import ru.mycrg.auth_service.queue.MessageBusProducer;
import ru.mycrg.auth_service_contract.events.request.SystemTagsRequestEvent;

@SpringBootApplication
public class AuthJWTApplication {

    public static final ObjectMapper mapper = new ObjectMapper();

    private final MessageBusProducer messageBusProducer;

    public AuthJWTApplication(MessageBusProducer messageBusProducer) {
        this.messageBusProducer = messageBusProducer;
    }

    public static void main(String[] args) {
        SpringApplication.run(AuthJWTApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void appReadyEvent() {
        messageBusProducer.produce(new SystemTagsRequestEvent());
    }
}
