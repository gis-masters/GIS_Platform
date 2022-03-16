package ru.mycrg.acceptance.data_service.tables;

import io.cucumber.java.en.And;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.data_service.dto.FileDescriptionModel;
import ru.mycrg.acceptance.data_service.dto.GeoJsonModel;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.lang.Thread.sleep;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static ru.mycrg.acceptance.data_service.DatasetsStepsDefinitions.currentDatasetName;
import static ru.mycrg.acceptance.data_service.FilesStepDefinitions.secondFileId;
import static ru.mycrg.acceptance.data_service.libraries.LibraryPermissionsStepsDefinitions.DEFAULT_LIBRARY;
import static ru.mycrg.acceptance.data_service.tables.TablesStepsDefinitions.currentTableName;

public class TableFeaturesStepsDefinitions extends BaseStepsDefinitions {

    public static Integer currentFeatureId;

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        String basePath = String.format("/api/data/datasets/%s/tables/%s/records",
                                        currentDatasetName, currentTableName);

        return super.getBaseRequestWithCurrentCookie()
                    .basePath(basePath);
    }

    @When("Пользователь создаёт запись в слое с отсылкой на второй файл")
    public void currentUserCreateFeatureWithFile() {
        List<FileDescriptionModel> filesDescription = new ArrayList<>();
        filesDescription.add(new FileDescriptionModel(secondFileId, 314L, "Second file"));

        Map<String, Object> properties = new HashMap<>();
        properties.put("some_files", filesDescription);

        createFeature(new GeoJsonModel(properties));
    }

    @When("Пользователь отправляет POST запрос на создание новой записи с телом в формате GeoJson")
    public void createFeatureInCurrentTable() {
        Map<String, Object> properties = new HashMap<>();
        properties.put("title", "some title here");

        createFeature(new GeoJsonModel(properties));
    }

    @When("В текущей таблице существует запись")
    public void createSomeFeatureInCurrentTable() {
        Map<String, Object> properties = new HashMap<>();
        properties.put("title", "some feature");

        createFeature(new GeoJsonModel(properties));
    }

    @When("Пользователь создает новую запись в таблице")
    public void createAndWaitNewFeatureInCurrentTable() throws InterruptedException {
        createSomeFeatureInCurrentTable();

        sleep(500);
    }

    @When("Создана запись в слое с отсылкой на второй файл")
    public void createRecordWithSecondFile() {
        List<FileDescriptionModel> fileDescriptions = new ArrayList<>();
        fileDescriptions.add(new FileDescriptionModel(secondFileId, 314L, "Second file"));

        Map<String, Object> properties = new HashMap<>();
        properties.put("title", "some feature");
        properties.put("some_files", fileDescriptions);

        createFeature(new GeoJsonModel(properties));
    }

    @When("Пользователь удаляет запись слоя")
    public void deleteCurrentRecord() {
        deleteFeature(currentFeatureId);
    }

    @When("Пользователь обновляет запись слоя - удаляет файл")
    public void updateCurrentRecordWithDeleteFiles() {
        Map<String, Object> properties = new HashMap<>();
        properties.put("title", "Updated title");
        properties.put("some_files", new ArrayList<>());

        updateFeature(new GeoJsonModel(properties));
    }

    @When("Пользователь делает запрос на обновление существующей записи")
    public void updateFeatureInCurrentTable() {
        Map<String, Object> properties = new HashMap<>();
        properties.put("title", "new title");

        updateFeature(new GeoJsonModel(properties));
    }

    @When("Пользователь обновляет запись в таблице")
    public void updateAndWaitFeatureInCurrentTable() throws InterruptedException {
        updateFeatureInCurrentTable();

        sleep(500);
    }

    @And("Сервер возвращает тело созданной записи таблицы, поля сущности корректно заполнены")
    public void checkCreatedFeature() {
        jsonPath = response.jsonPath();

        assertEquals("Feature", jsonPath.get("type").toString());
        assertEquals("EPSG:28406", jsonPath.get("srs").toString());
        assertNotNull(jsonPath.get("properties"));
        assertNotNull(jsonPath.get("geometry"));
        assertNotNull(jsonPath.get("id"));
    }

    @And("Запись в таблице успешно обновлена")
    public void checkUpdatedFeature() {
        jsonPath = response.jsonPath();

        assertEquals("Feature", jsonPath.get("type").toString());
        assertEquals("EPSG:28406", jsonPath.get("srs").toString());
        assertNotNull(jsonPath.get("properties"));
        assertNotNull(jsonPath.get("geometry"));
        assertNotNull(jsonPath.get("id"));
    }

    private void createFeature(GeoJsonModel geoJsonModel) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(ContentType.JSON)
                .when().
                        log().all().
                        body(gson.toJson(geoJsonModel)).
                        post("");

        currentFeatureId = extractEntityIdFromResponse(response);
    }

    private void updateFeature(GeoJsonModel geoJsonModel) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType("application/merge-patch+json")
                .when().
                        body(gson.toJson(geoJsonModel)).
                        patch("/" + currentFeatureId);
    }

    // Нет GET пока что
    private void getFeature(Integer id) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(ContentType.JSON)
                .when().
                        get("/" + id);
    }

    public void deleteFeature(Integer id) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        delete(String.format("/%s", id));
    }
}
