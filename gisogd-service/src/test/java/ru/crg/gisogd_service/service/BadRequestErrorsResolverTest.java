package ru.crg.gisogd_service.service;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import ru.crg.gisogd_service.annotation.ReverseMapping;
import ru.crg.gisogd_service.model.rf.RfGuid;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;
import ru.mycrg.gisog_service_contract.dto.Document;

/**
 * Errors resolver tests.
 * @author Vladimir Nomokonov
 */

@SpringBootTest(properties = {"camel.springboot.auto-startup=false"})
class BadRequestErrorsResolverTest {

    @Autowired
    private BadRequestErrorsResolver errorsResolver;

    @Autowired
    private DocumentTypeResolver resolver;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @SneakyThrows
    void requiedErrorsResolve() {
        File file = new ClassPathResource("gisogd_error/inboxDataRequiedError.xml").getFile();
        String message = FileUtils.readFileToString(file, StandardCharsets.UTF_8);
        Map<String, String> collect = errorsResolver.badRequestErrorsResolve(message, new Document());
        assertNotNull(collect.get("Date"));
    }

    @Test
    @SneakyThrows
    void notParseErrorsResolve() {
        File file = new ClassPathResource("gisogd_error/inboxDataDublicateError.xml").getFile();
        String message = FileUtils.readFileToString(file, StandardCharsets.UTF_8);
        Map<String, String> collect = errorsResolver.badRequestErrorsResolve(message, new Document());
        assertNotNull(collect.get("parent0"));
    }

    @Test
    @SneakyThrows
    void reverseMappingFiledsTets() {
        Map<String, List<String>> classesWithErrors = new HashMap<>();

        resolver.getMapRfObjects().values()
                .stream()
                .forEach(pair ->
                         {
                             Class<? extends RfGuid> aClass = pair.getLeft();
                             Set<String> skipCheckFields = Arrays.stream(pair.getRight().getDeclaredFields())
                                                                 .filter(field -> field.isAnnotationPresent(ReverseMapping.class)
                                                                                  && field.getAnnotation(ReverseMapping.class).skipcheck())
                                                                 .map(field -> field.getName().toLowerCase())
                                                                 .collect(Collectors.toSet());
                             Document docByClass = getDocByClass(aClass);
                             Map<String, String> errorsMaps = errorsResolver.badRequestErrorsResolve(
                                     getMockAllFieldsMap(aClass, skipCheckFields),
                                     docByClass);
                             Set<String> eventKeys = docByClass.getContent().keySet();
                             List<String> errorMapsFields = errorsMaps.keySet().stream()
                                                                      .filter(Predicate.not(eventKeys::contains))
                                                                      .collect(Collectors.toList());
                             if (!errorMapsFields.isEmpty()) {
                                 classesWithErrors.put(aClass.getSimpleName(), errorMapsFields);
                             }
                         }
                );
        assertTrue(classesWithErrors.isEmpty(), String.format("Objects (%d) with reverse mapping errors: %s",
                                                              classesWithErrors.size(),
                                                              objectMapper.writerWithDefaultPrettyPrinter()
                                                                          .writeValueAsString(classesWithErrors)));
    }

    @SneakyThrows
    private Document getDocByClass(Class<? extends RfGuid> aClass) {
        String fileEvent = "event/" + aClass.getSimpleName() + "Event.json";
        Resource resource = new ClassPathResource(fileEvent);
        return objectMapper.readValue(resource.getFile(), PublishToGisogdRfEvent.class).getParent();
    }

    private String getMockAllFieldsMap(Class<? extends RfGuid> aClass, Set<String> skipCheckFields) {

        String allFieldsErrorsMock = Arrays.stream(aClass.getDeclaredFields())
                                           .filter(f -> !f.getName().startsWith("JSON_PROP") && !skipCheckFields.contains(f.getName().toLowerCase()))
                                           .map(f -> String.format("<%1$s>Test error for field '%1$s' </%1$s>", StringUtils.capitalize(f.getName())))
                                           .collect(Collectors.joining());
        return "<problem><status>400</status><MVC-Errors>" + allFieldsErrorsMock + "</MVC-Errors></problem>";
    }
}
