package ru.mycrg.acceptance;

import io.restassured.RestAssured;
import io.restassured.http.Cookie;
import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import org.junit.Ignore;
import org.junit.Test;
import ru.mycrg.acceptance.data_service.dto.BaseMapCreateDto;
import ru.mycrg.auth_service_contract.dto.GroupCreateDto;
import ru.mycrg.auth_service_contract.dto.OrganizationCreateDto;
import ru.mycrg.auth_service_contract.dto.UserCreateDto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static io.restassured.RestAssured.given;
import static org.apache.commons.lang3.RandomStringUtils.random;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.CoreMatchers.hasItems;
import static org.junit.Assert.*;

public class BaseStepsDefinitions {

    public static String testServerHost;
    public static int testServerPort;
    public static String rootUserName;
    public static String rootPassword;

    public static RequestSpecification request;
    public static Response response;
    public static Cookie cookie;
    public static JsonPath jsonPath;

    public static int totalPages;
    public static int entityCount;

    public static Map<Integer, OrganizationCreateDto> orgPool = new HashMap<>();
    public static Map<Integer, UserCreateDto> userPool = new HashMap<>();
    public static Map<Integer, GroupCreateDto> usersGroupPool = new HashMap<>();
    public static Map<Integer, BaseMapCreateDto> baseMapsPool = new HashMap<>();

    public void setup() {
        testServerHost = System.getProperty("env.HOST");
        rootUserName = System.getProperty("env.ROOT_NAME");
        rootPassword = System.getProperty("env.ROOT_PASS");

        assert testServerHost != null && rootPassword != null && rootUserName != null
                : "You should specify test server HOST as '-Denv.HOST', PORT as '-Denv.PORT', ROOT_NAME as '-Denv" +
                ".ROOT_NAME', ROOT_PASS as '-Denv.ROOT_PASS'";
        testServerPort = Integer.parseInt(System.getProperty("env.PORT"));

        request = getBaseRequest();
    }

    public RequestSpecification getBaseRequest() {
        return RestAssured
                .given().
                        log().ifValidationFails().
                        baseUri(testServerHost).
                        port(testServerPort).
                        basePath("");
    }

    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return RestAssured
                .given().
                        log().ifValidationFails().
                        baseUri(testServerHost).
                        port(testServerPort).
                        basePath("").
                        cookie(cookie);
    }

    public Integer extractIdFromLocation() {
        String header = response.getHeader("Location");
        Pattern pattern = Pattern.compile("\\d+$");
        Matcher matcher = pattern.matcher(header);

        Integer id = null;

        while (matcher.find()) {
            id = Integer.parseInt(matcher.group());
        }

        assertNotNull(id);
        return id;
    }

    public Integer extractIdFromLocation(Response response) {
        String header = response.getHeader("Location");
        Pattern pattern = Pattern.compile("\\d+$");
        Matcher matcher = pattern.matcher(header);

        Integer id = null;
        while (matcher.find()) {
            id = Integer.parseInt(matcher.group());
        }

        assertNotNull(id);

        return id;
    }

    public String replaceString(String input) {
        String[] params = input.split("_");
        String type = params[0];
        int length;

        try {
            if (params.length == 1) {
                return input;
            } else {
                length = Integer.parseInt(params[1]);
            }
        } catch (NumberFormatException e) {
            length = 0;
        }

        switch (type) {
            case "STRING":
                return random(length, true, true).toLowerCase();
            case "NUMBER":
                return random(length, false, true);
            case "EMAIL":
                return String.format("%s@t", random((length - 2), true, true).toLowerCase());
            default:
                return input;
        }
    }

    public void checkPagesCount(String entitiesPerPage) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/?size=" + entitiesPerPage);
        jsonPath = response.jsonPath();

        double entitiesPerPageDouble = Integer.parseInt(entitiesPerPage);
        int estimatedPages = (int) Math.ceil(entityCount / entitiesPerPageDouble);
        totalPages = jsonPath.get("page.totalPages");

        assertEquals(totalPages, estimatedPages);
    }

    public void isSomethingOnPages(String checkType, String entitiesPerPage) {
        for (int i = 0; i < totalPages; i++) {
            response = getBaseRequestWithCurrentCookie()
                    .when().
                            get(String.format("/?size=%s&page=%s", entitiesPerPage, i));

            jsonPath = response.jsonPath();
            List<String> entitiesIds = response.jsonPath().getList(String.format("_embedded.%s.id", checkType));

            assertNotEquals(0, entitiesIds.size());
        }
    }

    @Test
    public void shouldReplaceStringCorrectly() {
        String test_10 = replaceString("STRING_10");
        assertEquals(10, test_10.length());

        String number_10 = replaceString("NUMBER_10");
        assertEquals(10, number_10.length());

        String test_0 = replaceString("STRING_0");
        assertTrue(test_0.isEmpty());

        String email_3 = replaceString("EMAIL_3");
        assertEquals(3, email_3.length());

        String email_20 = replaceString("EMAIL_20");
        assertEquals(20, email_20.length());

        String testCustom = replaceString("MyCustomString_DontTouchME!");
        assertEquals("MyCustomString_DontTouchME!", testCustom);
    }

    @Test
    @Ignore
    public void templateForManualTesting() {
        final String accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VyX25hbWUiOiJh" +
                "ZG1pbkBtYWlsLnJ1Iiwic2NvcGUiOlsiY3JnIl0sIm9yZ2FuaXphdGlvbnMiOltdLCJncm91cHMiOltdLCJleHAiOjE2" +
                "MDE0NjU0NzksImF1dGhvcml0aWVzIjpbIkdMT0JBTF9BRE1JTiJdLCJqdGkiOiJmMmZlZWM0ZC0wODBlLTRmNWYtOTJk" +
                "OS0xYWJiZWE1OWJjMDEiLCJjbGllbnRfaWQiOiJhZG1pbiJ9.TXw7kkct4KFcnmhx7EfBiCGgwqwfi3ghF3mRK9yJ8j8";

        String userName = "test_2_3@fiz";

        given().
                       log().ifValidationFails().
                       baseUri("http://localhost").
                       port(8080).
                       basePath("/").
                       headers("Authorization", "Bearer " + accessToken)
               .when().
                       get("/geoserver/rest/security/usergroup/service/postgres_db_user_service/users.json")
               .then().
                       log().ifValidationFails().
                       statusCode(SC_OK).
                       body("users.findAll { it.enabled == true }.userName", hasItems(userName));
    }
}
