package ru.crg.gisogd_service.service;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;

import lombok.SneakyThrows;

/**
 * Errors resolver tests.
 * @author Vladimir Nomokonov
 */

@SpringBootTest(properties = {"camel.springboot.auto-startup=false"})
class BadRequestErrorsResolverTest {

    @Autowired
    private BadRequestErrorsResolver errorsResolver;

    @Test
    @SneakyThrows
    void requiedErrorsResolve() {
        File file = new ClassPathResource("gisogd_error/inboxDataRequiedError.xml").getFile();
        String message = FileUtils.readFileToString(file, StandardCharsets.UTF_8);
        Map<String, String> collect = errorsResolver.badRequestErrorsResolve(message);
        assertNotNull( collect.get("Date"));
    }

    @Test
    @SneakyThrows
    void notParseErrorsResolve() {
        File file = new ClassPathResource("gisogd_error/inboxDataDublicateError.xml").getFile();
        String message = FileUtils.readFileToString(file, StandardCharsets.UTF_8);
        Map<String, String> collect = errorsResolver.badRequestErrorsResolve(message);
        assertNotNull( collect.get("parent0"));
    }

}