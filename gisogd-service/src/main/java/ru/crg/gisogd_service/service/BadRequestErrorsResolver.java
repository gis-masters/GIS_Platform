package ru.crg.gisogd_service.service;

import static java.util.stream.Collectors.toMap;

import java.lang.annotation.Annotation;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ru.crg.gisogd_service.annotation.ReverseMapping;
import ru.crg.gisogd_service.model.rf.RfGuid;
import ru.mycrg.gisog_service_contract.dto.Document;

/**
 * Bad Request errors fields resolver.
 * @author Vladimir Nomokonov
 */
@Slf4j
@Component
@AllArgsConstructor
public class BadRequestErrorsResolver {

    public static final String PARENT_KEY = "parent";

    private final DocumentTypeResolver documentTypeResolver;

    public Map<String, String> badRequestErrorsResolve(String message, Document document) {

        if (message == null) {
            return Collections.emptyMap();
        }
        XmlMapper xmlMapper = new XmlMapper();
        try {
            if (message.contains("MVC-Errors")) {

                Map<String, Object> data = xmlMapper.readValue(message, Map.class);
                return keyConvert((Map<String, String>) data.get("MVC-Errors"), document);
            }

            if (message.contains("ArrayOfString")) {
                List<String> data = xmlMapper.readValue(message, List.class);
                return IntStream.range(0, data.size())
                                .boxed()
                                .collect(toMap(i -> PARENT_KEY + i, data::get));
            }
        } catch (Exception e) {
            return Map.of(PARENT_KEY, message);
        }
        return Map.of(PARENT_KEY, message);
    }

    private Map<String, String> keyConvert(Map<String, String> errorsMap, Document document) {
        Class<RfGuid> mixin;
        try {
            mixin = documentTypeResolver.getRfObjectTypeMixin(document);
        } catch (Exception e) {
            return errorsMap;
        }
        if (mixin == null) {
            return errorsMap;
        }
        Map<String, String> filedMap = Arrays.stream(mixin.getDeclaredFields())
                                             .collect(toMap(
                                                     field -> field.getName().toLowerCase(),
                                                     field -> getJsonPropertyValue(field.getDeclaredAnnotations(), field.getName())));

        return errorsMap.entrySet()
                        .stream()
                        .collect(Collectors.toMap(
                                e -> Optional.ofNullable(filedMap.get(e.getKey().toLowerCase()))
                                             .orElse(e.getKey()),
                                Map.Entry::getValue));
    }

    private String getJsonPropertyValue(Annotation[] declaredAnnotations, String defaultValue) {
        if (declaredAnnotations == null || declaredAnnotations.length == 0) {
            return defaultValue;
        }
        String revereMappingValue = Arrays.stream(declaredAnnotations).filter(ReverseMapping.class::isInstance)
                                          .map(a -> ((ReverseMapping) a).value())
                                          .findFirst()
                                          .orElse(null);

        return revereMappingValue != null ? revereMappingValue :
               Arrays.stream(declaredAnnotations).filter(JsonProperty.class::isInstance)
                     .map(a -> ((JsonProperty) a).value())
                     .findFirst()
                     .orElse(defaultValue);
    }
}
