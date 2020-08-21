package ru.mycrg.gateway;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import ru.mycrg.gateway.config.CrgProperties;

@EnableZuulProxy
@SpringBootApplication
public class GatewayApplication {

    @Autowired
    private CrgProperties properties;

    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }

}
