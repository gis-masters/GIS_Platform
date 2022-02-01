package ru.mycrg.acceptance.auth_service;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.http.Cookie;
import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.auth_service_contract.dto.OrganizationCreateDto;
import ru.mycrg.auth_service_contract.dto.UserCreateDto;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import static java.lang.Thread.sleep;
import static org.apache.http.HttpStatus.*;
import static org.junit.Assert.*;

public class OrganizationStepsDefinitions extends BaseStepsDefinitions {

    public static final int MAX_RETRY_ATTEMPT = 20;
    public static final int RETRY_DELAY = 6000;

    public static Integer orgId;
    public static OrganizationCreateDto orgDto;

    @When("Отправляется запрос на создание организации")
    public void sendCreateOrganizationRequest(DataTable dataTable) {
        List<String> data = dataTable.asList();
        String ownerEmail = generateString(data.get(4));
        UserCreateDto owner = new UserCreateDto(generateString(data.get(2)), generateString(data.get(3)),
                                                ownerEmail, generateString(data.get(5)));

        System.out.println("Org. Owner: " + ownerEmail);

        userPool.put(-1, owner);
        orgDto = new OrganizationCreateDto(generateString(data.get(0)), generateString(data.get(1)), owner);

        createOrganization(orgDto);
    }

    @And("В заголовке Location передается ID созданной организации")
    public void checkOrgIdInLocationSetAsCurrentPutInPool() {
        orgId = super.extractId(response.getHeader("Location"));

        orgPool.put(orgId, orgDto);
    }

    @When("Проверяем создана ли организация")
    public void getOrgInfoByAdmin() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/organizations/" + orgId);
    }

    @When("Ждем окончания процесса создания организации")
    public void waitUntilOrganizationSuccessfullyCreated() throws InterruptedException {
        waitUntilOrganizationSuccessfullyCreated(orgId);

        orgPool.put(orgId, orgDto);
    }

    @When("Ждем окончания процесса удаления организации")
    public void waitUntilOrganizationSuccessfullyDeleted() throws InterruptedException {
        waitUntilOrganizationSuccessfullyDeleted(orgId, cookie);

        orgPool.remove(orgId);
    }

    @And("Статус организации соответствует {string}")
    public void checkIsOrgProvisioned(String status) {
        JsonPath jsonPath = response.jsonPath();

        assertEquals(jsonPath.get("status"), status);

        orgPool.put(orgId, orgDto);
    }

    @And("Поля совпадают с переданными")
    public void checkOrgData() {
        JsonPath jsonPath = response.jsonPath();

        assertEquals(jsonPath.get("name"), orgDto.getName());
        assertEquals(jsonPath.get("phone"), orgDto.getPhone());
        assertEquals(jsonPath.getList("users.name").get(0), orgDto.getOwner().getName());
        assertEquals(jsonPath.getList("users.surname").get(0), orgDto.getOwner().getSurname());
        assertEquals(jsonPath.getList("users.email").get(0), orgDto.getOwner().getEmail());
    }

    /**
     * Гарантирует создание огранизации, если таковая не была найдена в пуле. Добавляет созданную орг. в пул и "current"
     * переменные
     *
     * @param dataTable Параметры организации.
     *
     * @throws InterruptedException Возникает если организация не создалась успешно и закончились попытки её проверки.
     */
    @Given("Существует организация")
    public void initOrg(DataTable dataTable) throws InterruptedException {
        boolean isPassedEmailRandom = dataTable.asList().get(4).split("_")[0].equals("EMAIL");
        String eMail = generateString(dataTable.asList().get(4));

        deleteAllEntitiesInOrg();

        if (isOrgExistInPool(eMail)) {
            makeExactOrgAsCurrent(eMail);
        } else if (!orgPool.isEmpty() && isPassedEmailRandom) {
            makeFirstAvailableOrgAsCurrent();
        } else {
            sendCreateOrganizationRequest(dataTable);

            assertEquals(SC_ACCEPTED, response.getStatusCode());

            checkOrgIdInLocationSetAsCurrentPutInPool();

            waitUntilOrganizationSuccessfullyCreated(orgId);
        }
    }

    /**
     * Берем любую существующую организацию из пула. Создаём если пул организаций еще пуст.
     */
    @Given("Существует любая организация")
    public void getExistOrg() throws InterruptedException {
        final Iterator<Map.Entry<Integer, OrganizationCreateDto>> iterator = orgPool.entrySet().iterator();
        if (iterator.hasNext()) {
            Map.Entry<Integer, OrganizationCreateDto> entry = iterator.next();
            orgId = entry.getKey();
            orgDto = entry.getValue();
        } else {
            final List<String> data = new ArrayList<>();
            data.add("ООО FizИКоровы");
            data.add("1234567890");
            data.add("Ivanov");
            data.add("Ivan");
            data.add("EMAIL_20");
            data.add("testPassword1");

            final List<List<String>> raw = new ArrayList<>();
            raw.add(data);

            initOrg(DataTable.create(raw));
        }
    }

    @When("Посылается запрос на удаление текущей организации")
    public void deleteCurrentOrganization() {
        assertNotNull(orgId);

        deleteOrganization(orgId);
    }

    @When("Посылается запрос на удаление чужой организации")
    public void deleteOtherOrganization() {
        Integer orgId = null;
        for (Map.Entry<Integer, OrganizationCreateDto> entry: orgPool.entrySet()) {
            Integer id = entry.getKey();
            OrganizationCreateDto dto = entry.getValue();
            if (!orgDto.getOwner().getEmail().equals(dto.getOwner().getEmail())) {
                orgId = id;
            }
        }

        assertNotNull(orgId);

        deleteOrganization(orgId);
    }

    @And("Удалена БД организации")
    public void isOrgDbNotExist() {
        String dbName = "database_" + orgId;

        Response response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/api/data/databases/" + dbName);

        checkStatusCodeIs(response, SC_NOT_FOUND);
    }

    @And("Существует база данных")
    public void isOrgDbExist() {
        String dbName = "database_" + orgId;

        Response response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/api/data/databases/" + dbName);

        checkStatusCodeIs(response, SC_OK);
    }

    @When("Пользователь делает запрос на все организации")
    public void checkAllOrganizationsByRoot() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/organizations/");
    }

    @And("Представление организации корректно")
    public void checkOrgKeys() {
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

    @When("Отправляется повторный запрос на создание организации")
    public void sendAgainCreateOrganizationRequest() {
        createOrganization(orgDto);
    }

    @When("Администратор запрашивает данные о своей организации")
    public void checkOrgInfo() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/organizations/" + orgId);
    }

    @When("Администратор запрашивает данные о чужой организации")
    public void checkOtherOrgInfo() {
        Integer orgId = null;
        for (Map.Entry<Integer, OrganizationCreateDto> entry: orgPool.entrySet()) {
            Integer id = entry.getKey();
            OrganizationCreateDto dto = entry.getValue();
            if (!orgDto.getOwner().getEmail().equals(dto.getOwner().getEmail())) {
                orgId = id;
                break;
            }
        }

        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/organizations/" + orgId);

        assertNotNull(orgId);
    }

    private void checkStatusCodeIs(Response response, int code) {
        response.then()
                .assertThat().
                        statusCode(code);
    }

    private void createOrganization(OrganizationCreateDto dto) {
        response = getBaseRequest()
                .given().
                        body(gson.toJson(dto)).
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        post("/organizations/init");
    }

    private void waitUntilOrganizationSuccessfullyDeleted(Integer id, Cookie cookie) throws InterruptedException {
        System.out.println("check status org: " + id);

        int currentAttempt = 0;
        do {
            System.out.println("attempt delete org: " + currentAttempt);
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

    private void waitUntilOrganizationSuccessfullyCreated(Integer id) throws InterruptedException {
        new AuthorizationStepDefinitions().authorizeAsRoot();

        System.out.println("check status org: " + id);

        int currentAttempt = 0;
        do {
            System.out.println("attempt create org: " + currentAttempt);
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

    private void deleteOrganization(Integer id) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        delete("/organizations/" + id);

        orgPool.remove(orgId);
    }

    private void makeExactOrgAsCurrent(String email) {
        orgPool.entrySet().stream()
               .filter(entry -> entry.getValue().getOwner().getEmail().equals(email))
               .findFirst()
               .ifPresent(entry -> {
                   orgId = entry.getKey();
                   orgDto = entry.getValue();
               });
    }

    private void makeFirstAvailableOrgAsCurrent() {
        orgPool.entrySet().stream()
               .findFirst()
               .ifPresent(entry -> {
                   orgId = entry.getKey();
                   orgDto = entry.getValue();
               });
    }
}
