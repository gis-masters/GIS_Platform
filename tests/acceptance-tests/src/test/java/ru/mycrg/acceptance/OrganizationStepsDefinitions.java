package ru.mycrg.acceptance;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
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
import static org.apache.http.HttpStatus.*;
import static org.junit.Assert.*;

public class OrganizationStepsDefinitions extends BaseStepsDefinitions {

    public static int MAX_RETRY_ATTEMPT = 50;
    public static int RETRY_DELAY = 6000;

    public static Integer currentOrgId;
    public static OrganizationCreateDto currentOrgDto;


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
    public void checkOrgData() {
        JsonPath jsonPath = response.jsonPath();

        assertEquals(jsonPath.get("name"), currentOrgDto.getName());
        assertEquals(jsonPath.get("phone"), currentOrgDto.getPhone());
        assertEquals(jsonPath.getList("users.name").get(0), currentOrgDto.getOwner().getName());
        assertEquals(jsonPath.getList("users.surName").get(0), currentOrgDto.getOwner().getSurName());
        assertEquals(jsonPath.getList("users.email").get(0), currentOrgDto.getOwner().getEmail());
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
        if (takeAnyOrgFromPoll()) return;

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

    @When("Посылается запрос на удаление чужой организации")
    public void deleteOtherOrganizationByEmail() {
        Integer orgId = null;
        for (Map.Entry<Integer, OrganizationCreateDto> entry : orgPool.entrySet()) {
            Integer id = entry.getKey();
            OrganizationCreateDto dto = entry.getValue();
            if (!currentOrgDto.getOwner().getEmail().equals(dto.getOwner().getEmail())) {
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

        checkStatusCodeIs(response, SC_NOT_FOUND);
    }

    @And("Существует база данных")
    public void isOrgDbExist() {
        String dbName = "database_" + currentOrgId;

        Response response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/api/data/databases/" + dbName);

        checkStatusCodeIs(response, SC_OK);
    }

    @And("В ответе передает orgId")
    public void isOrgInResponse() {
        currentOrgId = jsonPath.get("orgId");
    }

    @When("Администратор запрашивает данные об организации с orgId  = {int}")
    public void checkSomeOrg(int orgId) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/organizations/" + orgId);
    }

    @When("Пользователь делает запрос на все организации")
    public void checkAllOrganizationsByRoot() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/organizations/");
    }

    @When("Администратор запрашивает данные об организации {string}")
    public void checkOrgInfo(String ownerEmail) {
        Integer orgId = null;
        for (Map.Entry<Integer, OrganizationCreateDto> entry : orgPool.entrySet()) {
            Integer id = entry.getKey();
            OrganizationCreateDto dto = entry.getValue();
            if (replaceString(ownerEmail).equals(dto.getOwner().getEmail())) {
                orgId = id;
                break;
            }
        }

        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/organizations/" + orgId);

        assertNotNull(orgId);
    }

    @And("Представление организации корректно")
    public void isOrgDataPresentedCorrectly() {
        Map<String, String> presentedData = response
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        extract().jsonPath().
                        getMap("");

        assertTrue(presentedData.containsKey("status"));
        assertTrue(presentedData.containsKey("groups"));
        assertTrue(presentedData.containsKey("phone"));
        assertTrue(presentedData.containsKey("createdAt"));
        assertTrue(presentedData.containsKey("users"));
    }

    @Then("Представление всех организаций корректно")
    public void areOrgDataPresentedCorrectly() {
        jsonPath = response.jsonPath();

        Map<String, String> presentedData = jsonPath.getMap("");
        Map<String, String> links = jsonPath.getMap("_links");
        Map<String, String> page = jsonPath.getMap("page");

        assertTrue(presentedData.containsKey("_embedded"));
        assertTrue(presentedData.containsKey("_links"));
        assertTrue(presentedData.containsKey("page"));

        assertTrue(links.containsKey("self"));
        assertTrue(links.containsKey("profile"));

        assertTrue(page.containsKey("size"));
        assertTrue(page.containsKey("totalElements"));
        assertTrue(page.containsKey("totalPages"));
        assertTrue(page.containsKey("number"));
    }

    @When("Отправляется повторный запрос на создание организации")
    public void sendAgainCreateOrganizationRequest() {
        createOrganization(currentOrgDto);
    }

    @When("Администратор запрашивает данные о своей организации")
    public void checkOrgInfo() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/organizations/" + currentOrgId);
    }

    @When("Администратор запрашивает данные о чужой организации")
    public void checkOtherOrgInfo() {
        Integer orgId = null;
        for (Map.Entry<Integer, OrganizationCreateDto> entry : orgPool.entrySet()) {
            Integer id = entry.getKey();
            OrganizationCreateDto dto = entry.getValue();
            if (!currentOrgDto.getOwner().getEmail().equals(dto.getOwner().getEmail())) {
                orgId = id;
                break;
            }
        }

        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/organizations/" + orgId);

        assertNotNull(orgId);
    }

    private void checkOrgData(DataTable dataTable) {
        List<String> data = dataTable.asList();

        JsonPath jsonPath = response.jsonPath();

        assertEquals(jsonPath.get("name"), replaceString(data.get(0)));
        assertEquals(jsonPath.get("phone"), replaceString(data.get(1)));
        assertEquals(jsonPath.getList("users.name").get(0), replaceString(data.get(2)));
        assertEquals(jsonPath.getList("users.surName").get(0), replaceString(data.get(3)));
        assertEquals(jsonPath.getList("users.email").get(0), replaceString(data.get(4)));
    }

    private void checkStatusCodeIs(Response response, int code) {
        response.then()
                .assertThat().
                        statusCode(code);
    }

    private OrganizationCreateDto mapToOrgDto(DataTable dataTable) {
        List<String> data = dataTable.asList();
        UserCreateDto owner = new UserCreateDto(replaceString(data.get(2)), replaceString(data.get(3)),
                                                replaceString(data.get(4)), replaceString(data.get(5)));

        return new OrganizationCreateDto(replaceString(data.get(0)), replaceString(data.get(1)), owner);
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

    private void waitUntilOrganizationSuccessfullyDeleted(Integer id, Cookie cookie) throws InterruptedException {
        System.out.println("check status org: " + id);

        int currentAttempt = 0;
        do {
            System.out.println("attempt: " + currentAttempt);
            currentAttempt++;

            Response response = getBaseRequestWithCurrentCookie()
                    .when().
                            get("/organizations/" + id);

            if (response.statusCode() == SC_NOT_FOUND) {
                return;
            }

            sleep(RETRY_DELAY);
        } while (currentAttempt < MAX_RETRY_ATTEMPT);

        throw new RuntimeException("Organization not created: " + id);
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

            if (response.statusCode() == SC_OK && "PROVISIONED".equals(response.jsonPath().get("status"))) {
                return;
            }

            sleep(RETRY_DELAY);
        } while (currentAttempt < MAX_RETRY_ATTEMPT);

        throw new RuntimeException("Organization not created: " + id);
    }

    private boolean isOrgExistInPool(String eMail) {
        return orgPool
                .values().stream()
                .anyMatch(dto -> eMail.equals(dto.getOwner().getEmail()));
    }

    private void deleteOrganization(Integer orgId) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        delete("/organizations/" + orgId);
    }

    private boolean takeAnyOrgFromPoll() {
        if (!orgPool.isEmpty()) {
            for (Map.Entry<Integer, OrganizationCreateDto> entry: orgPool.entrySet()
            ) {
                currentOrgId = entry.getKey();
                currentOrgDto = entry.getValue();
                return true;
            }
        }
        return false;
    }
}
