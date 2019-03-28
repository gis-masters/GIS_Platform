package ru.mycrg.wrapper;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
public class GeoServerWrapperApplication {

    public static void main(String[] args) {
        SpringApplication.run(GeoServerWrapperApplication.class, args);
    }
}
