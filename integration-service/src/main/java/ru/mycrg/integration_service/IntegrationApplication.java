package ru.mycrg.integration_service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.camunda.bpm.spring.boot.starter.annotation.EnableProcessApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import java.text.SimpleDateFormat;

@SpringBootApplication
@EnableProcessApplication
@EnableTransactionManagement
public class IntegrationApplication {

    public static final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .setDateFormat(new SimpleDateFormat("dd-MM-yyyy HH:mm"));

    public static void main(String[] args) {
        SpringApplication.run(IntegrationApplication.class, args);
    }
}
