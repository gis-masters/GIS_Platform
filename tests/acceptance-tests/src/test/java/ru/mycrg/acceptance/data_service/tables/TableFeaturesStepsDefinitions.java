package ru.mycrg.acceptance.data_service.tables;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
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
import java.util.stream.Collectors;

import static java.lang.String.join;
import static org.apache.http.HttpStatus.SC_NOT_FOUND;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static ru.mycrg.acceptance.Config.PATCH_CONTENT_TYPE;
import static ru.mycrg.acceptance.data_service.FilesStepDefinitions.firstFileId;
import static ru.mycrg.acceptance.data_service.FilesStepDefinitions.secondFileId;
import static ru.mycrg.acceptance.data_service.datasets.DatasetsStepsDefinitions.currentDatasetIdentifier;
import static ru.mycrg.acceptance.data_service.tables.TablesStepsDefinitions.currentTableName;

public class TableFeaturesStepsDefinitions extends BaseStepsDefinitions {

    public static Integer currentFeatureId;
    public static List<Integer> featureIds = new ArrayList<>();

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        String basePath = String.format("/api/data/datasets/%s/tables/%s/records",
                                        currentDatasetIdentifier, currentTableName);

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

    @When("В текущем слое создаётся запись с title: {string}")
    public void createFeatureInCurrentTable(String title) {
        Map<String, Object> properties = new HashMap<>();
        properties.put("title", title);

        createFeature(new GeoJsonModel(properties));
    }

    @When("В текущей таблице существует запись")
    public void createSomeFeatureInCurrentTable() {
        Map<String, Object> properties = new HashMap<>();
        properties.put("title", "some feature");

        createFeature(new GeoJsonModel(properties));
    }

    @When("В текущей таблице существует {string} записи")
    public void createSomeFeaturesInCurrentTable(String quantity) {
        Map<String, Object> properties = new HashMap<>();
        properties.put("title", "some feature");
        for (int i = 0; i < Integer.parseInt(quantity); i++) {
            createFeature(new GeoJsonModel(properties));
            featureIds.add(currentFeatureId);
        }
    }

    @When("Пользователь создает новую запись в таблице")
    public void createNewFeatureInCurrentTable() {
        createSomeFeatureInCurrentTable();
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

    @When("Для текущей записи, в поле one_file, добавлен первый файл")
    public void writeFirstFileToCurrentRecord() {
        List<FileDescriptionModel> fileDescriptions = new ArrayList<>();
        fileDescriptions.add(new FileDescriptionModel(firstFileId, 314L, "First file"));

        Map<String, Object> properties = new HashMap<>();
        properties.put("one_file", fileDescriptions);

        updateFeature(new GeoJsonModel(properties));
    }

    @When("Пользователь удаляет запись слоя")
    public void deleteCurrentRecord() {
        deleteFeature(currentFeatureId);
    }

    @When("Пользователь делает запрос на массовое удаление записей слоя")
    public void deleteMultipleRecords() {
        if (!featureIds.isEmpty()) {
            deleteFeatures(featureIds);
        }
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

    @And("Сервер возвращает тело созданной записи таблицы, поля сущности корректно заполнены")
    public void checkCreatedFeature() {
        jsonPath = response.jsonPath();

        assertEquals("Feature", jsonPath.get("type").toString());
        assertEquals("EPSG:28406", jsonPath.get("srs").toString());
        assertNotNull(jsonPath.get("properties"));
        assertNotNull(jsonPath.get("geometry"));
        assertNotNull(jsonPath.get("id"));
    }

    @Then("Запись сохранена и поле title корректно заполнено {string}")
    public void checkCreatedFeatureTitle(String expectedTitle) {
        jsonPath = response.jsonPath();

        assertEquals(expectedTitle, jsonPath.get("properties.title").toString());
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

    @And("Записи отсутствуют в БД")
    public void recordsDoesntExistInDB() {
        featureIds.forEach(featureId -> {
            getBaseRequestWithCurrentCookie()
                    .when().
                            delete("/" + featureId)
                    .then().
                            statusCode(SC_NOT_FOUND);
        });
    }

    private void createFeature(GeoJsonModel geoJsonModel) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(ContentType.JSON)
                .when().
                        body(gson.toJson(geoJsonModel)).
                        post("");

        currentFeatureId = extractEntityIdFromResponse(response);
    }

    private void updateFeature(GeoJsonModel geoJsonModel) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(PATCH_CONTENT_TYPE)
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

    public void deleteFeatures(List<Integer> ids) {
        String path = String.format("/api/data/datasets/%s/tables/%s/records",
                                    currentDatasetIdentifier, currentTableName);

        Iterable<String> iterable = ids.stream().map(Object::toString).collect(Collectors.toList());

        response = getBaseRequestWithCurrentCookie()
                .basePath(path)
                .when().
                        delete(String.format("/%s", join(",", iterable)));
    }
}
