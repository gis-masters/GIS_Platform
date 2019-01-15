package ru.mycrg.gis;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import ru.mycrg.gis.config.GisStorageProperties;

@SpringBootApplication
@EnableTransactionManagement
@EnableConfigurationProperties({
        GisStorageProperties.class
})
public class GisApplication {
    public static void main(String[] args) {
        SpringApplication.run(GisApplication.class, args);
    }
}
