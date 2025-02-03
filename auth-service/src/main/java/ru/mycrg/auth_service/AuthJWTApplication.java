package ru.mycrg.auth_service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import ru.mycrg.auth_service.queue.MessageBusProducer;
import ru.mycrg.auth_service_contract.events.request.SystemTagsRequestEvent;

@SpringBootApplication
public class AuthJWTApplication {

    private static final Logger log = LoggerFactory.getLogger(AuthJWTApplication.class);

    public static final ObjectMapper mapper = new ObjectMapper();

    private final MessageBusProducer messageBusProducer;

    public AuthJWTApplication(MessageBusProducer messageBusProducer) {
        this.messageBusProducer = messageBusProducer;
    }

    public static void main(String[] args) {
        Runtime runtime = Runtime.getRuntime();
        long maxMemory = runtime.maxMemory();
        long totalMemory = runtime.totalMemory();

        log.info("=== HEAP MEMORY INFO ===");
        log.info("HEAP: Max Memory (Xmx): {} MB", maxMemory / (1024*1024));
        log.info("HEAP: Initial Memory (Xms): {} MB", totalMemory / (1024*1024));
        log.info("========= END HEAP =========");
        SpringApplication.run(AuthJWTApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void appReadyEvent() {
        messageBusProducer.produce(new SystemTagsRequestEvent());
    }
}
