package ru.mycrg.acceptance;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.Before;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.cucumber.messages.internal.com.google.gson.Gson;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.http.Cookie;
import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.auth_service_contract.dto.OrganizationCreateDto;
import ru.mycrg.auth_service_contract.dto.UserCreateDto;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class OrganizationStepsDefinitions {

    private static String testServerHost;
    private static int testServerPort;
    private static String rootUserName;
    private static String rootPassword;

    private static RequestSpecification request;
    private static Response response;

    private static String orgId;
    private static Cookie cookie;
    private static Duration authRequestDurationRestriction = Duration.ofSeconds(120);
    private static Map<String, OrganizationCreateDto> orgs = new HashMap<>();

    @Before
    public static void setup() {
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

    @Given("Существует организация")
    public void checkOrg(DataTable dataTable) throws InterruptedException {
        if (!orgs.containsKey(dataTable.asList().get(4))) {
            createOrganization(dataTable);
        }
    }

    @When("Создается организация")
    public void createOrganization(DataTable dataTable) {
        setup();
        List<String> data = dataTable.asList();
        UserCreateDto owner = new UserCreateDto(replaceString(data.get(2)), replaceString(data.get(3)),
                replaceString(data.get(4)), replaceString(data.get(5)));
        OrganizationCreateDto org = new OrganizationCreateDto(replaceString(data.get(0)), replaceString(data.get(1)),
                owner);

        orgs.put(org.getOwner().getEmail(), org);

        String payload = new Gson().toJson(org);

        response = request
                .body(payload)
                .contentType(ContentType.JSON)
                .when()
                .post("/organizations/init");
    }

    @Then("Сервер отвечает со статус-кодом {int}")
    public void assertResponseCode(int status) {
        assertEquals(status, response.getStatusCode());
    }

    @And("в заголовке Location передает ID созданной организации")
    public void extractLocation() {
        String header = response.getHeader("Location");
        Pattern pattern = Pattern.compile("\\d+$");
        Matcher matcher = pattern.matcher(header);

        while (matcher.find()) {
            orgId = matcher.group();
        }

        assertNotNull(orgId);
    }

    @When("Пользователь пытается авторизоваться")
    public void tryToGetAuthorized(DataTable dataTable) throws InterruptedException {
        setup();
        List<String> data = dataTable.asList();

        Map<String, String> queryParams = new HashMap<>();

        queryParams.put("username", data.get(0));
        queryParams.put("password", data.get(1));
        queryParams.put("grant_type", "password");

        do {
            int waitDelayInMillis = 5000;
            response = request
                    .formParams(queryParams)
                    .when()
                    .post("/oauth/token");

            Thread.sleep(waitDelayInMillis);
            authRequestDurationRestriction = authRequestDurationRestriction.minusMillis(waitDelayInMillis);

        } while (response.getStatusCode() == 401 && authRequestDurationRestriction.getSeconds() > 0);
    }

    @Then("Сервер авторизует пользователя")
    public void serverAuthorizeUser() {
        cookie = response.getDetailedCookie("crgAuthCookie");
        assertNotNull(cookie);
    }

    @When("Пользователь проверяет создана ли организация")
    public void getOrgInfo() {
        response = request.basePath("/organizations/")
                .cookie(cookie)
                .get(orgId);
    }

    @And("Сервер отвечает с полем status = PROVISIONED и поля совпадают с переданными")
    public void checkIsOrgProvisioned(DataTable dataTable) {
        List<String> data = dataTable.asList();

        JsonPath jsonPath = response.jsonPath();

        assertEquals(jsonPath.get("status"), ("PROVISIONED"));
        assertEquals(jsonPath.get("name"), data.get(0));
        assertEquals(jsonPath.get("phone"), data.get(1));
        assertEquals(jsonPath.getList("_embedded.users.name").get(0), data.get(2));
        assertEquals(jsonPath.getList("_embedded.users.surName").get(0), data.get(3));
        assertEquals(jsonPath.getList("_embedded.users.email").get(0), data.get(4));
    }

    private String replaceString(String input) {
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
                        "@email.com";
            default:
                return input;
        }
    }
}
