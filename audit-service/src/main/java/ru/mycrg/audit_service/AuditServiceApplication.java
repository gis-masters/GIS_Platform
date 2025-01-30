package ru.mycrg.audit_service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AuditServiceApplication {

    private static final Logger log = LoggerFactory.getLogger(AuditServiceApplication.class);

    public static void main(String[] args) {
        Runtime runtime = Runtime.getRuntime();
        long maxMemory = runtime.maxMemory();
        long totalMemory = runtime.totalMemory();

        log.info("=== HEAP MEMORY INFO ===");
        log.info("Max Memory (Xmx): {} MB", maxMemory / (1024*1024));
        log.info("Initial Memory (Xms): {} MB", totalMemory / (1024*1024));
        log.info("=======================");
        SpringApplication.run(AuditServiceApplication.class, args);
    }
}
