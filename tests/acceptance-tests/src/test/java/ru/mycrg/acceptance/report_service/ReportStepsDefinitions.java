package ru.mycrg.acceptance.report_service;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.specification.RequestSpecification;
import org.jetbrains.annotations.NotNull;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.data_service.FilesStepDefinitions;
import ru.mycrg.acceptance.data_service.TestFilesManager;
import ru.mycrg.common_contracts.generated.report_service.ReportMainDto;

import java.io.File;
import java.nio.file.Files;
import java.util.Map;
import java.util.UUID;

import static io.restassured.http.ContentType.JSON;
import static org.apache.http.HttpStatus.SC_OK;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static ru.mycrg.acceptance.data_service.FilesStepDefinitions.currentFileId;
import static ru.mycrg.acceptance.report_service.ReportRequestBuilder.prepareReport;

public class ReportStepsDefinitions extends BaseStepsDefinitions {

    public static UUID currentReportFileId;

    private final FilesStepDefinitions filesStepDefinitions = new FilesStepDefinitions();

    @Override
    public RequestSpecification getBaseRequest() {
        return super.getBaseRequest().basePath("/reports");
    }

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie().basePath("/reports");
    }

    @When("я делаю запрос для создание отчёта c данными по-умолчанию")
    public void portReportWithDefaultData() {
        postReport();
    }

    @Then("возвращается идентификатор файла с платформы")
    public void checkResponseUuid() {
        String answer = response.getBody().asString();
        assertNotNull(UUID.fromString(answer.substring(1, answer.length() - 1)));
    }

    @Given("создан отчёт в формате {string}")
    public void createExpectedFormatReport(String reportFormat) {
        postReport(reportFormat);

        assertNotNull(currentReportFileId);
        currentFileId = currentReportFileId;
    }

    @Given("сформирован отчёт по шаблону с именем {string}")
    public void makeReportByName(String templateName) {
        postReport(templateName);

        assertNotNull(currentReportFileId);
        currentFileId = currentReportFileId;
    }

    @When("я скачиваю текущий отчёт")
    public void downloadCurrentReport() {
        assertNotNull("В контексте сценария должен быть ID отчёта!", currentReportFileId);

        filesStepDefinitions.downloadFile(currentReportFileId);
    }

    @Then("размер скачанного отчёта равен {int} байт")
    public void reportDownloadSuccessfully(int size) throws Exception {
        byte[] fileData = response.asByteArray();
        File tempDirFile = TestFilesManager.createTempTestResourcesDirectoryIfNotExist();
        String fileName = "report_" +
                System.currentTimeMillis() +
                getExtensionFromContent(response.getHeader("Content-Disposition"));
        File file = new File(tempDirFile, fileName);
        Files.write(file.toPath(), fileData);

        assertEquals(size, file.length());
    }

    @Then("отчёт соответствует формату {string}")
    public void chekReportFormat(String expectedFormat) {
        assertEquals(expectedFormat.toLowerCase(), response.jsonPath().getString("extension"));
    }

    @Then("атрибутами отчёта как файла соответствуют ожиданиям")
    public void checkFileAttributes(DataTable dataTable) {
        Map<String, String> expectedData = dataTable.asMap();
        Map<String, Object> actualData = response.jsonPath().getMap("");

        expectedData.forEach((key, value) -> {
            assertEquals("Ожидали " + value + ", но получили " + actualData.get(key),
                         value, String.valueOf(actualData.get(key)));
        });
    }

    private void createReport(ReportMainDto request) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(request)).
                        contentType(JSON)
                .when().
                        log().ifValidationFails().
                        post();
    }

    /**
     * По умолчанию создаём отчёт в формате PDF
     */
    private void postReport() {
        postReport("PDF");
    }

    /**
     * Создаёт отчёт на основе шаблона и сохраняет ID созданного файла.
     *
     * @param templateName имя шаблона для формирования DTO запроса
     */
    private void postReport(String templateName) {
        ReportMainDto request = prepareReport(templateName);
        createReport(request);

        if (response.getStatusCode() == SC_OK) {
            String answer = response.body().asString();
            currentReportFileId = UUID.fromString(answer.substring(1, answer.length() - 1));
        }
    }

    private static @NotNull String getExtensionFromContent(String header) {
        int lastDot = header.lastIndexOf('.');

        return header.substring(lastDot);
    }
}
