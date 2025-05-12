package ru.mycrg.data_service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import ru.mycrg.data_service.config.props.NotificationProperties;
import ru.mycrg.data_service.dao.migrations.CrgMigrationHandler;
import ru.mycrg.data_service.dao.migrations.GeoserverMigrationHandler;
import ru.mycrg.data_service.service.SystemTagsPublisher;

@EnableScheduling
@SpringBootApplication
@EnableTransactionManagement
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class DataServiceApplication extends RepositoryRestConfigurerAdapter {

    private static final Logger log = LoggerFactory.getLogger(DataServiceApplication.class);

    @Value("${spring.servlet.multipart.max-file-size}")
    private String maxFileSize;

    private final SystemTagsPublisher systemTagsPublisher;
    private final CrgMigrationHandler migrationHandler;
    private final NotificationProperties notificationProperties;
    private final GeoserverMigrationHandler geoserverMigrationHandler;

    public DataServiceApplication(SystemTagsPublisher systemTagsPublisher,
                                  CrgMigrationHandler migrationHandler,
                                  NotificationProperties notificationProperties,
                                  GeoserverMigrationHandler geoserverMigrationHandler) {
        this.systemTagsPublisher = systemTagsPublisher;
        this.migrationHandler = migrationHandler;
        this.notificationProperties = notificationProperties;
        this.geoserverMigrationHandler = geoserverMigrationHandler;
    }

    public static void main(String[] args) {
        Runtime runtime = Runtime.getRuntime();
        long maxMemory = runtime.maxMemory();
        long totalMemory = runtime.totalMemory();

        log.info("=== HEAP MEMORY INFO ===");
        log.info("HEAP: Max Memory (Xmx): {} MB", maxMemory / (1024*1024));
        log.info("HEAP: Initial Memory (Xms): {} MB", totalMemory / (1024*1024));
        log.info("========= END HEAP =========");

        SpringApplication.run(DataServiceApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void appReadyEvent() {
        log.info("App ready with:");
        log.info("max-file-size: {}", maxFileSize);
        log.info("{}", notificationProperties);

        migrationHandler.handle();
        geoserverMigrationHandler.handle();
        systemTagsPublisher.publish();
    }
}
