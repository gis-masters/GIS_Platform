package ru.mycrg.acceptance;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.Before;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.cucumber.messages.internal.com.google.gson.Gson;
import io.restassured.http.ContentType;
import io.restassured.path.json.JsonPath;
import ru.mycrg.auth_service_contract.dto.OrganizationCreateDto;
import ru.mycrg.auth_service_contract.dto.UserCreateDto;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.junit.Assert.*;

public class OrganizationStepsDefinitions extends BaseStepsDefinitions {

    public static Duration authRequestDurationRestriction = Duration.ofSeconds(120);
    public static String orgId;
    public static OrganizationCreateDto org;

    @Before
    public void setup() {
        super.setup();
    }

    @When("Создается организация")
    public void createOrganization(DataTable dataTable) {
        setup();
        List<String> data = dataTable.asList();
        UserCreateDto owner = new UserCreateDto(replaceString(data.get(2)), replaceString(data.get(3)),
                replaceString(data.get(4)), replaceString(data.get(5)));
        org = new OrganizationCreateDto(replaceString(data.get(0)), replaceString(data.get(1)),
                owner);

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

        assertNotEquals("", orgId);
    }

    @When("Администратор проверяет создана ли организация")
    public void getOrgInfoByAdmin() {
        response = request.basePath("/organizations/")
                .cookie(adminCookie)
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

        orgs.put(org.getOwner().getEmail(), org);
    }

    @Given("Существует организация")
    public void checkOrg(DataTable dataTable) {
        if (!orgs.containsKey(dataTable.asList().get(4))) {
            createOrganization(dataTable);
        }
    }

    @When("Администратор пытается авторизоваться")
    public void tryToGetAuthorizeAdmin(DataTable dataTable) throws InterruptedException {
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

    @Then("Сервер авторизует администратора")
    public void serverAuthorizeAdmin() {
        adminCookie = response.getDetailedCookie("crgAuthCookie");
        assertNotNull(adminCookie);
    }
}
