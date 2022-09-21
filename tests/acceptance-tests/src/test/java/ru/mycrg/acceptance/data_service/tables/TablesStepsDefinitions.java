package ru.mycrg.acceptance.data_service.tables;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.auth_service.AuthorizationBase;
import ru.mycrg.acceptance.data_service.dto.PermissionCreateDto;
import ru.mycrg.acceptance.data_service.dto.TableCreateDto;
import ru.mycrg.acceptance.data_service.dto.TableUpdateDto;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static ru.mycrg.acceptance.auth_service.UserStepsDefinitions.userId;
import static ru.mycrg.acceptance.data_service.ImportStepsDefinitions.schemaId;
import static ru.mycrg.acceptance.data_service.ImportStepsDefinitions.tableName;
import static ru.mycrg.acceptance.data_service.datasets.DatasetsStepsDefinitions.currentDatasetIdentifier;

public class TablesStepsDefinitions extends BaseStepsDefinitions {

    public static String currentTableName;
    public static String anotherTableName;
    public static TableCreateDto currentTableDto;
    public static TableCreateDto anotherTableDto;

    private String TEST_TABLE_SCHEMA = "schema_for_test_table";

    private final AuthorizationBase authorizationBase = new AuthorizationBase();

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie()
                    .basePath("/api/data/datasets/" + currentDatasetIdentifier + "/tables");
    }

    @When("Отправляется запрос на создание таблицы {string} {string} {string} {string} {string}")
    public void createTablesRequest(String nameKey, String titleKey, String descriptionKey, String crs, String schema) {
        currentTableName = generateString(nameKey);
        currentTableDto = new TableCreateDto(currentTableName,
                                             generateString(titleKey),
                                             generateString(descriptionKey),
                                             generateString(crs),
                                             generateString(schema));

        super.createEntity(currentTableDto);
    }

    @When("Пользователь делает запрос на выборку таблиц из 'набора данных'")
    public void getAllTables() {
        authorizationBase.loginAsCurrentUser();

        response = getBaseRequestWithCurrentCookie()
                .when().
                        get();
    }

    @When("Существует таблица")
    public void initTable() {
        String schemaId = "transportobj";
        createTablesRequest((schemaId + "_" + generateString("STRING_5")),
                            "Искусственные дорожные сооружения",
                            "some description",
                            "EPSG:28406",
                            schemaId);
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

        createTablesRequest((anotherTableName),
                            "Искусственные дорожные сооружения",
                            "some description",
                            "EPSG:28406",
                            schemaId);
    }

    @When("Существует таблица, имеющая код EPSG {string}")
    public void initTableWithEpsg(String codeEpsg) {
        String schemaId = "advertising_point_simf_2022";
        anotherTableName = schemaId + "_" + generateString("STRING_5");

        createTablesRequest((anotherTableName),
                            "Искусственные дорожные сооружения",
                            "some description",
                            codeEpsg,
                            schemaId);
    }

    @When("Пользователь создает запрос на создание новой таблицы")
    public void createNewTable() {
        initTable();
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

    @When("Пользователь делает запрос на обновление информации о текущей таблице")
    public void updateCurrentTable() {
        updateTableInfo(currentTableName, new TableUpdateDto("update title"));
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

    private void updateTableInfo(String tableName, TableUpdateDto dto) {
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
}
