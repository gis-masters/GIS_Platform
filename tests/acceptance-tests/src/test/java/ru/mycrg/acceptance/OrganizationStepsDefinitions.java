package ru.mycrg.acceptance;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.Before;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.cucumber.messages.internal.com.google.gson.Gson;
import io.restassured.http.ContentType;
import io.restassured.http.Cookie;
import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import ru.mycrg.auth_service_contract.dto.OrganizationCreateDto;
import ru.mycrg.auth_service_contract.dto.UserCreateDto;

import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static java.lang.Thread.sleep;
import static org.apache.http.HttpStatus.SC_ACCEPTED;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class OrganizationStepsDefinitions extends BaseStepsDefinitions {

    public static int MAX_RETRY_ATTEMPT = 50;
    public static int RETRY_DELAY = 6000;

    public static Integer currentOrgId;
    public static OrganizationCreateDto currentOrgDto;

    @Before
    public void setup() {
        super.setup();
    }

    @When("Отправляется запрос на создание организации")
    public void sendCreateOrganizationRequest(DataTable dataTable) {
        currentOrgDto = mapToOrgDto(dataTable);

        createOrganization(currentOrgDto);
    }

    @And("в заголовке Location передает ID созданной организации")
    public void extractLocation() {
        String header = response.getHeader("Location");
        Pattern pattern = Pattern.compile("\\d+$");
        Matcher matcher = pattern.matcher(header);

        while (matcher.find()) {
            currentOrgId = Integer.parseInt(matcher.group());
        }

        assertNotNull(currentOrgId);
    }

    @When("Проверяем создана ли организация")
    public void getOrgInfoByAdmin() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/organizations/" + currentOrgId);
    }

    @When("Ждем окончания процесса создания организации")
    public void waitUntilOrganizationSuccessfullyCreated() throws InterruptedException {
        waitUntilOrganizationSuccessfullyCreated(currentOrgId, cookie);

        orgPool.put(currentOrgId, currentOrgDto);
    }

    @When("Ждем окончания процесса удаления организации")
    public void waitUntilOrganizationSuccessfullyDeleted() throws InterruptedException {
        waitUntilOrganizationSuccessfullyDeleted(currentOrgId, cookie);

        orgPool.put(currentOrgId, currentOrgDto);
    }

    @And("Статус организации соответствует {string}")
    public void checkIsOrgProvisioned(String status) {
        JsonPath jsonPath = response.jsonPath();

        assertEquals(jsonPath.get("status"), status);

        orgPool.put(currentOrgId, currentOrgDto);
    }

    @And("Поля совпадают с переданными")
    public void checkIsOrgProvisioned(DataTable dataTable) {
        List<String> data = dataTable.asList();

        JsonPath jsonPath = response.jsonPath();

        assertEquals(jsonPath.get("name"), replaceString(data.get(0)));
        assertEquals(jsonPath.get("phone"), replaceString(data.get(1)));
        assertEquals(jsonPath.getList("users.name").get(0), replaceString(data.get(2)));
        assertEquals(jsonPath.getList("users.surName").get(0), replaceString(data.get(3)));
        assertEquals(jsonPath.getList("users.email").get(0), replaceString(data.get(4)));
    }

    /**
     * Гарантирует создание огранизации, если таковая не была найдена в пуле.
     * Добавляет созданную орг. в пул и "current" переменные
     *
     * @param dataTable Параметры организации.
     * @throws InterruptedException
     */
    @Given("Существует организация")
    public void createOrganization(DataTable dataTable) throws InterruptedException {
        String eMail = replaceString(dataTable.asList().get(4));

        if (!isOrgExistInPool(eMail)) {
            OrganizationCreateDto dto = mapToOrgDto(dataTable);
            Response createResponse = createOrganization(dto);

            assertEquals(SC_ACCEPTED, createResponse.getStatusCode());

            response = createResponse;
            Integer id = extractOrgId(createResponse);

            Cookie cookie = new AuthorizationStepDefinitions().getRootAuthority();
            waitUntilOrganizationSuccessfullyCreated(id, cookie);

            currentOrgId = id;
            currentOrgDto = dto;
            orgPool.put(id, dto);
        }
    }

    @When("Посылается запрос на удаление текущей организации")
    public void deleteCurrentOrganization() {
        assertNotNull(currentOrgId);

        deleteOrganization(currentOrgId);
    }

    @When("Посылается запрос на удаление организации {string}")
    public void deleteOrganizationByEmail(String eMail) {
        Integer orgId = null;
        for (Map.Entry<Integer, OrganizationCreateDto> entry : orgPool.entrySet()) {
            Integer id = entry.getKey();
            OrganizationCreateDto dto = entry.getValue();
            if (replaceString(eMail).equals(dto.getOwner().getEmail())) {
                orgId = id;
            }
        }

        assertNotNull(orgId);

        deleteOrganization(orgId);
    }

    @And("Удалена БД организации")
    public void isOrgDbNotExist() {
        String dbName = "database_" + currentOrgId;

        Response response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/api/data/databases/" + dbName);

        checkStatusCodeIs(response, 404);
    }

    @And("Существует база данных")
    public void isOrgDbExist() {
        String dbName = "database_" + currentOrgId;

        Response response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/api/data/databases/" + dbName);

        checkStatusCodeIs(response, 200);
    }

    private void deleteOrganization(Integer orgId) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        delete("/organizations/" + orgId);
    }

    private boolean isOrgExistInPool(String eMail) {
        return orgPool
                .values().stream()
                .anyMatch(dto -> eMail.equals(dto.getOwner().getEmail()));
    }

    private Integer extractOrgId(Response response) {
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

    private void waitUntilOrganizationSuccessfullyCreated(Integer id, Cookie cookie) throws InterruptedException {
        System.out.println("check status org: " + id);

        int currentAttempt = 0;
        do {
            System.out.println("attempt: " + currentAttempt);
            currentAttempt++;

            Response response = getBaseRequestWithCurrentCookie()
                    .when().
                            get("/organizations/" + id);

            if (response.statusCode() == 200 && "PROVISIONED".equals(response.jsonPath().get("status"))) {
                return;
            }

            sleep(RETRY_DELAY);
        } while (currentAttempt < MAX_RETRY_ATTEMPT);

        throw new RuntimeException("Organization not created: " + id);
    }

    private void waitUntilOrganizationSuccessfullyDeleted(Integer id, Cookie cookie) throws InterruptedException {
        System.out.println("check status org: " + id);

        int currentAttempt = 0;
        do {
            System.out.println("attempt: " + currentAttempt);
            currentAttempt++;

            Response response = getBaseRequestWithCurrentCookie()
                    .when().
                            get("/organizations/" + id);

            if (response.statusCode() == 404) {
                return;
            }

            sleep(RETRY_DELAY);
        } while (currentAttempt < MAX_RETRY_ATTEMPT);

        throw new RuntimeException("Organization not created: " + id);
    }

    private Response createOrganization(OrganizationCreateDto dto) {
        response = getBaseRequest()
                .given().
                        body(new Gson().toJson(dto)).
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        post("/organizations/init");

        return response;
    }

    private OrganizationCreateDto mapToOrgDto(DataTable dataTable) {
        List<String> data = dataTable.asList();
        UserCreateDto owner = new UserCreateDto(replaceString(data.get(2)), replaceString(data.get(3)),
                                                replaceString(data.get(4)), replaceString(data.get(5)));

        return new OrganizationCreateDto(replaceString(data.get(0)), replaceString(data.get(1)), owner);
    }

    private void checkStatusCodeIs(Response response, int code) {
        response.then()
                .assertThat().
                        statusCode(code);
    }
}
