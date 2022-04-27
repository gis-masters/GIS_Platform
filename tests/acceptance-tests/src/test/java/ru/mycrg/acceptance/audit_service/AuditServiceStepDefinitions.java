package ru.mycrg.acceptance.audit_service;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.audit_service.dto.AuditEventDto;

import java.time.LocalDateTime;
import java.util.*;

import static java.lang.Thread.sleep;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.http.HttpStatus.SC_OK;
import static org.junit.Assert.assertThrows;
import static org.junit.Assert.assertTrue;
import static ru.mycrg.acceptance.audit_service.dto.AuditEventActionsType.*;
import static ru.mycrg.acceptance.audit_service.dto.AuditEventEntityType.*;
import static ru.mycrg.acceptance.auth_service.OrganizationStepsDefinitions.MAX_RETRY_ATTEMPT;
import static ru.mycrg.acceptance.gis_service.LayerStepDefinitions.layerCreateDto;
import static ru.mycrg.acceptance.gis_service.ProjectStepsDefinitions.projectDto;

public class AuditServiceStepDefinitions extends BaseStepsDefinitions {

    private final String CURRENT_TIME = "CURRENT_TIME";
    private final String EVENTS = "events";
    private final String ACTION_TYPE_PATH = "_embedded.events.actionType";
    private final String ENTITY_TYPE_PATH = "_embedded.events.entityType";

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

    @When("Пользователь делает запрос на создание события аудита {string} {string} {string} {string} {string} {string}")
    public void addEvent(String eventDateTime, String actionType, String entityName, String entityType, String entityId,
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
            auditEventDto = new AuditEventDto(dateTime,
                                              generateString(actionType),
                                              generateString(entityName),
                                              generateString(entityType),
                                              Long.parseLong(entityId),
                                              createJsonNode(generateJsonString(entityStateAfter)));
        }

        System.out.println(auditEventDto);

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
        addEvent(CURRENT_TIME, actionType, "", "", "", "");
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
        assertTrue(data.toString().contains("entityType"));
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
            addEvent(CURRENT_TIME, "SIGN_IN", "", "", "", "");
        }
    }

    @Then("Создан аудит лог о входе пользователя в систему")
    public void checkAuditEventSignIn() {
        assertTrue(checkAuditEvents(ACTION_TYPE_PATH, SIGN_IN.name()));
    }

    @Then("Создан аудит лог о выходе пользователя из системы")
    public void checkAuditEventSignOut() {
        assertTrue(checkAuditEvents(ACTION_TYPE_PATH, SIGN_OUT.name()));
    }

    @Then("Аудит лог о разлогинивании не создается")
    public void checkSignOutWithoutToken() {
        assertThrows(RuntimeException.class, () -> checkAuditEvents(ACTION_TYPE_PATH, SIGN_OUT.name()));
    }

    @Then("Создан аудит лог о создании проекта")
    public void checkProjectCreate() throws InterruptedException {
        sleep(500);

        assertTrue(checkAuditEvents(ENTITY_TYPE_PATH, PROJECT.name()));
        assertTrue(checkAuditEvents(ACTION_TYPE_PATH, CREATE.name()));
    }

    @Then("Создана запись в журнале аудита о создании документа")
    public void checkDocumentCreate() throws InterruptedException {
        sleep(500);

        assertTrue(checkAuditEvents(ENTITY_TYPE_PATH, LIBRARY_RECORD.name()));
        assertTrue(checkAuditEvents(ACTION_TYPE_PATH, CREATE.name()));
    }

    @Then("Создана запись в журнале аудита о создании записи в слое")
    public void checkFeatureCreate() throws InterruptedException {
        sleep(500);

        assertTrue(checkAuditEvents(ENTITY_TYPE_PATH, FEATURE.name()));
        assertTrue(checkAuditEvents(ACTION_TYPE_PATH, CREATE.name()));
    }

    @Then("Создан аудит лог о создании слоя")
    public void checkLayerCreate() throws InterruptedException {
        sleep(500);

        assertTrue(checkAuditEvents(ACTION_TYPE_PATH, CREATE.name()));
        assertTrue(checkAuditEvents(ENTITY_TYPE_PATH, LAYER.name()));
    }

    @Then("Создан аудит лог об удалении проекта")
    public void checkProjectDelete() throws InterruptedException {
        sleep(500);

        assertTrue(checkAuditEvents(ENTITY_TYPE_PATH, PROJECT.name()));
        assertTrue(checkAuditEvents(ACTION_TYPE_PATH, DELETE.name()));
    }

    @Then("Создан аудит лог об удалении слоя")
    public void checkLayerDelete() throws InterruptedException {
        sleep(500);

        assertTrue(checkAuditEvents(ENTITY_TYPE_PATH, LAYER.name()));
        assertTrue(checkAuditEvents(ACTION_TYPE_PATH, DELETE.name()));
    }

    @And("Создан аудит лог об изменении проекта")
    public void checkProjectUpdate() throws InterruptedException {
        sleep(500);

        assertTrue(checkAuditEvents(ENTITY_TYPE_PATH, PROJECT.name()));
        assertTrue(checkAuditEvents(ACTION_TYPE_PATH, UPDATE.name()));
    }

    @And("Создан аудит лог об изменении записи в слое")
    public void checkFeatureUpdate() throws InterruptedException {
        sleep(500);

        assertTrue(checkAuditEvents(ENTITY_TYPE_PATH, FEATURE.name()));
        assertTrue(checkAuditEvents(ACTION_TYPE_PATH, UPDATE.name()));
    }

    @Then("Создана запись в журнале аудита о создании датасета")
    public void checkDatasetCreate() throws InterruptedException {
        sleep(500);

        assertTrue(checkAuditEvents(ENTITY_TYPE_PATH, DATASET.name()));
        assertTrue(checkAuditEvents(ACTION_TYPE_PATH, CREATE.name()));
    }

    @Then("Создана запись в журнале аудита об удалении датасета")
    public void checkDatasetDelete() throws InterruptedException {
        sleep(500);

        assertTrue(checkAuditEvents(ENTITY_TYPE_PATH, DATASET.name()));
        assertTrue(checkAuditEvents(ACTION_TYPE_PATH, DELETE.name()));
    }

    @Then("Создана запись в журнале аудита о создании правила")
    public void checkPermissionCreate() throws InterruptedException {
        sleep(500);

        assertTrue(checkAuditEvents(ENTITY_TYPE_PATH, PERMISSION.name()));
        assertTrue(checkAuditEvents(ACTION_TYPE_PATH, CREATE.name()));
    }

    @Then("Создана запись в журнале аудита об удалении правила")
    public void checkPermissionDelete() throws InterruptedException {
        sleep(500);

        assertTrue(checkAuditEvents(ENTITY_TYPE_PATH, PERMISSION.name()));
        assertTrue(checkAuditEvents(ACTION_TYPE_PATH, DELETE.name()));
    }

    @And("Создан аудит лог об изменении слоя")
    public void checkLayerUpdate() throws InterruptedException {
        sleep(500);

        assertTrue(checkAuditEvents(ENTITY_TYPE_PATH, LAYER.name()));
        assertTrue(checkAuditEvents(ACTION_TYPE_PATH, UPDATE.name()));
    }

    @And("Записано корректное тело проекта")
    public void checkProjectEntityStateAfter() {
        String projectName = projectDto.getProjectName();
        String errMsg = String.format("Запись о данном проекте %s не найдена", projectName);

        getAllAuditEntity();
        checkAuditEventsEntityStateAfterByKey(projectName, "name", errMsg);
    }

    @And("Записано корректное тело слоя")
    public void checkLayerEntityStateAfter() {
        String errMsg = String.format("Запись о данном слое %s не найдена", gson.toJson(layerCreateDto));
        getAllAuditEntity();

        checkAuditEventsEntityStateAfterByKey(layerCreateDto.getTitle(), "title", errMsg);
        checkAuditEventsEntityStateAfterByKey(layerCreateDto.getDataset(), "dataset", errMsg);
        checkAuditEventsEntityStateAfterByKey(layerCreateDto.getNativeCRS(), "nativeCRS", errMsg);
    }

    @Then("Создана запись в журнале аудита о создании таблицы")
    public void checkTableCreate() throws InterruptedException {
        sleep(500);

        assertTrue(checkAuditEvents(ENTITY_TYPE_PATH, TABLE.name()));
        assertTrue(checkAuditEvents(ACTION_TYPE_PATH, CREATE.name()));
    }

    @Then("Создана запись в журнале аудита об обновлении таблицы")
    public void checkTableUpdate() throws InterruptedException {
        sleep(500);

        assertTrue(checkAuditEvents(ENTITY_TYPE_PATH, TABLE.name()));
        assertTrue(checkAuditEvents(ACTION_TYPE_PATH, UPDATE.name()));
    }

    @Then("Создана запись в журнале аудита об удалении таблицы")
    public void checkTableDelete() throws InterruptedException {
        sleep(500);

        assertTrue(checkAuditEvents(ENTITY_TYPE_PATH, TABLE.name()));
        assertTrue(checkAuditEvents(ACTION_TYPE_PATH, DELETE.name()));
    }

    private void checkAuditEventsEntityStateAfterByKey(String verifiedInformation, String key, String errMsg) {
        response.jsonPath().getList("_embedded.events.entityStateAfter")
                .stream()
                .filter(listItem -> Objects.equals(((LinkedHashMap<?, ?>) listItem).get(key), verifiedInformation))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(errMsg));
    }

    private boolean checkAuditEvents(String path, String key) {
        try {
            int currentAttempt = 0;
            do {
                currentAttempt++;
                System.out.println("attempt create audit event " + currentAttempt);

                getAllAuditEntity();

                if (response.jsonPath().getList(path).contains(key)) {
                    return true;
                }

                sleep(800);
            } while (currentAttempt < MAX_RETRY_ATTEMPT);

            throw new RuntimeException("Audit event not created!");
        } catch (InterruptedException e) {
            throw new RuntimeException("Audit event not created!");
        }
    }
}
