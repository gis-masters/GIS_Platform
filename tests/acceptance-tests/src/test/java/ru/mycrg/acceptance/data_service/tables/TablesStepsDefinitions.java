package ru.mycrg.acceptance.data_service.tables;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.data_service.dto.TableCreateDto;
import ru.mycrg.acceptance.data_service.dto.TableUpdateDto;

import static org.junit.Assert.assertTrue;
import static ru.mycrg.acceptance.data_service.DatasetsStepsDefinitions.currentDatasetName;

public class TablesStepsDefinitions extends BaseStepsDefinitions {

    public static Integer currentFeatureId;
    public static String currentTableName;
    public static TableCreateDto currentTableDto;

    private String TEST_TABLE_SCHEMA = "schema_for_test_table";

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie()
                    .basePath("/api/data/datasets/" + currentDatasetName + "/tables");
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

    @When("Существует таблица")
    public void initTable() {
        String schemaId = "transportobj";
        createTablesRequest((schemaId + "_" + generateString("STRING_5")),
                            "Искусственные дорожные сооружения",
                            "some description",
                            "EPSG:28406",
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

        datasetsPool.remove(currentDatasetName);
    }

    @Given("В текущем наборе данных существует таблица, созданная по тестовой схеме")
    public void createAnyTableInCurrentDatasetAndByTestSchema() {
        currentTableName = generateString("STRING_5");
        currentTableDto = new TableCreateDto(currentTableName,
                                             generateString("Some table title"),
                                             generateString(""),
                                             generateString("EPSG:28406"),
                                             generateString(TEST_TABLE_SCHEMA));

        super.createEntity(currentTableDto);
    }

    @And("Данные о таблице успешно обновлены")
    public void checkTableInfo() {
        getCurrentTable();

        String newTitle = response.jsonPath().get("title");

        assertTrue("update title".equals(newTitle));
    }

    @When("Пользователь делает запрос на обновление информации о текущей таблице")
    public void updateCurrentTable() {
        updateTableInfo(currentTableName, new TableUpdateDto("update title"));
    }

    private void updateTableInfo(String tableName, TableUpdateDto dto) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(ContentType.JSON).
                        body(gson.toJson(dto))
                .when().
                        log().all().
                        put(String.format("/%s", tableName));
    }

    private void getCurrentTable() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + currentTableName);
    }
}
