package ru.mycrg.acceptance;

import io.restassured.RestAssured;
import io.restassured.http.Cookie;
import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.auth_service_contract.dto.OrganizationCreateDto;
import ru.mycrg.auth_service_contract.dto.UserCreateDto;

import java.util.HashMap;
import java.util.Map;

public class BaseStepsDefinitions {

    public static String testServerHost;
    public static int testServerPort;
    public static String rootUserName;
    public static String rootPassword;

    public static RequestSpecification request;
    public static Response response;
    public static Cookie adminCookie;
    public static Cookie userCookie;
    public static JsonPath jsonPath;

    public static Map<String, OrganizationCreateDto> orgs = new HashMap<>();
    public static Map<String, UserCreateDto> users = new HashMap<>();

    public void setup() {
        testServerHost = System.getProperty("env.HOST");
        rootUserName = System.getProperty("env.ROOT_NAME");
        rootPassword = System.getProperty("env.ROOT_PASS");

        assert testServerHost != null && rootPassword != null && rootUserName != null
                : "You should specify test server HOST as '-Denv.HOST', PORT as '-Denv.PORT', ROOT_NAME as '-Denv" +
                ".ROOT_NAME', ROOT_PASS as '-Denv.ROOT_PASS'";
        testServerPort = Integer.parseInt(System.getProperty("env.PORT"));

        request = RestAssured.given();
        request.baseUri(testServerHost);
        request.port(testServerPort);
        request.basePath("/");
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
}
