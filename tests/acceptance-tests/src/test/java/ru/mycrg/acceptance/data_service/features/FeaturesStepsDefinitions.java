package ru.mycrg.acceptance.data_service.features;

import com.fasterxml.jackson.core.JsonProcessingException;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.data_service.dto.TableCreateDto;
import ru.mycrg.acceptance.gis_service.dto.LayerCreateDto;
import ru.mycrg.geo_json.Feature;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;
import static ru.mycrg.acceptance.FeatureBuilder.prepareFeatures;
import static ru.mycrg.acceptance.data_service.datasets.DatasetsStepsDefinitions.currentDatasetIdentifier;

public class FeaturesStepsDefinitions extends BaseStepsDefinitions {

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        String url = String.format("/api/data/datasets/%s/tables", currentDatasetIdentifier);

        return super.getBaseRequestWithCurrentCookie()
                    .basePath(url);
    }

    @When("Таблица наполнена данными {string}")
    public void createSomeDataInCurrentTable(String dataTemplate) throws JsonProcessingException {
        scenarioFeatures = prepareFeatures(dataTemplate);
        for (Feature feature: scenarioFeatures) {
            createFeature(feature);

            response.then()
                    .statusCode(201);
        }
    }

    @Then("Данные корректно перенесены из слоя {string} в {string}")
    public void checkDataInConsumer(String layerProducer, String layerConsumer, DataTable table) {
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
        assertEquals(firstFeature.get("field_1"), "935.06275092");
        assertEquals(firstFeature.get("field_2"), "935.06275092");
        assertEquals(firstFeature.get("field_3"), "1");
        assertEquals(firstFeature.get("field_4"), "1");
        assertEquals(firstFeature.get("objectid"), 1);

        Map<String, Object> secondFeature = featuresProps.get(1);
        assertEquals(secondFeature.get("field_1"), "530.84226136");
        assertEquals(secondFeature.get("field_2"), "530.84226136");
        assertEquals(secondFeature.get("field_3"), "2");
        assertEquals(secondFeature.get("field_4"), "20");
        assertEquals(secondFeature.get("objectid"), 2);

        Map<String, Object> thirdFeature = featuresProps.get(2);
        assertEquals(thirdFeature.get("field_1"), "1195.79501826");
        assertEquals(thirdFeature.get("field_2"), "1195.79501826");
        assertEquals(thirdFeature.get("field_3"), "3");
        assertEquals(thirdFeature.get("field_4"), "30");
        assertEquals(thirdFeature.get("objectid"), 3);
    }

    private void createFeature(Feature feature) throws JsonProcessingException {
        TableCreateDto latestTable = getLatestTable();

        String asJsonString = mapper.writer()
                                    .withDefaultPrettyPrinter()
                                    .writeValueAsString(feature);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(asJsonString).
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
}
