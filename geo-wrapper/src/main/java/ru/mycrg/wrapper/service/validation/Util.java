package ru.mycrg.wrapper.service.validation;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vladmihalcea.hibernate.type.json.internal.JacksonUtil;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.common.PropertyViolation;

import java.util.List;
import java.util.Map;

public class Util {

    private static Logger log = LoggerFactory.getLogger(Util.class);

    public static String getPropertyByKey(Map<String, Object> data, String keyFiled) {
        if (data.containsKey(keyFiled)) {
            Object o = data.get(keyFiled);
            if (o != null) {
                return o.toString();
            } else {
                log.info("Failed get key: {}", keyFiled);
            }
        } else {
            log.warn("Row not contains key? : {}", keyFiled);
        }

        return "";
    }

    @NotNull
    public static String getViolations(Map<String, Object> stringObjectMap, String violations_key) {
        Object o = stringObjectMap.get(violations_key);

        return o != null
                ? o.toString()
                : "";
    }

    public static JsonNode convertToJson(List<PropertyViolation> propertyViolations) {
        try {
            String asString = new ObjectMapper().writer()
                    .withDefaultPrettyPrinter()
                    .writeValueAsString(propertyViolations);
            return JacksonUtil.toJsonNode(asString);
        } catch (JsonProcessingException e) {
            log.error("Failed convert to json: {}", e.getMessage());

            return JacksonUtil.toJsonNode("");
        }
    }
}
