package ru.mycrg.data_service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import ru.mycrg.data_service.dao.CrgMigrationHandler;
import ru.mycrg.data_service.dao.GeoserverMigrationHandler;

@SpringBootApplication
@EnableTransactionManagement
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class DataServiceApplication extends RepositoryRestConfigurerAdapter {

    @Autowired
    private CrgMigrationHandler migrationHandler;

    @Autowired
    private GeoserverMigrationHandler geoserverMigrationHandler;

    public static void main(String[] args) {
        SpringApplication.run(DataServiceApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void appReadyEvent() {
        migrationHandler.handle();
        geoserverMigrationHandler.handle();
    }
}
