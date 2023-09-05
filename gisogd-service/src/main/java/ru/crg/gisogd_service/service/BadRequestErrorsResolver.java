package ru.crg.gisogd_service.service;

import static java.util.stream.Collectors.toMap;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Bad Request errors fields resolver.
 * @author Vladimir Nomokonov
 */
@Slf4j
@Component
@AllArgsConstructor
public class BadRequestErrorsResolver {

    public static final String PARENT_KEY = "parent";

    public Map<String, String> badRequestErrorsResolve(String message) {

        if (message == null) {
            return Collections.emptyMap();
        }
        XmlMapper xmlMapper = new XmlMapper();
        try {
            if (message.contains("MVC-Errors")) {

                Map<String, Object> data = xmlMapper.readValue(message, Map.class);
                return (Map<String, String>) data.get("MVC-Errors");
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
}
