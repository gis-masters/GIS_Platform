package ru.mycrg.acceptance.audit_service;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.audit_service.dto.AuditEventDto;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.http.HttpStatus.SC_OK;
import static org.junit.Assert.assertTrue;

public class AuditServiceStepDefinitions extends BaseStepsDefinitions {

    private final String CURRENT_TIME = "CURRENT_TIME";
    private final String EVENTS = "events";

    @Override
    public RequestSpecification getBaseRequest() {
        return super.getBaseRequest().basePath("/events");
    }

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie().basePath("/events");
    }

    @When("Пользователь делает запрос на события")
    public void getAllAuditEntity() {
        super.getAllEntities();
    }

    @When("Пользователь делает запрос на создание события аудита {string} {string} {string} {string} {string}")
    public void addEvent(String eventDateTime, String actionType, String entityName, String entityId,
                         String entityStateAfter) {
        AuditEventDto auditEventDto;
        String dateTime = null;

        if (!isBlank(eventDateTime)) {
            if (CURRENT_TIME.equals(eventDateTime)) {
                dateTime = LocalDateTime.now().toString();
            } else {
                dateTime = eventDateTime;
            }
        }

        if (isBlank(entityName) || isBlank(entityId) || isBlank(entityStateAfter)) {
            auditEventDto = new AuditEventDto(dateTime, generateString(actionType));
        } else {
            auditEventDto = new AuditEventDto(dateTime, generateString(actionType),
                                              generateString(entityName), Long.parseLong(entityId),
                                              createJsonNode(generateJsonString(entityStateAfter)));
        }

        super.createEntity(auditEventDto);
    }

    @And("Отображаются события всех организаций")
    public void displayedAllOrganizationsEvents() {
        List<String> entitiesIds = response.jsonPath().getList("_embedded.events.organizationId");
        Set<String> uniqOrgId = new HashSet<>(entitiesIds);

        assertTrue(uniqOrgId.size() > 1);
    }

    @Given("Существует событие аудита {string}")
    public void initializeAuditEvent(String actionType) {
        addEvent(CURRENT_TIME, actionType, "", "", "");
    }

    @When("Пользователь делает запрос на обновление события аудита {string}")
    public void updateEvent(String method) {
        if ("put".equals(method)) {
            response = getBaseRequestWithCurrentCookie()
                    .when().
                            put("/2");
        } else if ("patch".equals(method)) {
            response = getBaseRequestWithCurrentCookie()
                    .when().
                            patch("/2");
        } else if ("delete".equals(method)) {
            response = getBaseRequestWithCurrentCookie()
                    .when().
                            delete("/2");
        }
    }

    @Then("Представление событий аудита имеет корректное тело")
    public void checkAuditEventKeys() {
        List<String> data = response
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        extract().jsonPath().
                        getList("_embedded.events");

        assertTrue(data.toString().contains("eventDateTime"));
        assertTrue(data.toString().contains("eventDateTime"));
        assertTrue(data.toString().contains("entityStateAfter"));
        assertTrue(data.toString().contains("actionType"));
        assertTrue(data.toString().contains("entityId"));
        assertTrue(data.toString().contains("organizationId"));
        assertTrue(data.toString().contains("entityName"));
        assertTrue(data.toString().contains("id"));
    }

    @When("Администратор делает постраничный запрос на события аудита")
    public void getAuditEventCount() {
        super.getAllAndFillEntityCount(EVENTS);
    }

    @And("Количество страниц событий аудита пропорционально {string}")
    public void checkAuditEventsPagesCount(String sortingDirection) {
        checkPagesCount(EVENTS, sortingDirection);
    }

    @And("На всех страницах событий аудита есть {string}")
    public void areAuditEventsOnPages(String entitiesPerPage) {
        checkSomethingOnPages(EVENTS, entitiesPerPage);
    }

    @Given("Существует заданное кол-во событий аудита: {int}")
    public void initializeAuditEvents(int count) {
        for (int i = 0; i < count; i++) {
            addEvent(CURRENT_TIME, "SIGN_IN", "", "", "");
        }
    }
}
