package ru.mycrg.auth_service.util;

import com.fasterxml.jackson.core.type.TypeReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

import static ru.mycrg.auth_service.AuthJWTApplication.mapper;

public class AccessTokenHandler {

    public static final String URN_ESIA_SBJ_ID_KEY = "urn:esia:sbj_id";

    private static final Logger log = LoggerFactory.getLogger(AccessTokenHandler.class);

    private AccessTokenHandler() {
        throw new IllegalStateException("Utility class");
    }

    public static String extractUserSbjId(String esiaToken) throws IOException {
        String[] accessParts = esiaToken.split("\\.");

        String content = new String(Base64.getUrlDecoder().decode(accessParts[1]), StandardCharsets.UTF_8);

        Map<String, String> result = asMap(content);

        log.debug("Content successfully read: {}", result);

        return String.valueOf(result.get(URN_ESIA_SBJ_ID_KEY));
    }

    public static Map<String, String> asMap(String content) throws IOException {
        log.debug("Try read as map, accessToken content: {}", content);

        return mapper.readValue(content,
                                new TypeReference<Map<String, Object>>() {
                                });
    }
}
