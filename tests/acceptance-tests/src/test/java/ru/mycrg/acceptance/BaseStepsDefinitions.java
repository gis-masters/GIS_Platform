package ru.mycrg.acceptance;

import io.restassured.RestAssured;
import io.restassured.http.Cookie;
import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import org.junit.Ignore;
import org.junit.Test;
import ru.mycrg.auth_service_contract.dto.OrganizationCreateDto;
import ru.mycrg.auth_service_contract.dto.UserCreateDto;

import java.util.HashMap;
import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.hasItems;

public class BaseStepsDefinitions {

    public static String testServerHost;
    public static int testServerPort;
    public static String rootUserName;
    public static String rootPassword;

    public static RequestSpecification request;
    public static Response response;
    public static Cookie cookie;
    public static JsonPath jsonPath;

    public static Map<String, OrganizationCreateDto> orgPool = new HashMap<>();
    public static Map<String, UserCreateDto> users = new HashMap<>();

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

    public static String replaceString(String input) {
        if (input == null) return "";

        switch (input) {
            case "LONG_STRING_60":
                return "3QH98MuCSR" +
                        "N6087ZKrHF" +
                        "WsNXDQXCgK" +
                        "E0xAq4Vtwg" +
                        "ySpRc0Kl0O" +
                        "9FFqy6VoZa" +
                        "a";
            case "LONG_STRING_100":
                return "srzMpSkdGvlAyjWACxeWwx7NiMGscfHyCKlLWabKJCMMJgP9DW" +
                        "Vxo8sAxIjJGUdwgLElaqyI1x44AIfNNrxnF6GdoSybRkQdSugs" +
                        "a";
            case "LONG_STRING_500":
                return "7FhLY9W1MmOjpT7wuY5PBbH8x0bNs0VpFL8jenIyyXYTXVEDDH" +
                        "cNU0xduYPfjN46A89tK00ptSuJWcaioDT4DmOmuOY8gjFBB1vx" +
                        "mI8WfyPlvqLX1ncwbOQtDnOEsCK4AMJjRYC1JltiuZq4QuqD01" +
                        "q13iuGvlPb0DRLwk0WA28dLsqBWuXmIQ1q74ltpVUbSHnPFQpK" +
                        "QYTBCMfpcgVwcs9hVuiWXJPzWt6Cp0yK8nuriH7mlsCiHkSofq" +
                        "GKZU9KtCyVXkuCSW9P9Cwtq98o3MTANB6DPT98RSKSUBDFxjSU" +
                        "6KNNpDCYtPjhHKzkNVxYKFgnem1Kt17KPJe06PrcaLWNzwMr1k" +
                        "tCUeRF6jhDz5ijqlI8W0DVwAng4nKdhzSv8wK6OHfzZpPjQay2" +
                        "XE3GXvGQZV704JIST4EuAnOSi3yA1PelgjWhUEYcXHxlIiyBGw" +
                        "jecjGe7BlTZhKU7QOdCATCVkrWhavtKJDGW3OJBvdB9CXlJ44N" +
                        "a";
            case "LONG_NUMBER_20":
                return "1234567890" +
                        "1234567890" +
                        "1";
            case "LONG_ADMIN_EMAIL_60":
                return "3QH98MuCSR" +
                        "N6087ZKrHF" +
                        "WsNXDQXCgK" +
                        "E0xAq4Vtwg" +
                        "ySpRc0Kl0O" +
                        "9FFqy6VoZa" +
                        "@admin.com";
            case "LONG_USER_EMAIL_60":
                return "3QH98MfCSR" +
                        "N6087ZKrHF" +
                        "WsNXDQXCgK" +
                        "E0xAq4Vtwg" +
                        "ySpRc0Kl0O" +
                        "9FFqy6VoZa" +
                        "@user.com";
            default:
                return input;
        }
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
                       statusCode(200).
                       body("users.findAll { it.enabled == true }.userName", hasItems(userName));
    }
}
