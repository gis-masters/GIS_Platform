package ru.mycrg.acceptance.data_service.schemas;

import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.data_service.dto.schemas.SchemaDto;
import ru.mycrg.acceptance.data_service.dto.schemas.SimplePropertyDto;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class SchemasStepsDefinitions extends BaseStepsDefinitions {

    public static String currentSchemaName;

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        String basePath = "/api/data/schemas";

        return super.getBaseRequestWithCurrentCookie()
                    .basePath(basePath);
    }

    @When("Существует некая схема")
    public void createSomeSchema() {
        createSchema();
    }

    @When("Пользователь отправляет POST запрос на создание новой схемы")
    public void createNewSchemaPost() {
        createSchema();
    }

    @When("Пользователь создает новую схему")
    public void createNewSchema() {
        createSchema();
    }

    @When("Пользователь делает PUT запрос на обновление существующей схемы")
    public void updateCurrentSchemaRequest() {
        SchemaDto dto = prepareSomeSchema(currentSchemaName);
        dto.setReadOnly(false);

        updateCurrentSchema(dto);
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

    private void getCurrentSchema() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("?schemaIds=" + currentSchemaName);
    }

    private void createSchema() {
        currentSchemaName = generateString("STRING_8");

        SchemaDto dto = prepareSomeSchema(currentSchemaName);

        super.createEntity(dto);
    }

    public void updateCurrentSchema(SchemaDto dto) {
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

    private SchemaDto prepareSomeSchema(String name) {
        List<SimplePropertyDto> properties = new ArrayList<>();
        SimplePropertyDto firstProperty = new SimplePropertyDto();
        firstProperty.setName("firstProperty");
        firstProperty.setTitle("firstPropertyTitle");
        firstProperty.setValueType("STRING");

        properties.add(firstProperty);

        SchemaDto dto = new SchemaDto();
        dto.setName(name);
        dto.setTitle("someTitle");
        dto.setTableName("someTableName");
        dto.setProperties(properties);
        dto.setReadOnly(true);

        return dto;
    }
}
