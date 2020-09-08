package ru.mycrg.acceptance;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.Before;
import io.cucumber.java.en.And;
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

import static org.junit.Assert.*;

public class OrganizationStepsDefinitions {

    private static String testServerHost;
    private static int testServerPort;
    private static String rootUserName;
    private static String rootPassword;

    private static RequestSpecification request;
    private static Response response;

    private static String orgId;
    private static Cookie cookie;
    private static Duration authRequestDurationRestriction = Duration.ofSeconds(60);

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

    @When("Пользователь вводит корректные данные")
    public void createValidOrganization(DataTable dataTable) {
        List<String> data = dataTable.asList();

        UserCreateDto owner = new UserCreateDto(data.get(2), data.get(3), data.get(4), data.get(5));
        OrganizationCreateDto org = new OrganizationCreateDto(data.get(0), data.get(1), owner);

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
        queryParams.put("grant_type", data.get(2));

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

    @And("Сервер отвечает с полем status = PROVISIONED")
    public void checkIsOrgProvisioned() {
        JsonPath jsonPath = response.jsonPath();
        String status = jsonPath.get("status");

        assertTrue(status.equalsIgnoreCase("PROVISIONED"));
    }

    @When("Пользователь вводит некорректные данные")
    public void createInvalidOrganization(DataTable dataTable) {
        List<String> data = dataTable.asList();
        UserCreateDto owner = new UserCreateDto(replaceString(data.get(2)), replaceString(data.get(3)),
                replaceString(data.get(4)), replaceString(data.get(5)));
        OrganizationCreateDto org = new OrganizationCreateDto(replaceString(data.get(0)), replaceString(data.get(1)),
                owner);

        String payload = new Gson().toJson(org);

        response = request
                .body(payload)
                .contentType(ContentType.JSON)
                .when()
                .post("/organizations/init");
    }

    private String replaceString(String input) {
        if (input == null) return "";

        switch (input) {
            case "LONG_ORG_NAME":
                return "testOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgte" +
                        "stOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgtes" +
                        "tOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgtest" +
                        "OrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestO" +
                        "rgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOrgtestOr" +
                        "gtestOrgtestOrgtestOrgtestOrgtestOrgtestOrg";
            case "LONG_ORG_PHONE":
                return "123456789012345678901";
            case "LONG_ADMIN_NAME":
                return "testNametestNametestNametestNametestNametestNametestName";
            case "LONG_ADMIN_SURNAME":
                return "testSurnametestSurnametestSurnametestSurnametestSurnametestSurnametestSurnametestSurnametestS" +
                        "urnametestSurname";
            case "LONG_ADMIN_EMAIL":
                return "emailemailemailemailemailemailemailemailemailemailemail@email.com";
            default:
                return input;
        }
    }
}
