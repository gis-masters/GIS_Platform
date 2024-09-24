package ru.mycrg.acceptance.data_service.schemas;

import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.auth_service.AuthorizationBase;
import ru.mycrg.acceptance.data_service.dto.schemas.SchemaDto;

import java.util.List;
import java.util.Objects;

import static org.junit.Assert.*;
import static ru.mycrg.acceptance.data_service.schemas.SchemaHolder.getSchemaByKey;

public class SchemasStepsDefinitions extends BaseStepsDefinitions {

    private final AuthorizationBase authorizationBase = new AuthorizationBase();

    public static String currentSchemaName;

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        String basePath = "/api/data/schemas";

        return super.getBaseRequestWithCurrentCookie()
                    .basePath(basePath);
    }

    @When("Владелец организации делает запрос на все схемы")
    public void fetchAllKnownSchemas() {
        authorizationBase.loginAsOwner();

        getAllSchemas();
    }

    @Then("Количество схем соответствует ожидаемому: {int}")
    public void getSchemasCount(int schemasQuantity) {
        int schemasCount = getEntitiesCount();
        assertEquals(schemasQuantity, schemasCount);
    }

    @Then("В выборке схем отсутствуют схемы с тэгом {string}")
    public void checkThatNoSchemasWithTag(String tag) {
        List<List<String>> tagsFromSchemas = response.jsonPath().getList("tags");

        long quantityHasTag = tagsFromSchemas.stream()
                                             .filter(Objects::nonNull)
                                             .filter(tags -> tags.contains(tag))
                                             .count();

        assertEquals(0, quantityHasTag);
    }

    @Then("В выборке схем присутствуют схемы с тэгом {string}")
    public void checkThatSchemasWithTag(String tag) {
        List<List<String>> tagsFromSchemas = response.jsonPath().getList("tags");

        assertNotNull(tagsFromSchemas);
        assertFalse(tagsFromSchemas.isEmpty());

        long quantityHasTag = tagsFromSchemas.stream()
                                             .filter(Objects::nonNull)
                                             .filter(tags -> tags.contains(tag))
                                             .count();

        assertTrue(quantityHasTag > 0);
    }

    @When("Существует некая схема")
    public void createSomeSchema() {
        createSchemaWithRandomName();
    }

    @When("Существует схема для библиотеки документов")
    public void createSomeSchemaForDocumentLibrary() {
        createSchemaWithRandomName();
    }

    @When("Пользователь отправляет POST запрос на создание новой схемы")
    public void createNewSchemaPost() {
        createSchemaWithRandomName();
    }

    @When("Пользователь создает новую схему")
    public void createNewSchema() {
        createSchemaWithRandomName();
    }

    @When("Существует схема {string}")
    public void createSchemaByKey(String schemaKey) {
        SchemaDto schema = getSchemaByKey(schemaKey);

        createOrUpdateSchema(schema);
    }

    @When("Пользователь делает PUT запрос на обновление существующей схемы")
    public void updateCurrentSchemaRequest() {
        SchemaDto schema = getSchemaByKey(currentSchemaName);
        schema.setReadOnly(false);

        updateSchema(schema);
    }

    @When("Схема создана и доступна для выборки")
    public void checkCreatedSchema() {
        getCurrentSchema();

        boolean isPresent = response.jsonPath()
                                    .getList("", SchemaDto.class)
                                    .stream()
                                    .anyMatch(schemaDto -> schemaDto.getName().equals(currentSchemaName));

        assertTrue(isPresent);
    }

    @When("Схема обновлена успешно")
    public void checkUpdatedSchema() {
        getCurrentSchema();

        boolean isSchemaReadonly = response.jsonPath()
                                           .getList("", SchemaDto.class)
                                           .stream()
                                           .filter(schemaDto -> schemaDto.getName().equals(currentSchemaName))
                                           .anyMatch(SchemaDto::isReadOnly);

        assertFalse(isSchemaReadonly);
    }

    @Then("Сервер возвращает схему {string}")
    public void checkSchemaByTitle(String title) {
        assertTrue(
                response.jsonPath()
                        .getList("title", String.class)
                        .contains(title));
    }

    private void createSchemaWithRandomName() {
        currentSchemaName = generateString("STRING_8");

        SchemaDto schema = getSchemaByKey(currentSchemaName);

        createOrUpdateSchema(schema);
    }

    private void createOrUpdateSchema(SchemaDto dto) {
        currentSchemaName = dto.getName();
        scenarioSchemas.put(dto.getTitle(), dto);

        super.createEntity(dto);

        if (response.statusCode() == 409) {
            System.out.println("Схема уже существует, обновим");

            updateSchema(dto);
        } else if (response.statusCode() != 201) {
            throw new IllegalStateException("Не удалось создать схему: " + dto.getName());
        }
    }

    private void getAllSchemas() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("?schemaIds=");
    }

    private void getCurrentSchema() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("?schemaIds=" + currentSchemaName);
    }

    private void updateSchema(SchemaDto dto) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(dto)).
                        contentType(ContentType.JSON)
                .when().
                        put()
                .then().
                        log().ifError().
                        extract().response();
    }
}
