package ru.mycrg.acceptance.data_service;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.When;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;

import java.io.File;

public class XmlParsingStepDefinitions extends BaseStepsDefinitions {

    public static String fileName;
    public static String datasetId;
    public static String tableId;
    public static File file;

    @Override
    public RequestSpecification getBaseRequest() {
        return super.getBaseRequest().basePath("/api/data");
    }

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie().basePath("/api/data");
    }

    @When("Пользователь делает запрос на импорт файла")
    public void importXml(DataTable dataTable) {
        fileName = dataTable.cell(0, 0);
        datasetId = dataTable.cell(0, 1);
        tableId = dataTable.cell(0, 2);

        file = new File(String.format("src/test/resources/ru/mycrg/acceptance/resources/%s", fileName));

        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType("multipart/form-data").
                        multiPart("file", file).
                        multiPart("datasetId", datasetId).
                        multiPart("tableId", tableId)
                .when().
                        log().ifValidationFails().
                        post("/import/file");
    }
}
