package ru.mycrg.acceptance.data_service.features;

import com.fasterxml.jackson.databind.JsonNode;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.JsonMapper;
import ru.mycrg.acceptance.data_service.dto.TableCreateDto;
import ru.mycrg.acceptance.gis_service.dto.LayerCreateDto;
import ru.mycrg.geo_json.Feature;
import ru.mycrg.geo_json.LngLatAlt;
import ru.mycrg.geo_json.Polygon;
import ru.mycrg.geo_json.MultiPolygon;

import java.util.Arrays;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.assertEquals;
import static ru.mycrg.acceptance.Config.PATCH_CONTENT_TYPE;
import static ru.mycrg.acceptance.FeatureBuilder.prepareFeatures;
import static ru.mycrg.acceptance.JsonMapper.asJson;
import static ru.mycrg.acceptance.data_service.datasets.DatasetsStepsDefinitions.currentDatasetIdentifier;

public class FeaturesStepsDefinitions extends BaseStepsDefinitions {

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

    @When("Пользователь пытается добавить сломанную геометрию в текущую таблицу")
    public void createBrokenObjectInCurrentTable() {
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
        createFeature(feature);
    }

    @Then("Объект успешно сохранён в текущей таблице")
    public void checkCreatedFeature() {
        Feature firstFeature = scenarioFeatures.get(0);

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

        getFeatures(consumer.getTableName(), featureIds);

        List<Map<String, Object>> featuresProps = response.jsonPath()
                                                          .getList("properties");

        Map<String, Object> firstFeature = featuresProps.get(0);
        // field_1 должно быть числом, а не строкой - это ошибка, но времени на её исправление нет.
        // Фронт берет фичи с геосервера(он отдает правильно), пэтому пока пропускаем.
        assertEquals("935.06275092", firstFeature.get("field_1"));
        assertEquals("935.06275092", firstFeature.get("field_2"));
        assertEquals("1", firstFeature.get("field_3"));
        assertEquals("1", firstFeature.get("field_4"));
        assertEquals(1, firstFeature.get("objectid"));

        Map<String, Object> secondFeature = featuresProps.get(1);
        assertEquals("530.84226136", secondFeature.get("field_1"));
        assertEquals("530.84226136", secondFeature.get("field_2"));
        assertEquals("2", secondFeature.get("field_3"));
        assertEquals("20", secondFeature.get("field_4"));
        assertEquals(2, secondFeature.get("objectid"));

        Map<String, Object> thirdFeature = featuresProps.get(2);
        assertEquals("1195.79501826", thirdFeature.get("field_1"));
        assertEquals("1195.79501826", thirdFeature.get("field_2"));
        assertEquals("3", thirdFeature.get("field_3"));
        assertEquals("30", thirdFeature.get("field_4"));
        assertEquals(3, thirdFeature.get("objectid"));
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
    
    private void patchFeature(Feature feature) {
        TableCreateDto latestTable = getLatestTable();
        
        response = getBaseRequestWithCurrentCookie()
                .given()
                    .body(asJson(feature))
                    .contentType(PATCH_CONTENT_TYPE)
                .when()
                    .patch("/" + latestTable.getName() + "/records/" + feature.getId());
    }

    private void createFeature(Feature feature) {
        TableCreateDto latestTable = getLatestTable();

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(asJson(feature)).
                        contentType(ContentType.JSON)
                .when().
                        post("/" + latestTable.getName() + "/records");
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

    /**
     * Превращаем geometry JSON string в полноценный GeoJSON Feature object и форматируем его
     *
     * @param geometryJson string только часть с геометрией (тип + координаты)
     *
     * @return JsonNode отформатированный JSON узел с полным Feature объектом
     */
    private JsonNode wrapGeometryIntoFeature(String geometryJson) {
        String featureJson = String.format("{\"type\":\"Feature\",\"properties\":{}, %s}", geometryJson);
        return JsonMapper.asJsonNode(featureJson);
    }
}
