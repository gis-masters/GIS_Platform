package ru.mycrg.acceptance.data_service.processes;

import io.cucumber.java.en.And;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;

import static java.lang.Thread.sleep;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class GmlParsingStepDefinitions extends BaseStepsDefinitions {

    public static Integer currentProcessId;

    @Override
    public RequestSpecification getBaseRequest() {
        return super.getBaseRequest().basePath("/api/data");
    }

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie().basePath("/api/data");
    }

    @When("Пытаемся инициализировать импорт GML файла {string} {string} {string} {string} {string} {string} {string}")
    public void tryImportGmlProcess(String type,
                                    String wsUiIdKey,
                                    String libraryIdKey,
                                    String objectIdKey,
                                    String projectIdKey,
                                    String projectNameKey,
                                    String projectIsNew) {
        ImportGmlRequestModel payload = new ImportGmlRequestModel();
        payload.setWsUiId(generateString(wsUiIdKey));
        payload.setLibraryId(generateString(libraryIdKey));
        payload.setProjectName(generateString(projectNameKey));
        payload.setProjectIsNew(Boolean.parseBoolean(projectIsNew));
        payload.setObjectId(Long.parseLong(generateString(objectIdKey)));

        if (!projectIdKey.equals("NULL")) {
            payload.setProjectId(Long.parseLong(generateString(projectIdKey)));
        }

        initProcess(type, payload);
    }

    @When("Пользователь инициализирует импорт GML файла со случайными параметрами")
    public void initImportGmlProcess() {
        final ImportGmlRequestModel payload = new ImportGmlRequestModel();
        payload.setWsUiId("someWsId");
        payload.setLibraryId("notExistLibrary");
        payload.setProjectId(314L);
        payload.setObjectId(314L);
        payload.setProjectName("SomeProjectName");
        payload.setProjectIsNew(true);

        initProcess("IMPORT_GML", payload);

        currentProcessId = extractId(response.jsonPath().get("_links.self.href"));
    }

    @And("Сервер возвращает тело начатого процесса")
    public void checkResponseBody() {
        super.checkResponseValue("title", "Import gml");
        super.checkResponseValue("status", "PENDING");
        super.checkResponseValue("type", "IMPORT_GML");
    }

    @And("процесс завершается неудачей, в отчет записана причина")
    public void checkErrorProcessBody() throws InterruptedException {
        sleep(300); // Ждем, процесс должен быстро упасть

        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/processes/" + currentProcessId);

        assertFalse(response.jsonPath().get("details.success"));
        assertTrue(response.jsonPath().get("details.reason").toString()
                           .contains("Не удалось выполнить импорт GML файла"));
    }

    private void initProcess(String type, ImportGmlRequestModel payload) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(new ProcessDto(type, payload))).
                        contentType(ContentType.JSON)
                .when().
                        log().all().
                        post("/processes");
    }
}
