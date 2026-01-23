package ru.mycrg.acceptance.data_service.schemas;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.path.json.JsonPath;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.auth_service.AuthorizationBase;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.ValueType;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import static org.apache.http.HttpStatus.SC_OK;
import static org.junit.Assert.*;
import static ru.mycrg.acceptance.data_service.schemas.SchemaTemplates.getSchemaTemplateByTitle;

public class SchemasStepsDefinitions extends BaseStepsDefinitions {

    private final AuthorizationBase authorizationBase = new AuthorizationBase();

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        String basePath = "/api/data/schemas";

        return super.getBaseRequestWithCurrentCookie()
                    .basePath(basePath);
    }

    @When("Согласно специализации 1 создана схема задач")
    public void checkSchemasBySpecialization1() {
        getCurrentSchema("tasks_schema_v1");

        assertEquals(SC_OK, response.getStatusCode());

        // Проверяем содержимое ответа
        JsonPath jsonPath = response.jsonPath();
        List<Map<String, Object>> schemas = jsonPath.getList("$");

        // Проверяем что получили ровно одну схему
        assertEquals(1, schemas.size());

        Map<String, Object> schema = schemas.get(0);
        // Проверяем title схемы
        assertEquals("Схема задач специализации 1", schema.get("title"));
    }

    @When("Владелец организации делает запрос на все схемы")
    public void fetchAllKnownSchemas() {
        authorizationBase.loginAsOwner();

        getAllSchemas();
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

    @Given("Существует схема для задач")
    public void createTaskSchema() {
        SchemaDto schema = getSchemaTemplateByTitle("tasks_schema_v1");

        createOrUpdateSchema(schema);
    }

    @When("Пользователь отправляет POST запрос на создание новой схемы")
    public void createNewSchemaPost() {
        createSchemaWithRandomName();
    }

    @When("Пользователь создает новую схему")
    public void createNewSchema() {
        createSchemaWithRandomName();
    }

    @When("Пользователь создает новую схему с именем {string}")
    public void createNewSchema(String schemaName) {
        SchemaDto schema = getSchemaTemplateByTitle(schemaName);

        super.createEntity(schema);
    }

    @When("Существует схема {string}")
    public void createSchemaByKey(String schemaTitle) {
        SchemaDto schema = getSchemaTemplateByTitle(schemaTitle);

        createOrUpdateSchema(schema);
    }

    @When("Пользователь делает PUT запрос на обновление существующей схемы")
    public void updateCurrentSchemaRequest() {
        SchemaDto schema = CurrentScenarioSchema.getCurrentSchema();
        schema.setReadOnly(false);

        updateSchema(schema);
    }

    @When("Схема создана и доступна для выборки")
    public void checkCreatedSchema() {
        String currentSchemaName = CurrentScenarioSchema.getCurrentSchema().getName();
        getCurrentSchema(currentSchemaName);

        boolean isPresent = response.jsonPath()
                                    .getList("", SchemaDto.class)
                                    .stream()
                                    .anyMatch(schemaDto -> schemaDto.getName().equals(currentSchemaName));

        assertTrue(isPresent);
    }

    @When("Схема обновлена успешно")
    public void checkUpdatedSchema() {
        String currentSchemaName = CurrentScenarioSchema.getCurrentSchema().getName();
        getCurrentSchema(currentSchemaName);

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

    @And("поле {string} в схеме имеет значение {string}")
    public void checkValueByPropName(String propName, String expectedValue) {
        String actualValue = response.jsonPath().getString("schema." + propName);
        assertEquals(expectedValue, actualValue);
    }

    @Then("схема собранная из полей gpkg соответствует ожидаемой")
    public void validateSchema() {
        SchemaDto actualSchema = response.jsonPath().getObject("", SchemaDto.class);
        SchemaDto expectedSchema = getSchemaTemplateByTitle("expectedGpkgGenerated");

        assertEquals("Тип геометрии не совал.", expectedSchema.getGeometryType(), actualSchema.getGeometryType());
        assertEquals("Описание не совпало.", expectedSchema.getDescription(), actualSchema.getDescription());
        assertEquals("Имя стиля не совпало.", expectedSchema.getStyleName(), actualSchema.getStyleName());
        assertFalse("Схема не должна быть readOnly.", actualSchema.isReadOnly());
        assertEquals("В схеме не должно быть тегов.", 0, actualSchema.getTags().size());

        assertEquals("Количество пропертей должно совпадать.", expectedSchema.getProperties().size(),
                     actualSchema.getProperties().size());

        Map<String, ValueType> actualMap = new HashMap<>();
        actualSchema.getProperties().forEach(prop -> actualMap.put(prop.getName(), prop.getValueTypeAsEnum()));

        expectedSchema.getProperties()
                      .forEach(prop ->
                                       assertEquals("Проперти '" + prop.getName() + "' должны совпадать по типам.",
                                                    prop.getValueTypeAsEnum(),
                                                    actualMap.get(prop.getName())));
    }

    @Then("в схеме существует свойство, title которого равен {string}")
    public void validateSchemaWithRussianTitle(String title) {
        SchemaDto actualSchema = response.jsonPath().getObject("", SchemaDto.class);
        List<SimplePropertyDto> actualProps = actualSchema.getProperties();

        SimplePropertyDto expectedProp =
                actualProps.stream().filter((prop) -> prop.getName().equals(title)).findFirst().orElse(null);

        assertNotNull(expectedProp);
    }

    public void getCurrentSchema(String schemaName) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("?schemaIds=" + schemaName);
    }

    private void createSchemaWithRandomName() {
        SchemaDto schema = getSchemaTemplateByTitle(generateString("STRING_8"));

        createOrUpdateSchema(schema);
    }

    private void createOrUpdateSchema(SchemaDto schema) {
        CurrentScenarioSchema.add(schema);

        super.createEntity(schema);

        if (response.statusCode() == 409) {
            System.out.println("Схема уже существует, обновим");

            updateSchema(schema);
        } else if (response.statusCode() != 201) {
            throw new IllegalStateException("Не удалось создать схему: " + schema.getName());
        }
    }

    private void getAllSchemas() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("?schemaIds=");
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
