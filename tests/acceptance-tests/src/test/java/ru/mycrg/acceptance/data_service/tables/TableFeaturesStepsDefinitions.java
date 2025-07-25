package ru.mycrg.acceptance.data_service.tables;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.specification.RequestSpecification;
import org.junit.Assert;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.auth_service.AuthorizationBase;
import ru.mycrg.acceptance.data_service.dto.FeaturesCopyModel;
import ru.mycrg.acceptance.data_service.dto.FileDescriptionModel;
import ru.mycrg.acceptance.data_service.dto.GeoJsonModel;
import ru.mycrg.acceptance.data_service.dto.QualifierDto;

import java.time.LocalDateTime;
import java.util.*;

import static io.restassured.http.ContentType.JSON;
import static java.lang.String.join;
import static java.util.stream.Collectors.toList;
import static org.apache.http.HttpStatus.SC_NOT_FOUND;
import static org.junit.Assert.*;
import static ru.mycrg.acceptance.Config.DATE_TIME_FORMAT;
import static ru.mycrg.acceptance.Config.PATCH_CONTENT_TYPE;
import static ru.mycrg.acceptance.auth_service.OrganizationStepsDefinitions.orgDto;
import static ru.mycrg.acceptance.auth_service.OrganizationStepsDefinitions.orgId;
import static ru.mycrg.acceptance.auth_service.UserStepsDefinitions.userDto;
import static ru.mycrg.acceptance.data_service.FilesStepDefinitions.*;
import static ru.mycrg.acceptance.data_service.datasets.DatasetsStepsDefinitions.currentDatasetIdentifier;
import static ru.mycrg.acceptance.data_service.tables.TablesStepsDefinitions.anotherTableName;
import static ru.mycrg.acceptance.data_service.tables.TablesStepsDefinitions.currentTableName;

public class TableFeaturesStepsDefinitions extends BaseStepsDefinitions {

    public static Integer currentFeatureId;
    public static List<Integer> featureIds = new ArrayList<>();
    public static LocalDateTime currentRecordLastModified;

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

    @When("Пользователь создаёт запись в слое с отсылкой на текущий файл")
    public void currentUserCreateFeatureWithCurrentFile() {
        List<FileDescriptionModel> filesDescription = new ArrayList<>();
        filesDescription.add(new FileDescriptionModel(currentFileId, 314L, "Current file.tif"));

        Map<String, Object> properties = new HashMap<>();
        properties.put("some_files", filesDescription);

        createFeature(new GeoJsonModel(properties));
    }

    @When("Пользователь отправляет POST запрос на создание новой записи с телом в формате GeoJson")
    public void createFeatureInCurrentTable() {
        Map<String, Object> properties = new HashMap<>();
        properties.put("title", "some title here");
        properties.put("name", "test");

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
        properties.put("name", "testName");
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

    @When("Администратор делает запрос на массовое копирование записей слоя")
    public void copyMultipleRecordsAsAdmin() {
        authorizationBase.loginAsOwner();

        copyFeatures(prepareCopyModel());
    }

    @When("Пользователь делает запрос на массовове копирование записей слоя")
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
        authorizationBase.loginAsCurrentUser();

        Map<String, Object> properties = new HashMap<>();
        properties.put("title", "new title");

        updateFeature(new GeoJsonModel(properties));
    }

    @When("Администратор делает запрос на обновление существующей записи")
    public void updateFeatureInCurrentTableByAdmin() {
        authorizationBase.loginAsOwner();

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

    @And("Калькулируемые поля пересчитаны согласно calculated Value Formula")
    public void checkCalculatedFieldsByFormula() {
        jsonPath = response.jsonPath();

        assertEquals("Feature", jsonPath.get("type").toString());
        assertNotNull(jsonPath.get("properties"));
        assertNotNull(jsonPath.get("properties.name"));

        String name = jsonPath.get("properties.name");
        assertEquals("test!!!", name);
    }

    @And("Поля провалидированы согласно validationFormula")
    public void checkValidatedFieldsByValidationFormula() {
        jsonPath = response.jsonPath();

        assertNotNull(jsonPath.get("results"));
        assertNotNull(jsonPath.get("results.objectViolations"));
        List<List<Object>> objectViolations = jsonPath.get("results.objectViolations");
        assertFalse(objectViolations.isEmpty());

        List<Object> objectViolation = objectViolations.get(0);
        assertFalse(objectViolation.isEmpty());

        Map<String, Object> result = (Map<String, Object>) objectViolation.get(0);

        assertTrue(result.containsKey("error"));
        assertEquals("error", result.get("error"));
        assertTrue(result.containsKey("attribute"));
        assertEquals("name", result.get("attribute"));
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
        getFeatures(List.of(1), currentDatasetIdentifier, anotherTableName);

        jsonPath = response.jsonPath();

        List<Map<String, Object>> features = jsonPath.getList("");
        assertEquals(1, features.size());
    }

    @And("координаты были трансформированы из координатной системы \"EPSG:7829\" в \"EPSG:28406\"")
    public void checkThatCRSWasTransformed() {
        String geoserverPath =
                String.format("geoserver/wfs?service=wfs" +
                                      "&version=2.0.0&request=GetFeature" +
                                      "&typeNames=scratch_database_%s:%s__%s" +
                                      "&featureID=%s" +
                                      "&outputFormat=application/json",
                              orgId, anotherTableName, "28406", 1);

        response = getBaseRequestWithCurrentCookie()
                .when().basePath("/")
                       .get(geoserverPath);

        jsonPath = response.jsonPath();
        assertNotNull(jsonPath);

        List<Map<String, Object>> featuresList = jsonPath.get("features");
        assertFalse(featuresList.isEmpty());

        Map<String, Object> firstFeature = featuresList.get(0);
        assertTrue(firstFeature.containsKey("geometry"));

        HashMap<String, Object> geometry = (HashMap<String, Object>) firstFeature.get("geometry");
        List<Object> coordinates = (List<Object>) geometry.get("coordinates");
        assertEquals(1, coordinates.size());

        List<Object> polygon = (List<Object>) coordinates.get(0);
        List<Object> firstPointOfPolygon = (List<Object>) polygon.get(0);
        assertEquals("6694769.5", String.valueOf(firstPointOfPolygon.get(0)));
        assertEquals("4967093.0", String.valueOf(firstPointOfPolygon.get(1)));
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

    @When("В созданной таблице присутствуют поля 'дата создания, модификации и создатель'")
    public void checkTableHasModifiedFields() {
        createSomeFeatureInCurrentTable();
        getFeature(currentFeatureId);

        ArrayList<HashMap<String, Object>> propertiesList = response.jsonPath().get("properties");
        HashMap<String, Object> properties = propertiesList.get(0);

        Object createdAt = properties.get("created_at");
        Assert.assertNotNull(createdAt);
        Object createdBy = properties.get("created_by");
        Assert.assertNotNull(createdBy);

        Object lastModified = properties.get("last_modified");
        Assert.assertNotNull(lastModified);

        Object updatedBy = properties.get("updated_by");
        Assert.assertNotNull(updatedBy);
    }

    @Then("Поле 'created_at' и 'last_modified' заполнилось датой создания")
    public void checkCreatedAtAndLastModifiedField() {
        getFeature(currentFeatureId);

        Map<String, Object> firstRecordProps = (Map<String, Object>) response
                .jsonPath()
                .getList("properties").get(0);

        assertNotNull(firstRecordProps.get("created_at"));
        assertNotNull(firstRecordProps.get("last_modified"));
    }

    @Then("Поле 'created_by' и 'updated_by' заполнилось логином создателя")
    public void checkCreatedByyAndUpdatedByField() {
        getFeature(currentFeatureId);
        Map<String, Object> properties = (Map<String, Object>) response.jsonPath().getList("properties").get(0);

        String createdBy = String.valueOf(properties.get("created_by"));
        String updatedBy = String.valueOf(properties.get("updated_by"));

        assertEquals(orgDto.getOwner().getEmail(), createdBy);
        assertEquals(orgDto.getOwner().getEmail(), updatedBy);
    }

    @Given("В текущей записи таблицы хранится текущее время в поле 'last_modified'")
    public void checkLastModifiedFieldInNewRecord() {
        getFeature(currentFeatureId);
        Map<String, Object> properties = (Map<String, Object>) response.jsonPath().getList("properties").get(0);

        String lastModified = String.valueOf(properties.get("last_modified"));
        currentRecordLastModified = LocalDateTime.parse(lastModified, DATE_TIME_FORMAT);
    }

    @Then("Поле 'last_modified' обновилось")
    public void checkLastModifiedFieldWasChanged() {
        getFeature(currentFeatureId);
        Map<String, Object> properties = (Map<String, Object>) response.jsonPath().getList("properties").get(0);

        String lastModified = String.valueOf(properties.get("last_modified"));
        LocalDateTime lastModifiedDate = LocalDateTime.parse(lastModified, DATE_TIME_FORMAT);

        assertEquals(-1, currentRecordLastModified.compareTo(lastModifiedDate));
    }

    @Then("Поле 'updated_by' заполнилось логином редактора")
    public void checkUpdatedByFieldWasChanged() {
        getFeature(currentFeatureId);
        Map<String, Object> properties = (Map<String, Object>) response.jsonPath().getList("properties").get(0);

        String updatedBy = String.valueOf(properties.get("updated_by"));

        assertEquals(userDto.getEmail(), updatedBy);
    }

    @Then("количество объектов в слое равно {int}")
    public void checkObjectsCount(int count) {
        getAllFeatures();
        assertEquals(count, response.jsonPath().getInt("page.totalElements"));
    }

    @And("геометрия в объекте равна {string}")
    public void checkObjectGeom(String geom) {
        List<Map<String, Object>> features = response.jsonPath().getList("content.properties");
        boolean geometryMatches = features.stream().anyMatch(properties ->
                                                                     geom.equals(properties.get("shape"))
        );
        Assert.assertTrue("Геометрия не совпадает", geometryMatches);
    }

    @And("атрибуты объекта с полем {string} равным {int} такие")
    public void checkRecordFields(String fieldName, int value, Map<String, List<Object>> expectedFields) {
        response.prettyPrint();

        List<Map<String, Object>> content = response.jsonPath().getList("content.properties");

        Map<String, Object> matchingRecord = content
                .stream()
                .filter(properties -> properties.containsKey(fieldName) && properties.get(fieldName).equals(value))
                .findFirst()
                .orElse(null);

        String msg = String.format("Объект не найден в выборке по заданным параметрам [%s:%s]", fieldName, value);
        assertNotNull(msg, matchingRecord);

        boolean areEqual = true;
        for (Map.Entry<String, List<Object>> entry: expectedFields.entrySet()) {
            String key = entry.getKey();
            List<Object> list = entry.getValue();
            Object valueFromList = list != null && !list.isEmpty() ? list.get(0) : null;

            Object matchingValue = matchingRecord.get(key);
            if (!Objects.equals(String.valueOf(valueFromList), String.valueOf(matchingValue))) {
                System.out.printf("Mismatch for key '%s': expected '%s', but found '%s'%n",
                                  key, valueFromList, matchingValue);
                areEqual = false;
            }
        }

        assertTrue("The expected fields do not match the record fields", areEqual);
    }

    @And("атрибуты фичи равны ожидаемым")
    public void checkAllFeaturesInDataset(DataTable dataTable) {
        List<Map<Object, Object>> rawRows = dataTable.asMaps(Object.class, Object.class);
        List<Map<String, Object>> tablesList = response.jsonPath().getList("content");

        for (Map<Object, Object> rawRow: rawRows) {
            Map<String, String> expectedValues = new HashMap<>();
            for (Map.Entry<Object, Object> entry: rawRow.entrySet()) {
                expectedValues.put(String.valueOf(entry.getKey()), String.valueOf(entry.getValue()));
            }

            String expectedLayer = expectedValues.get("layer");
            String expectedGlobalId = expectedValues.get("globalid");
            String expectedShape = expectedValues.get("shape");

            Map<String, Object> table = tablesList
                    .stream()
                    .filter(tableMap -> {
                        Map<String, Object> schema = (Map<String, Object>) tableMap.get("schema");
                        return expectedLayer.equals(schema.get("name"));
                    })
                    .findFirst()
                    .orElseThrow(() -> new AssertionError("Ожидаемый слой: " + expectedLayer + " не найден"));

            String fullIdentifier = table.get("identifier").toString();

            response = getBaseRequestWithCurrentCookie()
                    .basePath(String.format("/api/data/datasets/%s/tables/%s/records",
                                            currentDatasetIdentifier, fullIdentifier))
                    .when()
                            .get();

            List<Map<String, Object>> features = response.jsonPath().getList("content");
            assertFalse("No features found in layer " + expectedLayer, features.isEmpty());

            Map<String, Object> firstFeature = features.get(0);
            Map<String, Object> properties = (Map<String, Object>) firstFeature.get("properties");
            assertEquals("Несоответствие значения globalid для слоя " + expectedLayer, expectedGlobalId,
                         properties.get("globalid"));
            assertEquals("Несоответствие значения shape для слоя " + expectedLayer, expectedShape,
                         properties.get("shape"));
        }
    }

    private void createFeature(GeoJsonModel geoJsonModel) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(JSON)
                .when().
                        body(gson.toJson(geoJsonModel)).
                        post("");

        if (response.statusCode() != 201) {
            assertEquals(201, response.statusCode());
        }

        currentFeatureId = extractEntityIdFromResponse(response);
    }

    private void updateFeature(GeoJsonModel geoJsonModel) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(PATCH_CONTENT_TYPE)
                .when().
                        body(gson.toJson(geoJsonModel)).
                        patch("/" + currentFeatureId);

        response.then().statusCode(204);
    }

    // Нет GET пока что

    private void getFeature(Integer id) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(JSON)
                .when().
                        get("/" + id);
    }

    private void getAllFeatures() {
        response = getBaseRequestWithCurrentCookie()
                .given()
                        .contentType(JSON)
                .when()
                        .get();
    }

    public void deleteFeature(Integer id) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        delete(String.format("/%s", id));

        response.then().statusCode(204);
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

        return new FeaturesCopyModel(source, target, featureIds);
    }
}
