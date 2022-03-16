package ru.mycrg.acceptance.data_service.tables;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.data_service.dto.TableCreateDto;

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
}
