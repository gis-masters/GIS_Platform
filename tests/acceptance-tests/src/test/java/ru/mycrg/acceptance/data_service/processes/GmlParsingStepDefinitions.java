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

    @When("Пытаемся инициализировать импорт GML файла {string} {string} {string} {string} {string} {string}")
    public void tryImportGmlProcess(String wsUiIdKey,
                                    String libraryIdKey,
                                    String objectIdKey,
                                    String projectIdKey,
                                    String projectNameKey,
                                    String projectIsNew) {
        ImportInitializingModel payload = new ImportInitializingModel();
        payload.setWsUiId(generateString(wsUiIdKey));
        payload.setSource(new ImportSource(generateString(libraryIdKey), Long.parseLong(generateString(objectIdKey))));
        payload.setTarget(new ImportTarget(generateString(projectNameKey), Boolean.parseBoolean(projectIsNew)));

        if (!projectIdKey.equals("NULL")) {
            payload.setProjectId(Long.parseLong(generateString(projectIdKey)));
        }

        initProcess(payload);
    }

    @When("Пользователь инициализирует импорт GML файла со случайными параметрами")
    public void initImportGmlProcess() {
        ImportInitializingModel payload = new ImportInitializingModel();
        payload.setWsUiId("someWsId");
        payload.setSource(new ImportSource("notExistLibrary", 314L));
        payload.setTarget(new ImportTarget(314L, "SomeProjectName", true));

        initProcess(payload);

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

    private void initProcess(ImportInitializingModel payload) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(payload)).
                        contentType(ContentType.JSON)
                .when().
                        log().all().
                        post("/processes");
    }
}
