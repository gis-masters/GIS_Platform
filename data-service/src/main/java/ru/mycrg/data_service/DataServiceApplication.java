package ru.mycrg.data_service;

import com.google.gson.Gson;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import ru.mycrg.data_service.dao.migrations.CrgMigrationHandler;
import ru.mycrg.data_service.dao.migrations.GeoserverMigrationHandler;

@SpringBootApplication
@EnableTransactionManagement
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class DataServiceApplication extends RepositoryRestConfigurerAdapter {

    private final CrgMigrationHandler migrationHandler;
    private final GeoserverMigrationHandler geoserverMigrationHandler;

    public static Gson gson = new Gson();

    public DataServiceApplication(CrgMigrationHandler migrationHandler,
                                  GeoserverMigrationHandler geoserverMigrationHandler) {
        this.migrationHandler = migrationHandler;
        this.geoserverMigrationHandler = geoserverMigrationHandler;
    }

    public static void main(String[] args) {
        SpringApplication.run(DataServiceApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void appReadyEvent() {
        migrationHandler.handle();
        geoserverMigrationHandler.handle();
    }
}
