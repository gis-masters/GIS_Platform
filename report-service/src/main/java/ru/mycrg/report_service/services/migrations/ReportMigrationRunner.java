package ru.mycrg.report_service.services.migrations;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import ru.mycrg.report_service.services.migrations.dao.ReportMigrationHandler;

@Component
public class ReportMigrationRunner implements ApplicationRunner {

    private final ReportMigrationHandler migrationHandler;

    public ReportMigrationRunner(ReportMigrationHandler migrationHandler) {
        this.migrationHandler = migrationHandler;
    }

    @Override
    public void run(ApplicationArguments args) {
        migrationHandler.handle();
    }
}
