package ru.mycrg.auth_service;

import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static ru.mycrg.auth_service.util.AccessTokenHandler.asMap;
import static ru.mycrg.auth_service.util.AccessTokenHandler.extractUserSbjId;

public class AccessTokenHandlerTest {

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

    @Test
    void shouldCorrectExtractSbjId() throws IOException {
        String esiaAccessToken = "eyJ2ZXIiOjEsInR5cCI6IkpXVCIsInNidCI6ImFjY2VzcyIsImFsZyI6IlJTMjU2In0.eyJhY3IiOnsid" +
                "GxzIjoiZ29zdCJ9LCJuYmYiOjE2NjEyMzc0ODUsInNjb3BlIjoiZnVsbG5hbWU_b2lkPTEwMDAzMjE5MjIgb3BlbmlkIGVtYWl" +
                "sP29pZD0xMDAwMzIxOTIyIiwiaXNzIjoiaHR0cDpcL1wvZXNpYS1wb3J0YWwxLnRlc3QuZ29zdXNsdWdpLnJ1XC8iLCJ1cm46Z" +
                "XNpYTpzaWQiOiI5ZGJlYzYwOS1lZjJmLTQ2NTYtYWYzYi1jYmE4NTJlMjY0NTEiLCJ1cm46ZXNpYTpzYmpfaWQiOjEwMDAzMjE" +
                "5MjIsImV4cCI6MTY2MTI0MTA4NSwiaWF0IjoxNjYxMjM3NDg1LCJjbGllbnRfaWQiOiJHSVNPR0RfQ1JJTUVBIn0.RVmbTjMxd" +
                "oyVh543cZOPEk7nbHedHa_UI-DZk218qHqztsmMarlXsZywXfIbzXFEffj57BXumGP6GWb5BSNczirlcf6RVsLaR1GTtADbzIS" +
                "TXGk4SPbu1g56JgnG6RtMjv-tw7w8127GPTUxVfLnADQ9qZ11dpbOEbqTBePUjdmpDL0zJDRUbGMmSkT0UA3d8Hdke1mUUQ2Md" +
                "_oWa67aCN5LP19wEjgTxy4eEDXES0BIgPZizB6imREm0IA6y347wyFf12TOqdFpMLuA85fgWiu3AkFSbX5pr0FoQKymJwVE_esz" +
                "nSq9mH8eGEOthhsAeeKgheTe2950bICntgAhNA";

        String userSbjId = extractUserSbjId(esiaAccessToken);

        assertEquals("1000321922", userSbjId);
    }
}
