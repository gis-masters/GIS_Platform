package ru.mycrg.wrapper.service.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import tools.jackson.databind.ObjectMapper;

import java.util.Map;

import static ru.mycrg.http_client.JsonConverter.toJsonNode;

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
}
