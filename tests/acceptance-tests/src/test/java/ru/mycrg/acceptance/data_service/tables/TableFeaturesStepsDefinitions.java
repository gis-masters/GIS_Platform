package ru.mycrg.acceptance.data_service.tables;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.auth_service.AuthorizationBase;
import ru.mycrg.acceptance.data_service.dto.FeaturesCopyModel;
import ru.mycrg.acceptance.data_service.dto.FileDescriptionModel;
import ru.mycrg.acceptance.data_service.dto.GeoJsonModel;
import ru.mycrg.acceptance.data_service.dto.QualifierDto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static io.restassured.http.ContentType.JSON;
import static java.lang.String.join;
import static java.util.stream.Collectors.toList;
import static org.apache.http.HttpStatus.SC_NOT_FOUND;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static ru.mycrg.acceptance.Config.PATCH_CONTENT_TYPE;
import static ru.mycrg.acceptance.data_service.FilesStepDefinitions.firstFileId;
import static ru.mycrg.acceptance.data_service.FilesStepDefinitions.secondFileId;
import static ru.mycrg.acceptance.data_service.datasets.DatasetsStepsDefinitions.currentDatasetIdentifier;
import static ru.mycrg.acceptance.data_service.tables.TablesStepsDefinitions.anotherTableName;
import static ru.mycrg.acceptance.data_service.tables.TablesStepsDefinitions.currentTableName;

public class TableFeaturesStepsDefinitions extends BaseStepsDefinitions {

    public static Integer currentFeatureId;
    public static List<Integer> featureIds = new ArrayList<>();

    private final AuthorizationBase authorizationBase = new AuthorizationBase();

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
        properties.put("created_at", "2022-11-08 00:00:00");

        createFeature(new GeoJsonModel(properties));
    }

    @When("В текущей таблице существует {string} записи")
    public void createSomeFeaturesInCurrentTable(String quantity) {
        featureIds = new ArrayList<>();

        Map<String, Object> properties = new HashMap<>();
        properties.put("title", "some feature");
        properties.put("objectname", "test obj_name");
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

    @When("Пользователь делает запрос на массовое редактирование записей слоя")
    public void updateMultipleRecords() {
        authorizationBase.loginAsCurrentUser();

        Map<String, Object> props = new HashMap<>();
        props.put("objectname", "updated_name");
        props.put("title", "Updated title");

        if (!featureIds.isEmpty()) {
            updateFeatures(props, featureIds);
        }
    }

    @When("Администратор делает запрос на массовое редактирование записей слоя")
    public void updateMultipleRecordsAsAdmin() {
        authorizationBase.loginAsOwner();

        Map<String, Object> props = new HashMap<>();
        props.put("objectname", "updated_name");
        props.put("title", "Updated title");

        if (!featureIds.isEmpty()) {
            updateFeatures(props, featureIds);
        }
    }

    @When("Администратор делает запрос на копирование записей слоя")
    public void copyMultipleRecordsAsAdmin() {
        authorizationBase.loginAsOwner();

        copyFeatures(prepareCopyModel());
    }

    @When("Пользователь делает запрос на копирование записей слоя")
    public void copyMultipleRecordsAsUser() {
        authorizationBase.loginAsCurrentUser();

        copyFeatures(prepareCopyModel());
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
        properties.put("created_at", "");

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

    @And("Записи в таблице успешно обновлены")
    public void checkUpdatedFeatures() {
        getFeatures(featureIds, currentDatasetIdentifier, currentTableName);

        jsonPath = response.jsonPath();

        List<Map<String, Object>> properties = jsonPath.getList("properties");
        properties.forEach(property -> assertEquals("Updated title", property.get("title").toString()));
    }

    @And("В слой добавлены новые записи из shape файла")
    public void checkCreationOfFeaturesWithGeometry() {
        getFeatures(List.of(1, 2, 3, 4, 5), currentDatasetIdentifier, anotherTableName);

        jsonPath = response.jsonPath();

        List<Map<String, Object>> features = jsonPath.getList("");
        assertEquals(5, features.size());
    }

    @And("Калькулируемые поля пересчитаны в связи с редактированием")
    public void checkCalculatedFields() {
        List<Map<String, Object>> properties = jsonPath.getList("properties");

        properties
                .forEach(property -> {
                    String objectName = property.get("objectname").toString();
                    String objectId = property.get("objectid").toString();
                    String expectedName = "updated_name_test_" + objectId;

                    assertEquals(expectedName, objectName);
                });
    }

    @And("Записи успешно скопированы в другую таблицу")
    public void checkCopiedFeatures() {
        getFeatures(featureIds, currentDatasetIdentifier, anotherTableName);

        jsonPath = response.jsonPath();

        List<Integer> ids = jsonPath.getList("id");
        assertEquals(featureIds.size(), ids.size());
        assertEquals(featureIds, ids);
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

    @And("Запись в таблице с результатами валидации отсутствует")
    public void recordDoesntExistInExtensionTable() {
        if (!response.asString().isEmpty()) {
            List<Map<String, Object>> results = response.jsonPath().getList("results");

            long count = results.stream()
                                .filter(result -> result.containsKey("objectId"))
                                .map(result -> result.get("objectId"))
                                .filter(objectId -> objectId.equals(currentFeatureId))
                                .count();

            assertEquals(0, count);
        }
    }

    private void createFeature(GeoJsonModel geoJsonModel) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(JSON)
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
                        contentType(JSON)
                .when().
                        get("/" + id);
    }

    public void deleteFeature(Integer id) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        delete(String.format("/%s", id));
    }

    private void deleteFeatures(List<Integer> ids) {
        String path = String.format("/api/data/datasets/%s/tables/%s/records",
                                    currentDatasetIdentifier, currentTableName);

        Iterable<String> iterable = ids.stream().map(Object::toString).collect(toList());

        response = getBaseRequestWithCurrentCookie()
                .basePath(path)
                .when().
                        delete(String.format("/%s", join(",", iterable)));
    }

    private void updateFeatures(Map<String, Object> properties, List<Integer> ids) {
        String path = String.format("/api/data/datasets/%s/tables/%s/records-multiple",
                                    currentDatasetIdentifier, currentTableName);

        Iterable<String> iterable = ids.stream().map(Object::toString).collect(toList());

        response = getBaseRequestWithCurrentCookie().
                given().
                        basePath(path).
                        contentType(PATCH_CONTENT_TYPE).
                        body(gson.toJson(properties))
                .when().
                        patch(String.format("/%s", join(",", iterable)));
    }

    private void copyFeatures(FeaturesCopyModel copyModel) {
        response = getBaseRequestWithCurrentCookie().
                given().
                        basePath("/api/data/records/copy").
                        body(gson.toJson(copyModel))
                        .contentType(JSON)
                .when().
                        post();
    }

    private void getFeatures(List<Integer> ids, String datasetId, String tableName) {
        String path = String.format("/api/data/datasets/%s/tables/%s/records",
                                    datasetId, tableName);

        Iterable<String> iterable = ids.stream().map(Object::toString).collect(toList());

        response = getBaseRequestWithCurrentCookie().
                given().
                        basePath(path)
                .when().
                        get(String.format("/%s", join(",", iterable)));
    }

    private static FeaturesCopyModel prepareCopyModel() {
        QualifierDto source = new QualifierDto(currentDatasetIdentifier, currentTableName);
        QualifierDto target = new QualifierDto(currentDatasetIdentifier, anotherTableName);

        FeaturesCopyModel copyModel = new FeaturesCopyModel(source, target, featureIds);
        return copyModel;
    }
}
