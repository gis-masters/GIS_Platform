package ru.mycrg.wrapper.service.validation;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vladmihalcea.hibernate.type.json.internal.JacksonUtil;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.data_service_contract.dto.ObjectValidationResult;

import java.util.Map;

public class Util {

    private static final Logger log = LoggerFactory.getLogger(Util.class);

    private static final ObjectMapper objectMapper = new ObjectMapper();

    private Util() {
        throw new IllegalStateException("Utility class");
    }

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
    public static JsonNode convertToJson(ObjectValidationResult object) {
        try {
            String asString = objectMapper.writer()
                                          .withDefaultPrettyPrinter()
                                          .writeValueAsString(object);
            return JacksonUtil.toJsonNode(asString);
        } catch (JsonProcessingException e) {
            log.error("Failed convert to json: {}", e.getMessage());

            return JacksonUtil.toJsonNode("{}");
        }
    }
}
