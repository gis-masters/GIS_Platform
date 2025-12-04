package ru.mycrg.report_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.amqp.RabbitAutoConfiguration;
import org.springframework.boot.autoconfigure.flyway.FlywayAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {
        FlywayAutoConfiguration.class,
        DataSourceAutoConfiguration.class,
        RabbitAutoConfiguration.class
})
public class ReporterServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ReporterServiceApplication.class, args);
    }
}
