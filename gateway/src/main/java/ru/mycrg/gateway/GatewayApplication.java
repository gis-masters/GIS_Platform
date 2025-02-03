package ru.mycrg.gateway;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.context.event.EventListener;

@EnableZuulProxy
@SpringBootApplication
public class GatewayApplication {

    private static final Logger log = LoggerFactory.getLogger(GatewayApplication.class);

    @Value("${spring.servlet.multipart.max-file-size}")
    private String maxFileSize;

    @Value("${zuul.host.connect-timeout-millis}")
    private String ctm;

    public static final ObjectMapper objectMapper = new ObjectMapper();

    public static void main(String[] args) {

        Runtime runtime = Runtime.getRuntime();
        long maxMemory = runtime.maxMemory();
        long totalMemory = runtime.totalMemory();

        log.info("=== HEAP MEMORY INFO ===");
        log.info("HEAP: Max Memory (Xmx): {} MB", maxMemory / (1024*1024));
        log.info("HEAP: Initial Memory (Xms): {} MB", totalMemory / (1024*1024));
        log.info("========= END HEAP =========");
        SpringApplication.run(GatewayApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void appReadyEvent() {
        log.info("App ready with:");
        log.info("max-file-size: {}", maxFileSize);
        log.info("connect-timeout-millis: {}", ctm);
    }
}
