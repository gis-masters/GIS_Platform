package ru.mycrg.data_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;

@SpringBootApplication
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class DataServiceApplication extends RepositoryRestConfigurerAdapter {

    public static void main(String[] args) {
        SpringApplication.run(DataServiceApplication.class, args);
    }

}
