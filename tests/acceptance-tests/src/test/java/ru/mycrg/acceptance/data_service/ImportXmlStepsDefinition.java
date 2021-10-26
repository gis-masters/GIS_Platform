package ru.mycrg.acceptance.data_service;

import io.cucumber.java.en.When;
import ru.mycrg.acceptance.BaseStepsDefinitions;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

import static ru.mycrg.acceptance.data_service.DatasetsStepsDefinitions.currentDatasetName;
import static ru.mycrg.acceptance.data_service.TablesStepsDefinitions.currentTableName;

public class ImportXmlStepsDefinition extends BaseStepsDefinitions {

    @When("Пользователь делает запрос на импорт xml файла {string} {string}")
    public void importToProject(String importType, String fileName) {
        File xmlFile = new File("src/test/resources/ru/mycrg/acceptance/data_service/files/" + fileName);

        Map<String, Object> queryParams = new HashMap<>() {{
            put("datasetId", currentDatasetName);
            put("tableId", currentTableName);
            put("importType", importType);
        }};

        response = getBaseRequestWithCurrentCookie()
                .given().
                        queryParams(queryParams).
                        multiPart(xmlFile).
                        contentType("multipart/form-data")
                .when().
                        log().all().
                        post("/api/data/import/file");
    }
}
