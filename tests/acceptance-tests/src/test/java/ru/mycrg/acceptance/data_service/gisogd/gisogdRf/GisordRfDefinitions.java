package ru.mycrg.acceptance.data_service.gisogd.gisogdRf;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.auth_service.AuthorizationBase;
import ru.mycrg.acceptance.data_service.libraries.LibraryStepsDefinitions;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

import static java.lang.Thread.sleep;
import static java.time.LocalDateTime.now;
import static org.junit.Assert.*;
import static ru.mycrg.acceptance.auth_service.AuthorizationBase.AUTH_COOKIE;
import static ru.mycrg.acceptance.auth_service.AuthorizationBase.AUTH_COOKIE_VALUE_SEPARATOR;

public class GisordRfDefinitions extends BaseStepsDefinitions {

    private final AuthorizationBase authorizationBase = new AuthorizationBase();
    private final LibraryStepsDefinitions libraryStepsDefinitions = new LibraryStepsDefinitions();

    private Map<String, Integer> contextEntityIds = new LinkedHashMap<>();
    private String contextBearerToken;

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return getBaseRequestWithCurrentCookie("/gisogd-rf/send");
    }

    private RequestSpecification getBaseRequestWithCurrentCookie(String basePath) {
        return RestAssured
                .given()
                .log().ifValidationFails()
                .baseUri("http://localhost")
                .port(8084)
                .basePath(basePath)
                .header("Authorization", "Bearer " + contextBearerToken);
    }

    @Given("В библиотеке документов {string} существует запись для отправки в ГИСОГД РФ")
    public void createGisogdRfSendValidObject(String docLibrary) throws InterruptedException {
        String body;
        if (docLibrary.equals("dl_data_inbox_data")) {
            body = String.format(
                    "{\"title\":\"%s\", \"number\": \"%s\", \"guid\": \"%s\", \"date\":\"%s\", \"person_name\": \"%s\"," +
                            " \"request_type\": \"%s\"," +
                            "\"data_type\": \"%s\", \"record_status\": \"%s\",\"user_name\":\"%s\",\"is_folder\":false,\"path\":\"%s\"}",
                    "Я запись для ГИСОГД РФ", "2", UUID.randomUUID(), now(), "Тестировщик", "0B.1", "0Е.2", "1.А.1",
                    "Второй тестер", "/root/1");
        } else {
            body = String.format(
                    "{\"title\":\"%s\", \"guid\": \"%s\",\"is_folder\":false,\"path\":\"%s\"}",
                    "Я запись для ГИСОГД РФ", UUID.randomUUID(), "/root/1");
        }
        createGisordRfObject(docLibrary, body);
    }

    @Given("В библиотеке документов {string} существует запись для запроса аудита в ГИСОГД РФ")
    public void createGisogdRfAuditValidObject(String docLibrary) throws InterruptedException {
        String body;
        if (docLibrary.equals("dl_data_inbox_data")) {
            body = String.format(
                    "{\"title\":\"%s\", \"guid\": \"%s\", \"date\":\"%s\", \"person_name\": \"%s\", \"request_type\": \"%s\"," +
                            "\"data_type\": \"%s\", \"record_status\": \"%s\",\"user_name\":\"%s\",\"is_folder\":false,\"path\":\"%s\", \"gisogdrf_publication_datetime\": \"%s\"}",
                    "Я запись для ГИСОГД РФ", UUID.randomUUID(), now(), "Тестировщик", "0B.1",
                    "0Е.2", "1.А.1", "Второй тестер", "/root/1", now().plusDays(1));
        } else {
            body = String.format(
                    "{\"title\":\"%s\", \"guid\": \"%s\",\"is_folder\":false,\"path\":\"%s\", \"gisogdrf_publication_datetime\": \"%s\"}",
                    "Я запись для ГИСОГД РФ", UUID.randomUUID(), "/root/1", now().plusDays(1));
        }

        createGisordRfObject(docLibrary, body);
    }

    @When("Запись из контекста ставиться на отправку в ГИСОГД РФ")
    public void publishContextGisogdRfObject() {
        // Извлекаем единственную пару ключ-значение из contextEntityIds
        Map.Entry<String, Integer> singleEntry = contextEntityIds.entrySet().iterator().next();
        String entityName = singleEntry.getKey();
        String entityId = String.valueOf(singleEntry.getValue());

        Map<String, String> queryParams = new HashMap<>() {{
            put("entityName", entityName);
            put("entityId", entityId);
        }};

        authorizationBase.loginAsOwner();
        cookie = response.getDetailedCookie(AUTH_COOKIE);
        String cookieValue = cookie.getValue();
        contextBearerToken = cookieValue.split(AUTH_COOKIE_VALUE_SEPARATOR)[0];

        response = getBaseRequestWithCurrentCookie("/gisogd-rf/send")
                .given().
                        queryParams(queryParams)
                .when().
                        post()
                .then().
                        log().ifError().
                        extract().response();

        assertEquals(201, response.getStatusCode());
    }

    @Then("Поля записи из контекста заполнены корректно")
    public void checkGisogdRfAfterSendAnswer() throws InterruptedException {
        //Необходимо гарантировать что у нас всегда 1 объект
        Map.Entry<String, Integer> singleEntry = contextEntityIds.entrySet().iterator().next();
        String entityName = singleEntry.getKey();
        Integer entityId = singleEntry.getValue();

        mainChekThatAnswerValid(entityId, entityName);

        contextEntityIds.clear();
    }

    @When("Все записи массово ставятся на отправку в ГИСОГД РФ")
    public void publishAllGisogdRf() {
        authorizationBase.loginAsOwner();
        cookie = response.getDetailedCookie(AUTH_COOKIE);
        String cookieValue = cookie.getValue();
        contextBearerToken = cookieValue.split(AUTH_COOKIE_VALUE_SEPARATOR)[0];

        Map<String, Integer> queryParams = new HashMap<>() {{
            put("limit", 100000);
        }};
        response = getBaseRequestWithCurrentCookie("/gisogd-rf/publish")
                .given().
                        queryParams(queryParams)
                .when().
                        post()
                .then().
                        log().ifError().
                        extract().response();

        assertEquals(201, response.getStatusCode());
    }

    @When("Все записи массово ставятся на запрос аудита в ГИСОГД РФ")
    public void auditAllGisogdRf() {
        authorizationBase.loginAsOwner();
        cookie = response.getDetailedCookie(AUTH_COOKIE);
        String cookieValue = cookie.getValue();
        contextBearerToken = cookieValue.split(AUTH_COOKIE_VALUE_SEPARATOR)[0];

        Map<String, Integer> queryParams = new HashMap<>() {{
            put("limit", 100000);
        }};
        response = getBaseRequestWithCurrentCookie("/gisogd-rf/full-audit")
                .given().
                        queryParams(queryParams)
                .when().
                        post()
                .then().
                        log().ifError().
                        extract().response();

        assertEquals(202, response.getStatusCode());
    }

    @Then("В каждой созданной записи поля связанные с ГИСОГД РФ заполнены корректно")
    public void checkAllPublishedData() throws InterruptedException {
        for (Map.Entry<String, Integer> entry: contextEntityIds.entrySet()) {
            mainChekThatAnswerValid(entry.getValue(), entry.getKey());
        }

        contextEntityIds.clear();
    }

    @When("Текущая запись ставиться на запрос аудита в ГИСОГД РФ")
    public void doAudit() {
        authorizationBase.loginAsOwner();
        cookie = response.getDetailedCookie(AUTH_COOKIE);
        String cookieValue = cookie.getValue();
        contextBearerToken = cookieValue.split(AUTH_COOKIE_VALUE_SEPARATOR)[0];

        Map.Entry<String, Integer> singleEntry = contextEntityIds.entrySet().iterator().next();
        String entityName = singleEntry.getKey();
        String entityId = String.valueOf(singleEntry.getValue());

        Map<String, String> queryParams = new HashMap<>() {{
            put("entityName", entityName);
            put("entityId", entityId);
        }};

        response = getBaseRequestWithCurrentCookie("/gisogd-rf/audit")
                .given().
                        queryParams(queryParams)
                .when().
                        post()
                .then().
                        log().ifError().
                        extract().response();

        assertEquals(202, response.getStatusCode());
    }

    private void mainChekThatAnswerValid(Integer entityId, String entityName) throws InterruptedException {
        sleep(5000);
        libraryStepsDefinitions.getRecordByEcqlFilterAndRecordId("", String.valueOf(entityId), entityName);

        String gisogdrfResponse = response.jsonPath().get("content[0].content.gisogdrf_response");

        String expectedResponse = "[invalid_client]";

        assertNotNull("Field 'gisogdrf_response' не должно быть null", gisogdrfResponse);
        assertFalse("Field 'gisogdrf_response' не должно быть пустым", gisogdrfResponse.isEmpty());
        assertTrue("Field 'gisogdrf_response' значение не совпало с ожидаемым.",
                   gisogdrfResponse.contains(expectedResponse));
    }

    private void createGisordRfObject(String docLibrary, String body) throws InterruptedException {
        libraryStepsDefinitions.createDocumentAndWriteAsCurrent(body, docLibrary);

        sleep(400);

        assertEquals(201, response.getStatusCode());
        contextEntityIds.put(docLibrary, response.jsonPath().get("id"));
    }
}
