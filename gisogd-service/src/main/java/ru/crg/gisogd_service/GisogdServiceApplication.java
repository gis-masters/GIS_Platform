package ru.crg.gisogd_service;

import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableRabbit
@EnableFeignClients
@SpringBootApplication
public class GisogdServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(GisogdServiceApplication.class, args);
    }
}
