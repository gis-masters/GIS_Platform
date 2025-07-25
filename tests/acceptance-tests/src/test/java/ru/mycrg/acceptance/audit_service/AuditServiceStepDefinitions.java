package ru.mycrg.acceptance.audit_service;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.audit_service.dto.AuditEventDto;
import ru.mycrg.acceptance.audit_service.dto.AuditEventEntityType;
import ru.mycrg.acceptance.auth_service.AuthorizationBase;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static java.lang.String.format;
import static java.lang.Thread.sleep;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.http.HttpStatus.SC_OK;
import static org.junit.Assert.assertTrue;
import static ru.mycrg.acceptance.JsonMapper.asJsonNode;
import static ru.mycrg.acceptance.audit_service.dto.AuditEventActionsType.*;
import static ru.mycrg.acceptance.audit_service.dto.AuditEventEntityType.*;
import static ru.mycrg.acceptance.auth_service.OrganizationStepsDefinitions.MAX_RETRY_ATTEMPT;
import static ru.mycrg.acceptance.auth_service.UserStepsDefinitions.userDto;
import static ru.mycrg.acceptance.data_service.datasets.DatasetsStepsDefinitions.currentDatasetIdentifier;
import static ru.mycrg.acceptance.data_service.libraries.LibraryStepsDefinitions.currentLibrary;
import static ru.mycrg.acceptance.data_service.tables.TablesStepsDefinitions.anotherTableName;
import static ru.mycrg.acceptance.data_service.tables.TablesStepsDefinitions.currentTableName;
import static ru.mycrg.acceptance.gis_service.LayerStepDefinitions.layerCreateDto;
import static ru.mycrg.acceptance.gis_service.ProjectStepsDefinitions.projectDto;

public class AuditServiceStepDefinitions extends BaseStepsDefinitions {

    private final String CURRENT_TIME = "CURRENT_TIME";

    private final AuthorizationBase authorizationBase = new AuthorizationBase();

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
        super.get1000Entities();
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
                                              asJsonNode(generateJsonString(stateAfter)));
        }

        super.createEntity(auditEventDto);
    }

    @And("Отображаются события всех организаций")
    public void displayedAllOrganizationsEvents() {
        List<String> entitiesIds = response.jsonPath().getList("content.organizationId");
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
                        getList("content");

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
        super.getAllAndFillEntityCount();
    }

    @And("Количество страниц событий аудита пропорционально {string}")
    public void checkAuditEventsPagesCount(String sortingDirection) {
        checkPagesCount(sortingDirection);
    }

    @And("На всех страницах событий аудита есть {string}")
    public void areAuditEventsOnPages(String entitiesPerPage) {
        checkSomethingOnPages(entitiesPerPage);
    }

    @Given("Существует заданное кол-во событий аудита: {int}")
    public void initializeAuditEvents(int count) {
        for (int i = 0; i < count; i++) {
            addEvent(CURRENT_TIME, "SIGN_IN", "", "", "", "");
        }
    }

    @Then("Создан аудит лог о входе пользователя в систему")
    public void checkAuditEventSignIn() {
        waitAuditEvent(SIGN_IN.name(), USER, "user");
    }

    @Then("Создан аудит лог о неудачной попытке входа пользователя в систему")
    public void checkAuditEventSignFail() throws InterruptedException {
        authorizationBase.loginAsSystemAdmin();

        waitAuditEvent(SIGN_FAIL.name(), USER, "user");
    }

    @Then("Создан аудит лог о выходе пользователя из системы")
    public void checkAuditEventSignOut() {
        waitAuditEvent(SIGN_OUT.name(), USER, "user");
    }

    @Then("Создан аудит лог о создании проекта, с корректным телом")
    public void checkProjectCreate() {
        String projectName = projectDto.getName();

        waitAuditEvent(CREATE.name(), PROJECT, projectName);
    }

    @Then("Создана запись в журнале аудита о создании документа")
    public void checkDocumentCreate() {
        waitAuditEvent(CREATE.name(), LIBRARY_RECORD, currentLibrary.getTableName());
    }

    @Then("Создана запись в журнале аудита о создании записи в слое")
    public void checkFeatureCreate() {
        waitAuditEvent(CREATE.name(), FEATURE, currentTableName);
    }

    @Then("Создан аудит лог о создании слоя, с корректным телом")
    public void checkLayerCreate() {
        String tableName = layerCreateDto.getTableName();

        waitAuditEvent(CREATE.name(), LAYER, tableName);
    }

    @Then("Создан аудит лог об удалении проекта")
    public void checkProjectDelete() {
        String projectName = projectDto.getName();

        waitAuditEvent(DELETE.name(), PROJECT, projectName);
    }

    @Then("Создан аудит лог об удалении слоя, с корректным телом")
    public void checkLayerDelete() {
        String tableName = layerCreateDto.getTableName();

        waitAuditEvent(DELETE.name(), LAYER, tableName);
    }

    @And("Создан аудит лог об изменении проекта")
    public void checkProjectUpdate() {
        String projectName = projectDto.getName();

        waitAuditEvent(UPDATE.name(), PROJECT, projectName);
    }

    @And("Создан аудит лог об изменении записи в слое")
    public void checkFeatureUpdate() {
        waitAuditEvent(UPDATE.name(), FEATURE, currentTableName);
    }

    @And("Создан аудит лог о массовом удалении записей")
    public void checkFeaturesDelete() {
        waitAuditEvent(MULTIPLE_DELETION.name(), FEATURE, currentTableName);
    }

    @And("Создан аудит лог о массовом редактировании записей")
    public void checkFeaturesUpdate() {
        waitAuditEvent(MULTIPLE_UPDATE.name(), FEATURE, currentTableName);
    }

    @And("Создан аудит лог о массовом копировании записей")
    public void checkFeaturesCopied() {
        waitAuditEvent(COPYING.name(), FEATURE, anotherTableName);
    }

    @And("Создана запись в журнале аудита о создании схемы")
    public void checkAuditEventForSchemaCreate() {
        waitAuditEvent(CREATE.name(), SCHEMA, "schemas");
    }

    @And("Создан аудит лог об изменении схемы")
    public void checkAuditEventForSchemaUpdate() {
        waitAuditEvent(UPDATE.name(), SCHEMA, "schemas");
    }

    @Then("Создана запись в журнале аудита о создании датасета")
    public void checkDatasetCreate() {
        waitAuditEvent(CREATE.name(), DATASET, currentDatasetIdentifier);
    }

    @Then("Создана запись в журнале аудита об удалении набора данных")
    public void checkDatasetDelete() {
        waitAuditEvent(DELETE.name(), DATASET, currentDatasetIdentifier);
    }

    @Then("Создана запись в журнале аудита о создании библиотеки документов")
    public void checkDocumentLibraryCreate() {
        waitAuditEvent(CREATE.name(), LIBRARY, currentLibrary.getTableName());
    }

    @Then("Создана запись в журнале аудита об удалении библиотеки документов")
    public void checkDocumentLibraryDelete() {
        waitAuditEvent(DELETE.name(), LIBRARY, format("data.%s", currentLibrary.getTableName()));
    }

    @Then("Создана запись в журнале аудита о создании правила")
    public void checkPermissionCreate() {
        waitAuditEvent(CREATE.name(), PERMISSION, "acl_permissions");
    }

    @Then("Создана запись в журнале аудита об удалении правила")
    public void checkPermissionDelete() {
        waitAuditEvent(DELETE.name(), PERMISSION, "acl_permissions");
    }

    @And("Создан аудит лог об изменении слоя, с корректным телом")
    public void checkLayerUpdate() throws InterruptedException {
        sleep(800);

        String tableName = layerCreateDto.getTableName();

        waitAuditEvent(UPDATE.name(), LAYER, tableName);
    }

    @Then("Создана запись в журнале аудита о создании таблицы")
    public void checkTableCreate() {
        waitAuditEvent(CREATE.name(), TABLE, currentTableName);
    }

    @Then("Создана запись в журнале аудита о приглашении пользователя в другую организацию")
    public void checkUserWasInvite() {
        waitAuditEvent(INVITE.name(), USER, userDto.getEmail());
    }

    @Then("Создана запись в журнале аудита об обновлении таблицы")
    public void checkTableUpdate() {
        waitAuditEvent(UPDATE.name(), TABLE, currentTableName);
    }

    @Then("Создана запись в журнале аудита об удалении таблицы")
    public void checkTableDelete() {
        waitAuditEvent(DELETE.name(), TABLE, currentTableName);
    }

    @Then("В выборке присутствует запись об авторизации пользователя")
    public void checkUserSignInEventExist() {
        waitAuditEvent(SIGN_IN.name(), USER, "user");
    }

    private boolean waitAuditEvent(String actionType, AuditEventEntityType entityType, String entityName) {
        try {
            int currentAttempt = 0;
            do {
                currentAttempt++;
                System.out.println("Attempt: " + currentAttempt + ". Check audit event. " +
                                           "actionType: '" + actionType + "' " +
                                           "entityType: '" + entityType.name() + "' " +
                                           "entityName: '" + entityName + "'");

                getEventsByFilter(actionType, entityType.name(), entityName);

                List<AuditEventDto> lists = response.jsonPath().getList("content", AuditEventDto.class);

                boolean result = false;
                for (AuditEventDto list: lists) {
                    if (actionType.equalsIgnoreCase(list.getActionType())
                            && entityType.name().equalsIgnoreCase(list.getEntityType())
                            && entityName.equalsIgnoreCase(list.getEntityName())) {
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
        String url = String.format("?actionType=%s&entityType=%s&entityName=%s&size=10000",
                                   actionType, entityType, tableName);

        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(url);
    }
}
