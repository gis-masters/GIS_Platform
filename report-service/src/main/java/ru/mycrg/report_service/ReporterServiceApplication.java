package ru.mycrg.report_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.amqp.RabbitAutoConfiguration;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import ru.mycrg.report_service.services.dao.migrations.ReportMigrationHandler;

@SpringBootApplication(exclude = {
        RabbitAutoConfiguration.class
})
public class ReporterServiceApplication {

    private final ReportMigrationHandler migrationHandler;

    public ReporterServiceApplication(ReportMigrationHandler migrationHandler) {
        this.migrationHandler = migrationHandler;
    }

    public static void main(String[] args) {
        SpringApplication.run(ReporterServiceApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void appReadyEvent() {
        migrationHandler.handle();
    }
}
