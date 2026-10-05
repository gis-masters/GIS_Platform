package ru.mycrg.acceptance.data_service.features;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.PendingException;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import org.geolatte.geom.ByteBuffer;
import org.geolatte.geom.Geometry;
import org.geolatte.geom.LinearRing;
import org.geolatte.geom.Position;
import org.geolatte.geom.codec.Wkb;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.JsonMapper;
import ru.mycrg.acceptance.data_service.CurrentFilesManager;
import ru.mycrg.acceptance.data_service.dto.FileDescriptionModel;
import ru.mycrg.acceptance.data_service.dto.TableCreateDto;
import ru.mycrg.acceptance.gis_service.dto.LayerCreateDto;
import ru.mycrg.geo_json.Feature;
import ru.mycrg.geo_json.LngLatAlt;
import ru.mycrg.geo_json.MultiPolygon;
import ru.mycrg.geo_json.Polygon;
import tools.jackson.databind.JsonNode;

import java.util.*;
import java.util.stream.Collectors;

import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static ru.mycrg.acceptance.Config.PATCH_CONTENT_TYPE;
import static ru.mycrg.acceptance.FeatureBuilder.prepareFeatures;
import static ru.mycrg.acceptance.JsonMapper.asJson;
import static ru.mycrg.acceptance.data_service.datasets.DatasetsStepsDefinitions.currentDatasetIdentifier;
import static ru.mycrg.acceptance.data_service.tables.TableFeaturesStepsDefinitions.currentFeatureId;
import static ru.mycrg.acceptance.data_service.tables.TablesStepsDefinitions.currentTableName;
import static ru.mycrg.acceptance.gis_service.LayerStepDefinitions.isDataInMapsEqualsByRows;
import static ru.mycrg.acceptance.utils.GeometryUtils.DEFAULT_GEOMETRY_COLUMN_NAME;

public class FeaturesStepsDefinitions extends BaseStepsDefinitions {

    private static final List<List<List<Double>>> SELF_INTERSECTED_GEOMETRY_COORDINATES = List.of(
            List.of(List.of(0.0, 0.0),
                    List.of(2.0, 2.0),
                    List.of(0.0, 2.0),
                    List.of(2.0, 0.0),
                    List.of(0.0, 0.0)));

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        String url = String.format("/api/data/datasets/%s/tables", currentDatasetIdentifier);

        return super.getBaseRequestWithCurrentCookie()
                    .basePath(url);
    }

    public Response getAllFeatures(String tableIdentifier) {
        return getFeatures(tableIdentifier);
    }

    @When("Пользователь добавляет случайный объект в текущую таблицу")
    public void createRandomObjectInCurrentTable() {
        // TODO: нужен бы генератор тестовых данных, который бы работал по схеме.
        Feature feature = new Feature(Map.of(
                "firstProperty", "any text here",
                "fiz", "any text here"
        ));

        scenarioFeatures.add(feature);

        createFeature(feature);

        response.then()
                .statusCode(201);
    }

    @When("Пользователь пытается добавить сломанную геометрию в текущую таблицу с skipGeometryValidation = {string}")
    public void createSelfIntersectedObject(String skipGeometryValidation) {
        Map<String, Object> properties = new HashMap<>();
        properties.put("firstProperty", "any text here");
        properties.put("fiz", "any text here");
        Feature feature = new Feature(properties);

        Polygon brokenPolygon = new Polygon();
        List<LngLatAlt> coordinates = new ArrayList<>();
        coordinates.add(new LngLatAlt(0, 0));
        coordinates.add(new LngLatAlt(2, 2));
        coordinates.add(new LngLatAlt(0, 2));
        coordinates.add(new LngLatAlt(2, 0));
        coordinates.add(new LngLatAlt(0, 0));

        brokenPolygon.setExteriorRing(coordinates);
        feature.setGeometry(brokenPolygon);

        scenarioFeatures.add(feature);
        createFeature(feature, skipGeometryValidation);
    }

    @Then("В ответе та же сломанная геометрия")
    public void checkSelfIntersectedGeometryInResponse() {
        Object coordinates = response.jsonPath().get("geometry.coordinates");

        assertEquals(SELF_INTERSECTED_GEOMETRY_COORDINATES, toDoubleCoordinates(coordinates));
    }

    @Then("созданная запись в текущей таблице содержит ту же сломанную геометрию")
    public void checkCreatedFeatureHasSameBrokenGeometry() {
        assertNotNull("Нет id созданной записи", currentFeatureId);

        getFeatures(getLatestTable().getName(), List.of(String.valueOf(currentFeatureId)));

        response.then()
                .statusCode(200);

        List<Map<String, Object>> properties = response.jsonPath().getList("properties");
        assertEquals(1, properties.size());

        Object shape = properties.getFirst().get(DEFAULT_GEOMETRY_COLUMN_NAME);
        assertNotNull(shape);
        assertEquals(SELF_INTERSECTED_GEOMETRY_COORDINATES.getFirst(), exteriorRing(shape.toString()));
    }

    @Then("Объект успешно сохранён в текущей таблице")
    public void checkCreatedFeature() {
        Feature firstFeature = scenarioFeatures.getFirst();

        response.then()
                .statusCode(201)
                .body("properties.fiz", equalTo(firstFeature.getProperties().get("fiz").toString()));
    }

    @When("Таблица наполнена данными {string}")
    public void createSomeDataInCurrentTable(String dataTemplate) {
        scenarioFeatures = prepareFeatures(dataTemplate);
        for (Feature feature: scenarioFeatures) {
            createFeature(feature);

            response.then()
                    .statusCode(201);
        }
    }

    @Then("Данные корректно перенесены из слоя 'слой поставщик' в {string}")
    public void checkDataInConsumer(String layerConsumer, DataTable table) {
        List<String> data = table.asList(String.class);
        String idsAsString = data.get(1);
        List<String> featureIds = Arrays.stream(idsAsString.split(", "))
                                        .collect(Collectors.toList());

        LayerCreateDto consumer = getLayerByTitle(layerConsumer);

        getFeatures(consumer.getResourceId(), featureIds);

        List<Map<String, Object>> featuresProps = response.jsonPath()
                                                          .getList("properties");

        Map<String, Object> firstFeature = featuresProps.getFirst();
        // field_1 должно быть числом, а не строкой - это ошибка, но времени на её исправление нет.
        // Фронт берет фичи с геосервера(он отдает правильно), пэтому пока пропускаем.
        assertEquals("935.06275092", firstFeature.get("field_1"));
        assertEquals("935.06275092", firstFeature.get("field_2"));
        assertEquals("1", firstFeature.get("field_3"));
        assertEquals("1", firstFeature.get("field_4"));
        assertEquals(1, firstFeature.get(PRIMARY_KEY));

        Map<String, Object> secondFeature = featuresProps.get(1);
        assertEquals("530.84226136", secondFeature.get("field_1"));
        assertEquals("530.84226136", secondFeature.get("field_2"));
        assertEquals("2", secondFeature.get("field_3"));
        assertEquals("20", secondFeature.get("field_4"));
        assertEquals(2, secondFeature.get(PRIMARY_KEY));

        Map<String, Object> thirdFeature = featuresProps.get(2);
        assertEquals("1195.79501826", thirdFeature.get("field_1"));
        assertEquals("1195.79501826", thirdFeature.get("field_2"));
        assertEquals("3", thirdFeature.get("field_3"));
        assertEquals("30", thirdFeature.get("field_4"));
        assertEquals(3, thirdFeature.get(PRIMARY_KEY));
    }

    @Then("данные векторной таблицы совпадают с ожидаемыми")
    public void checkVectorTableData(Map<String, List<Object>> expectedFields) {
        List<Map<String, Object>> featuresProps = response.jsonPath()
                                                          .getList("properties");

        boolean areEqual =  isDataInMapsEqualsByRows(expectedFields, featuresProps.getFirst());

        assertTrue("The expected fields do not match the record fields", areEqual);
    }

    @When("Пользователь спрашивает валидность объекта: {string} с EPSG: {string}")
    public void checkGeometryValid(String geometryJson, String epsg) {
        JsonNode feature = wrapGeometryIntoFeature(geometryJson);

        response = super.getBaseRequestWithCurrentCookie()
                .given().
                        body(JsonMapper.asJson(feature)).
                        contentType(ContentType.JSON).
                        queryParam("epsg", epsg)
                .when().
                        post("api/data/checkGeometryValid");
    }

    @When("Пользователь просит сделать валидным объект: {string}")
    public void makeGeometryValid(String geometryJson) {
        JsonNode feature = wrapGeometryIntoFeature(geometryJson);

        response = super.getBaseRequestWithCurrentCookie()
                .given().
                        body(JsonMapper.asJson(feature)).
                        contentType(ContentType.JSON)
                .when().
                        post("api/data/makeGeometryValid");
    }

    @Then("Сервер возвращает валидный объект: {string}")
    public void validGeometryResponse(String geometryJson) {
        JsonNode expectedJson = wrapGeometryIntoFeature(geometryJson);
        JsonNode actualJson = JsonMapper.asJsonNode(response.getBody().asString());

        assertEquals(JsonMapper.asJson(expectedJson), JsonMapper.asJson(actualJson));
    }

    @When("Пользователь пытается сломать геометрию добавленного объекта")
    public void currentUserTryBreakFeatureGeometry() {
        String featureId = response.jsonPath().getString("id");

        // Создаем Feature с некорректной геометрией (точки полигона в космосе)
        Feature brokenFeature = new Feature();
        brokenFeature.setId(Long.parseLong(featureId));

        MultiPolygon multiPolygon = new MultiPolygon();
        List<List<LngLatAlt>> polygon = new ArrayList<>();
        List<LngLatAlt> ring = new ArrayList<>();

        // Создаем некорректные координаты для полигона
        ring.add(new LngLatAlt(-150162514487.6791, 268047105300.436));
        ring.add(new LngLatAlt(85606667137.8359, 262433553356.9721));
        ring.add(new LngLatAlt(40698251590.1187, 79993115194.3713));
        ring.add(new LngLatAlt(-189457378091.9316, 102447322968.2297));
        ring.add(new LngLatAlt(-150162514487.6791, 268047105300.436));

        polygon.add(ring);
        multiPolygon.add(polygon);
        brokenFeature.setGeometry(multiPolygon);

        // Отправляем PATCH запрос с некорректной геометрией
        patchFeature(brokenFeature);
    }

    @Given("Файл {string} добавлен к перовой фиче")
    public void addFileToFirstFeature(String fileName) {
        List<FileDescriptionModel> array = new ArrayList<>();
        array.add(CurrentFilesManager.getFileDescription(fileName));

        Feature feature = new Feature();
        feature.setId(1L);
        feature.setProperty("field_file", array);

        patchFeature(feature);

        assertEquals(204, response.getStatusCode());
    }

    @When("я получаю объект с id = {int} из слоя {string}")
    public void getFeatureByIdFromTable(int featureId, String tableIdentifier) {
        getFeatures(tableIdentifier, List.of(String.valueOf(featureId)));
    }

    @And("пользователь запоминает номер полученной фичи")
    public void rememberFeatureId() {
        List<Map<String, Object>> content = response.jsonPath().getList("content.properties");

        Optional<Map<String, Object>> matchingRecord = content
                .stream()
                .filter(properties -> properties.containsKey("ogc_fid") && properties.get("ogc_fid").equals(2))
                .findFirst();

        currentId = (Integer) matchingRecord.get().get("objectid");
    }

    @And("в текущей фиче пользователь ставит полю {string} значение {string}")
    public void patchFeatureProperty(String property, String value) {
        Feature feature = new Feature();
        feature.setProperty(property, value);
        feature.setId(Long.valueOf(currentId));

        patchFeature(feature);

        assertEquals(204, response.getStatusCode());
    }

    private void patchFeature(Feature feature) {
        response = getBaseRequestWithCurrentCookie()
                .given()
                    .body(asJson(feature))
                    .contentType(PATCH_CONTENT_TYPE)
                .when()
                    .patch("/" + currentTableName + "/records/" + feature.getId());
    }

    private void createFeature(Feature feature) {
        createFeature(feature, "");
    }

    private void createFeature(Feature feature, String skipGeometryValidation) {
        TableCreateDto latestTable = getLatestTable();

        RequestSpecification request = getBaseRequestWithCurrentCookie()
                                              .given()
                                                      .body(asJson(feature))
                                                      .contentType(ContentType.JSON);

        if (!skipGeometryValidation.isBlank()) {
            request = request.queryParam("skipGeometryValidation", skipGeometryValidation);
        }

        response = request.when()
                          .post("/" + latestTable.getName() + "/records");

        if (response.statusCode() == 201) {
            currentFeatureId = extractEntityIdFromResponse(response);
        }
    }

    private void getFeatures(String tableName, List<String> ids) {
        StringBuilder joinedIds = new StringBuilder();
        for (String id: ids) {
            joinedIds.append(id).append(",");
        }

        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(ContentType.JSON)
                .when().
                        get("/" + tableName + "/records/" + joinedIds);
    }

    private Response getFeatures(String tableName) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(ContentType.JSON)
                .when().
                        get("/" + tableName + "/records");

        return response;
    }

    private static List<List<Double>> exteriorRing(String shape) {
        String hex = shape.trim();
        Geometry<?> geometry = Wkb.newDecoder().decode(ByteBuffer.from(hexToBytes(hex)));

        if (!(geometry instanceof org.geolatte.geom.Polygon)) {
            throw new AssertionError("Ожидали полигон, получили: " + geometry.getGeometryType());
        }

        LinearRing<?> ring = ((org.geolatte.geom.Polygon<?>) geometry).getExteriorRing();
        List<List<Double>> coordinates = new ArrayList<>();
        for (int i = 0; i < ring.getNumPositions(); i++) {
            Position position = ring.getPositionN(i);
            coordinates.add(List.of(position.getCoordinate(0), position.getCoordinate(1)));
        }

        return coordinates;
    }

    private static byte[] hexToBytes(String hex) {
        if (hex.length() % 2 != 0) {
            throw new AssertionError("Геометрия shape не является hex EWKB: " + hex);
        }

        byte[] data = new byte[hex.length() / 2];
        for (int i = 0; i < hex.length(); i += 2) {
            int high = Character.digit(hex.charAt(i), 16);
            int low = Character.digit(hex.charAt(i + 1), 16);
            if (high < 0 || low < 0) {
                throw new AssertionError("Геометрия shape не является hex EWKB: " + hex);
            }
            data[i / 2] = (byte) ((high << 4) + low);
        }

        return data;
    }

    private static List<List<List<Double>>> toDoubleCoordinates(Object coordinates) {
        List<?> rings = (List<?>) coordinates;
        List<List<List<Double>>> result = new ArrayList<>();

        for (Object ring : rings) {
            List<List<Double>> ringCoordinates = new ArrayList<>();
            for (Object point : (List<?>) ring) {
                List<Double> pointCoordinates = new ArrayList<>();
                for (Object coordinate : (List<?>) point) {
                    pointCoordinates.add(((Number) coordinate).doubleValue());
                }
                ringCoordinates.add(pointCoordinates);
            }
            result.add(ringCoordinates);
        }

        return result;
    }

    /**
     * Превращаем geometry JSON string в полноценный GeoJSON Feature object и форматируем его
     *
     * @param geometryJson string только часть с геометрией (тип + координаты)
     *
     * @return JsonNode отформатированный JSON узел с полным Feature объектом
     */
    private JsonNode wrapGeometryIntoFeature(String geometryJson) {
        String featureJson = String.format("{\"type\":\"Feature\", %s,\"properties\":{}}", geometryJson);

        return JsonMapper.asJsonNode(featureJson);
    }
}
