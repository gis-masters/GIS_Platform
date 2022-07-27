package ru.mycrg.auth_service;

import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static ru.mycrg.auth_service.util.AccessTokenHandler.asMap;

class AccessTokenHandlerTest {

    @Test
    void shouldCorrectExtractUserSbjId_newFormat() throws IOException {
        String content = "{\"acr\":{\"tls\":\"gost\"},\"nbf\":1658822551,\"scope\":\"email?oid=1136726886 openid " +
                "fullname?oid=1136726886\",\"iss\":\"http:\\/\\/esia.gosuslugi.ru\\/\",\"urn:esia:sid\":" +
                "\"12072fa7-9f5a-4fba-9d6c-5fe1aaa3ce0b\",\"urn:esia:sbj_id\":1136726886,\"exp\":1658826151," +
                "\"iat\":1658822551,\"client_id\":\"GISOGD_CRIMEA\"}";

        Map<String, String> result = asMap(content);

        assertTrue(result.containsKey("urn:esia:sbj_id"));
    }

    @Test
    void shouldCorrectExtractUserSbjId_oldFormat() throws IOException {
        String content = "{\"nbf\":1657915650,\"scope\":\"email?oid=1156204397 openid fullname?oid=" +
                "1156204397\",\"iss\":\"http:\\/\\/esia.gosuslugi.ru\\/\",\"urn:esia:sid\":" +
                "\"f90c1aa4-0f17-4bd1-96bf-92762cb9568c\",\"urn:esia:sbj_id\":1156204397," +
                "\"exp\":1657919250,\"iat\":1657915650,\"client_id\":\"GISOGD_CRIMEA\"}";

        Map<String, String> result = asMap(content);

        assertTrue(result.containsKey("urn:esia:sbj_id"));
    }
}
