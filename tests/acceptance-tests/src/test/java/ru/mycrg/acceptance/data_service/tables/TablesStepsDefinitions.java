package ru.mycrg.acceptance.data_service.tables;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.auth_service.AuthorizationBase;
import ru.mycrg.acceptance.data_service.dto.ErrorInfo;
import ru.mycrg.acceptance.data_service.dto.PermissionCreateDto;
import ru.mycrg.acceptance.data_service.dto.TableCreateDto;
import ru.mycrg.acceptance.data_service.dto.TableUpdateDto;
import ru.mycrg.acceptance.data_service.dto.schemas.SchemaDto;
import ru.mycrg.acceptance.data_service.schemas.CurrentScenarioSchema;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.hamcrest.core.IsEqual.equalTo;
import static org.hamcrest.core.IsNull.notNullValue;
import static org.junit.Assert.*;
import static ru.mycrg.acceptance.auth_service.UserStepsDefinitions.userId;
import static ru.mycrg.acceptance.data_service.ImportStepsDefinitions.schemaId;
import static ru.mycrg.acceptance.data_service.ImportStepsDefinitions.tableName;
import static ru.mycrg.acceptance.data_service.datasets.DatasetsStepsDefinitions.currentDatasetIdentifier;

public class TablesStepsDefinitions extends BaseStepsDefinitions {

    public static String currentTableName;
    public static String anotherTableName;
    public static TableCreateDto currentTableDto;
    public static TableCreateDto anotherTableDto;

    private final String TEST_TABLE_SCHEMA = "schema_for_test_table";

    private final AuthorizationBase authorizationBase = new AuthorizationBase();

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie()
                    .basePath("/api/data/datasets/" + currentDatasetIdentifier + "/tables");
    }

    @When("Отправляется запрос на создание таблицы {string} {string} {string} {string} {string}")
    public void createTablesRequest(String nameKey,
                                    String titleKey,
                                    String descriptionKey,
                                    String crs,
                                    String schemaName) {
        schemaId = schemaName;
        currentTableName = generateString(nameKey);
        tableName = currentTableName;
        currentTableDto = new TableCreateDto(tableName,
                                             generateString(titleKey),
                                             generateString(descriptionKey),
                                             generateString(crs),
                                             schemaId);

        scenarioTables.add(currentTableDto);

        super.createEntity(currentTableDto);
    }

    public void createTablesRequest(String nameKey,
                                    String titleKey,
                                    String descriptionKey,
                                    String crs,
                                    String schemaName,
                                    boolean readyForFts) {
        schemaId = schemaName;
        currentTableName = generateString(nameKey);
        tableName = currentTableName;
        currentTableDto = new TableCreateDto(tableName,
                                             generateString(titleKey),
                                             generateString(descriptionKey),
                                             generateString(crs),
                                             schemaId,
                                             readyForFts);

        scenarioTables.add(currentTableDto);

        super.createEntity(currentTableDto);
    }

    public void createAnotherTablesRequest(String nameKey, String titleKey, String descriptionKey, String crs,
                                           String schema) {
        anotherTableName = generateString(nameKey);
        anotherTableDto = new TableCreateDto(anotherTableName,
                                             generateString(titleKey),
                                             generateString(descriptionKey),
                                             generateString(crs),
                                             generateString(schema));

        super.createEntity(anotherTableDto);
    }

    @When("я запрашиваю схемы созданных таблиц")
    public void getTableSchemas() {
        List<String> payload = scenarioTables.stream()
                                             .map(TableCreateDto::getName)
                                             .collect(Collectors.toList());

        response = getBaseRequestWithCurrentCookie().basePath("/api/data/tablesSchemas/")
                .given().
                        body(payload).
                        contentType(ContentType.JSON)
                .when().
                        post();

        response.then().body("size()", equalTo(2));
    }

    @Then("в ответе содержится {int} схемы")
    public void checkCountOfSchemas(int expectedCount) {
        response.then().body("size()", equalTo(expectedCount));
    }

    @When("Пользователь делает запрос на выборку таблиц из 'набора данных'")
    public void getAllTablesAsCurrentUser() {
        authorizationBase.loginAsCurrentUser();

        response = getBaseRequestWithCurrentCookie()
                .when().
                        get();
    }

    @When("Существует таблица")
    public void initTable() {
        String schemaId = "transportobj";
        createTablesRequest(schemaId + "_" + generateString("STRING_5"),
                            "Искусственные дорожные сооружения",
                            "some description",
                            "EPSG:28406",
                            schemaId);
    }

    @When("Существует таблица по схеме {string}")
    public void initTable(String schemaTitle) {
        SchemaDto schema = CurrentScenarioSchema.getSchemaByTitle(schemaTitle);

        createTablesRequest(generateString("STRING_8"),
                            "some title",
                            "some description",
                            "EPSG:28406",
                            schema.getName());
    }

    @When("Существует таблица созданная по текущей схеме и с включённым FTS")
    public void initTableByCurrentSchemaWithEnabledFts() {
        createTablesRequest(generateString("STRING_8"),
                            "some title",
                            "some description",
                            "EPSG:28406",
                            CurrentScenarioSchema.getCurrentSchema().getName(),
                            true);

        assertEquals(201, response.getStatusCode());
    }

    @When("Создана таблица по схеме, не имеющей автозаполняемые поля 'дату создания, модификации и создателя'")
    public void initTableBuSchemaWithoutAutoCompletedField() {
        initTable();
    }

    @When("Существует другая таблица")
    public void initAnotherTable() {
        anotherTableName = generateString("STRING_5");
        anotherTableDto = new TableCreateDto(anotherTableName,
                                             generateString("Another table title"),
                                             generateString(""),
                                             generateString("EPSG:28406"),
                                             generateString(TEST_TABLE_SCHEMA));

        super.createEntity(anotherTableDto);
    }

    @When("Существует таблица доступная только для чтения")
    public void initReadOnlyTable() {
        String schemaId = "advertising_point_simf_2022";
        anotherTableName = schemaId + "_" + generateString("STRING_5");

        createTablesRequest(anotherTableName,
                            "Искусственные дорожные сооружения",
                            "some description",
                            "EPSG:28406",
                            schemaId);
    }

    @When("Существует таблица, имеющая код EPSG {string}")
    public void initTableWithEpsg(String codeEpsg) {
        String schemaId = TEST_TABLE_SCHEMA;
        anotherTableName = schemaId + "_" + generateString("STRING_5");

        createTablesRequest(anotherTableName,
                            "Искусственные дорожные сооружения",
                            "some description",
                            codeEpsg,
                            schemaId);
    }

    @When("Пользователь делает запрос на поиск таблиц и наборов данных по SRID {string}")
    public void findTablesBySrid(String srid) {
        response = getBaseRequestWithCurrentCookie().basePath("/api/data/datasets")
                .given().
                        queryParam("srid", srid)
                .when().
                        get("/getTablesBySrid");
    }

    @When("Сервер возвращает имя схемы и слоя")
    public void validateGetSridResponse() {
        assertNotNull(response.jsonPath().getString("[0].datasetTitle"));
        assertEquals(currentDatasetIdentifier, response.jsonPath().getString("[0].datasetIdentifier"));

        assertNotNull(response.jsonPath().getString("[0].tableTitle"));
        assertEquals(currentTableName, response.jsonPath().getString("[0].tableName"));
    }

    @When("Существует другая таблица, имеющая код EPSG {string}")
    public void initAnotherTableWithEpsg(String codeEpsg) {
        anotherTableName = TEST_TABLE_SCHEMA + "_" + generateString("STRING_5");

        createAnotherTablesRequest(anotherTableName,
                                   "Искусственные дорожные сооружения",
                                   "some description",
                                   codeEpsg,
                                   TEST_TABLE_SCHEMA);
    }

    @When("Пользователь делает запрос на создание новой таблицы")
    public void createNewTableAsUser() {
        authorizationBase.loginAsCurrentUser();
        initTable();
    }

    @When("Администратор делает запрос на создание новой таблицы")
    public void createNewTableAsAdmin() {
        authorizationBase.loginAsOwner();
        initTable();
    }

    @When("Администратор делает запрос на создание новой таблицы по схеме {string}")
    public void createNewTableAsAdminBySchemaName(String schemaTitle) {
        authorizationBase.loginAsOwner();

        initTable(schemaTitle);
    }

    @When("Для таблицы включен полнотекстовый поиск")
    public void switchOnFtsForLatestTable() {
        TableCreateDto latestTable = getLatestTable();

        TableUpdateDto dto = new TableUpdateDto();
        dto.setReadyForFts(true);

        updateTable(latestTable.getName(), dto);

        if (response.statusCode() != 200) {
            throw new IllegalStateException("Не удалось включить FTS для таблицы: " + latestTable.getName());
        }
    }

    @When("Пользователь делает запрос на удаление текущей таблицы")
    public void deleteTable() {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        delete("/" + currentTableName);

        datasetsPool.remove(currentDatasetIdentifier);
    }

    @When("я пытаюсь применить к текущей таблице схему: {string}")
    public void tryUpdateTableSchema(String schemaTitle) {
        SchemaDto schema = CurrentScenarioSchema.getSchemaByTitle(schemaTitle);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(ContentType.JSON).
                        body(gson.toJson(schema))
                .when().
                        put(String.format("/%s/schema", tableName));
    }

    @Given("В текущем наборе данных существует таблица, созданная по тестовой схеме")
    public void createAnyTableInCurrentDatasetAndByTestSchema() {
        currentTableName = generateString("STRING_5");
        currentTableDto = new TableCreateDto(currentTableName,
                                             generateString("Some table title"),
                                             generateString(""),
                                             generateString("EPSG:28406"),
                                             generateString(TEST_TABLE_SCHEMA));
        tableName = currentTableName;
        schemaId = TEST_TABLE_SCHEMA;

        super.createEntity(currentTableDto);
    }

    @When("Пользователь делает запрос на получение текущей таблицы")
    public void getCurrentTableByCurrentUser() {
        getCurrentTable();
    }

    @Then("Созданная таблица содержит схему в поле: {string}")
    public void checkCurrentTableSchema(String fieldName) {
        response.then()
                .body(fieldName, notNullValue());
    }

    @And("Данные о таблице успешно обновлены")
    public void checkTableInfo() {
        getCurrentTable();

        String newTitle = response.jsonPath().get("title");

        assertTrue("update title".equals(newTitle));
    }

    @And("Тело ответа содержит ошибку о том что таблица доступна только для чтения")
    public void checkErrorMessageIsCorrect() {
        String message = response.jsonPath().get("message");

        assertEquals("Таблица, в которую производится копирование, доступна только для чтения.", message);
    }

    @And("Тело ответа содержит ошибку о том что таблица не может быть создана, т.к. отсутствует поле для геометрии")
    public void checkErrorMessageContainsErrorThatGeometryFieldIsMissing() {
        String message = response.jsonPath().get("message");

        assertEquals("Отсутствует описание геометрии. Невозможно создать таблицу по схеме: dl_default_schema", message);
    }

    @And("Тело ответа содержит ошибку о том что для калькуляции ruleid по wellKnown формуле отсутствует поле classid")
    public void checkErrorMessageContainsErrorThatShapeFieldIsMissingForWellKnownCalculation() {
        String message = response.jsonPath().get("message");
        assertTrue(message.contains("Argument validation exception"));

        List<Map<String, Object>> errors = response.jsonPath().getList("errors");

        assertFalse(errors.isEmpty());

        Map<String, Object> errorFirst = errors.get(0);

        assertEquals("Для калькуляции по wellKnown формуле отсутствуют следующие поля: classid.",
                     errorFirst.get("message"));
    }

    @And("Тело ответа содержит ошибку о том что для калькуляции ruleid по wellKnown формуле поле classid должно быть типа choice, string или int")
    public void checkErrorMessageContainsErrorThatFieldIsNotAllowedType() {
        String message = response.jsonPath().get("message");
        assertTrue(message.contains("Argument validation exception"));

        List<Map<String, Object>> errors = response.jsonPath().getList("errors");

        assertFalse(errors.isEmpty());

        Map<String, Object> errorFirst = errors.get(0);

        assertEquals(
                "Для калькуляции по wellKnown формуле поле classid должно быть типа: [CHOICE, STRING, INT, LONG]. ",
                errorFirst.get("message"));
    }

    @When("Пользователь делает запрос на обновление информации о текущей таблице")
    public void updateCurrentTable() {
        updateTable(currentTableName, new TableUpdateDto("update title"));
    }

    @When("Администратор даёт доступ: {string} для текущего пользователя на текущую таблицу")
    public void createPermissionForCurrentUserForCurrentTable(String role) {
        authorizationBase.loginAsOwner();

        createPermissionForTable(new PermissionCreateDto("user", userId, role), currentTableName);
    }

    @Given("Администратор даёт доступ: {string} для текущего пользователя на другую таблицу")
    public void createPermissionForCurrentUserForAnotherTable(String role) {
        authorizationBase.loginAsOwner();

        createPermissionForTable(new PermissionCreateDto("user", userId, role), anotherTableName);
    }

    private void updateTable(String tableName, TableUpdateDto dto) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(ContentType.JSON).
                        body(gson.toJson(dto))
                .when().
                        put(String.format("/%s", tableName));
    }

    private void getCurrentTable() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + currentTableName);
    }

    private void createPermissionForTable(PermissionCreateDto dto, String tableName) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(dto)).
                        contentType(ContentType.JSON)
                .when().
                        post("/" + tableName + "/roleAssignment");
    }

    @And("ошибки соответствуют ожидаемым")
    public void checkServerErrors(List<String> errorDescriptions) {
        List<ErrorInfo> expectedErrors = new ArrayList<>();

        // Обработка ожидаемых ошибок из таблицы
        for (String errorDescription: errorDescriptions) {
            String[] parts = errorDescription.split(" --- ");
            if (parts.length == 2) {
                expectedErrors.add(new ErrorInfo(parts[0].trim(), parts[1].trim()));
            }
        }

        // Извлечение ошибок из ответа
        List<ErrorInfo> actualErrors = response.jsonPath().getList("errors", ErrorInfo.class);

        // Сравнение размера ожидаемых и фактических ошибок
        assertEquals(actualErrors.size(), expectedErrors.size());

        // Сравнение ожидаемых и фактических ошибок
        assertTrue(actualErrors.containsAll(expectedErrors) && expectedErrors.containsAll(actualErrors));
    }
}
