package ru.mycrg.acceptance.audit_service;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.audit_service.dto.AuditEventDto;
import ru.mycrg.acceptance.audit_service.dto.AuditEventEntityType;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static java.lang.Thread.sleep;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.http.HttpStatus.SC_OK;
import static org.junit.Assert.assertTrue;
import static ru.mycrg.acceptance.audit_service.dto.AuditEventActionsType.*;
import static ru.mycrg.acceptance.audit_service.dto.AuditEventEntityType.*;
import static ru.mycrg.acceptance.auth_service.OrganizationStepsDefinitions.MAX_RETRY_ATTEMPT;
import static ru.mycrg.acceptance.auth_service.UserStepsDefinitions.userDto;
import static ru.mycrg.acceptance.data_service.datasets.DatasetsStepsDefinitions.currentDatasetIdentifier;
import static ru.mycrg.acceptance.data_service.libraries.LibraryPermissionsStepsDefinitions.DEFAULT_LIBRARY;
import static ru.mycrg.acceptance.data_service.tables.TablesStepsDefinitions.anotherTableName;
import static ru.mycrg.acceptance.data_service.tables.TablesStepsDefinitions.currentTableName;
import static ru.mycrg.acceptance.gis_service.LayerStepDefinitions.layerCreateDto;
import static ru.mycrg.acceptance.gis_service.ProjectStepsDefinitions.projectDto;

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

    @When("Пользователь делает запрос на создание события аудита {string} {string} {string} {string} {string} {string}")
    public void addEvent(String eDateTime, String aType, String eName, String eType, String eId, String stateAfter) {
        AuditEventDto auditEventDto;
        String dateTime = null;

        if (!isBlank(eDateTime)) {
            if (CURRENT_TIME.equals(eDateTime)) {
                dateTime = LocalDateTime.now().toString();
            } else {
                dateTime = eDateTime;
            }
        }

        if (isBlank(eName) || isBlank(eId) || isBlank(stateAfter)) {
            auditEventDto = new AuditEventDto(dateTime, generateString(aType));
        } else {
            auditEventDto = new AuditEventDto(dateTime,
                                              generateString(aType),
                                              generateString(eName),
                                              generateString(eType),
                                              Long.parseLong(eId),
                                              createJsonNode(generateJsonString(stateAfter)));
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
        addEvent(CURRENT_TIME, actionType, "testEntity", "user", "-1", "null");
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
        checkAuditEvent(SIGN_IN.name(), USER, "user");
    }

    @Then("Создан аудит лог о выходе пользователя из системы")
    public void checkAuditEventSignOut() {
        checkAuditEvent(SIGN_OUT.name(), USER, "user");
    }

    @Then("Создан аудит лог о создании проекта, с корректным телом")
    public void checkProjectCreate() {
        String projectName = projectDto.getProjectName();

        checkAuditEvent(CREATE.name(), PROJECT, projectName);
    }

    @Then("Создана запись в журнале аудита о создании документа")
    public void checkDocumentCreate() {
        checkAuditEvent(CREATE.name(), LIBRARY_RECORD, DEFAULT_LIBRARY);
    }

    @Then("Создана запись в журнале аудита о создании записи в слое")
    public void checkFeatureCreate() {
        checkAuditEvent(CREATE.name(), FEATURE, currentTableName);
    }

    @Then("Создан аудит лог о создании слоя, с корректным телом")
    public void checkLayerCreate() {
        String tableName = layerCreateDto.getTableName();

        checkAuditEvent(CREATE.name(), LAYER, tableName);
    }

    @Then("Создан аудит лог об удалении проекта")
    public void checkProjectDelete() {
        String projectName = projectDto.getProjectName();

        checkAuditEvent(DELETE.name(), PROJECT, projectName);
    }

    @Then("Создан аудит лог об удалении слоя, с корректным телом")
    public void checkLayerDelete() {
        String tableName = layerCreateDto.getTableName();

        checkAuditEvent(DELETE.name(), LAYER, tableName);
    }

    @And("Создан аудит лог об изменении проекта")
    public void checkProjectUpdate() {
        String projectName = projectDto.getProjectName();

        checkAuditEvent(UPDATE.name(), PROJECT, projectName);
    }

    @And("Создан аудит лог об изменении записи в слое")
    public void checkFeatureUpdate() {
        checkAuditEvent(UPDATE.name(), FEATURE, currentTableName);
    }

    @And("Создан аудит лог о массовом удалении записей")
    public void checkFeaturesDelete() {
        checkAuditEvent(MULTIPLE_DELETION.name(), FEATURE, currentTableName);
    }

    @And("Создан аудит лог о массовом редактировании записей")
    public void checkFeaturesUpdate() {
        checkAuditEvent(MULTIPLE_UPDATE.name(), FEATURE, currentTableName);
    }

    @And("Создан аудит лог о копировании записей")
    public void checkFeaturesCopied() {
        checkAuditEvent(COPYING.name(), FEATURE, anotherTableName);
    }

    @And("Создана запись в журнале аудита о создании схемы")
    public void checkAuditEventForSchemaCreate() {
        checkAuditEvent(CREATE.name(), SCHEMA, "schemas");
    }

    @And("Создан аудит лог об изменении схемы")
    public void checkAuditEventForSchemaUpdate() {
        checkAuditEvent(UPDATE.name(), SCHEMA, "schemas");
    }

    @Then("Создана запись в журнале аудита о создании датасета")
    public void checkDatasetCreate() {
        checkAuditEvent(CREATE.name(), DATASET, currentDatasetIdentifier);
    }

    @Then("Создана запись в журнале аудита об удалении набора данных")
    public void checkDatasetDelete() {
        checkAuditEvent(DELETE.name(), DATASET, currentDatasetIdentifier);
    }

    @Then("Создана запись в журнале аудита о создании правила")
    public void checkPermissionCreate() {
        checkAuditEvent(CREATE.name(), PERMISSION, "acl_permissions");
    }

    @Then("Создана запись в журнале аудита об удалении правила")
    public void checkPermissionDelete() {
        checkAuditEvent(DELETE.name(), PERMISSION, "acl_permissions");
    }

    @And("Создан аудит лог об изменении слоя, с корректным телом")
    public void checkLayerUpdate() throws InterruptedException {
        sleep(800);

        String tableName = layerCreateDto.getTableName();

        checkAuditEvent(UPDATE.name(), LAYER, tableName);
    }

    @Then("Создана запись в журнале аудита о создании таблицы")
    public void checkTableCreate() {
        checkAuditEvent(CREATE.name(), TABLE, currentTableName);
    }

    @Then("Создана запись в журнале аудита о приглашении пользователя в другую организацию")
    public void checkUserWasInvite() {
        checkAuditEvent(INVITE.name(), USER, userDto.getEmail());
    }

    @Then("Создана запись в журнале аудита об обновлении таблицы")
    public void checkTableUpdate() {
        checkAuditEvent(UPDATE.name(), TABLE, currentTableName);
    }

    @Then("Создана запись в журнале аудита об удалении таблицы")
    public void checkTableDelete() {
        checkAuditEvent(DELETE.name(), TABLE, currentTableName);
    }

    private boolean checkAuditEvent(String actionType, AuditEventEntityType entityType, String tableName) {
        try {
            int currentAttempt = 0;
            do {
                currentAttempt++;
                System.out.println("Attempt: " + currentAttempt + ". Check audit event. " + "actionType: '" +
                                           actionType + "' " + "entityType: '" +
                                           entityType.name() + "' tableName: '" +
                                           tableName + "'");

                getEventsByFilter(actionType, entityType.name(), tableName);

                List<AuditEventDto> lists = response.jsonPath().getList("_embedded.events", AuditEventDto.class);

                boolean result = false;
                for (AuditEventDto list: lists) {
                    if (actionType.equalsIgnoreCase(list.getActionType())
                            && entityType.name().equalsIgnoreCase(list.getEntityType())
                            && tableName.equalsIgnoreCase(list.getEntityName())) {
                        result = true;
                        break;
                    }
                }

                if (result) {
                    return true;
                }

                sleep(1000);
            } while (currentAttempt < MAX_RETRY_ATTEMPT);

            throw new RuntimeException("Audit event not created!");
        } catch (InterruptedException e) {
            throw new RuntimeException("Audit event not created!");
        }
    }

    private void getEventsByFilter(String actionType, String entityType, String tableName) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/?actionType=" + actionType + "&entityType=" + entityType + "&entityName=" + tableName);
    }
}
