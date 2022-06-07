package ru.mycrg.acceptance.data_service;

import io.cucumber.java.en.And;
import io.cucumber.java.en.When;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.data_service.dto.ImportRecordReport;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertTrue;

public class ImportExcelFileStepsDefinitions extends BaseStepsDefinitions {

    @When("Пользователь делает запрос на импорт excel файла {string} {string} {string}")
    public void importToDocLibrary(String libraryId, String fileName, String importType) {
        File excelFile = new File("src/test/resources/ru/mycrg/acceptance/resources/" + fileName);

        Map<String, Object> queryParams = new HashMap<>() {{
            put("libraryId", libraryId);
            put("importType", importType);
        }};

        response = getBaseRequestWithCurrentCookie()
                .given().
                        queryParams(queryParams).
                        multiPart("file", excelFile).
                        contentType("multipart/form-data")
                .when().
                        log().all().
                        post("/api/data/import/excel");
    }

    @And("Тело ответа содержит отчет об успешном импорте всех записей")
    public void checkImportReportIsSuccessful() {
        List<ImportRecordReport> importReportList = response.jsonPath().getList("", ImportRecordReport.class);
        importReportList.forEach(importRecordReport -> assertTrue(importRecordReport.isSuccess()));
    }
}
