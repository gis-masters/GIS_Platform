package ru.mycrg.acceptance.data_service.features;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.gis_service.dto.LayerCreateDto;
import ru.mycrg.data_service_contract.dto.FeaturesCopyModel;
import ru.mycrg.data_service_contract.dto.ResourceQualifierDto;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static ru.mycrg.acceptance.data_service.datasets.DatasetsStepsDefinitions.currentDatasetIdentifier;

public class MultipleCopyFeaturesStepsDefinitions extends BaseStepsDefinitions {

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie()
                    .basePath("/api/data/records/copy");
    }

    @When("Пользователь выполняет массовое копирование объектов из слоя {string} в {string}")
    public void createSomeDataInCurrentTable(String layerProducer, String layerConsumer, DataTable table) {
        // Features
        List<String> data = table.asList(String.class);
        String idsAsString = data.get(1);
        List<Long> featureIds = Arrays.stream(idsAsString.split(", "))
                                      .map(Long::valueOf)
                                      .collect(Collectors.toList());

        FeaturesCopyModel featuresCopyModel = new FeaturesCopyModel();
        featuresCopyModel.setFeatureIds(featureIds);

        // Producer
        LayerCreateDto producer = getLayerByTitle(layerProducer);
        featuresCopyModel.setSource(new ResourceQualifierDto(currentDatasetIdentifier, producer.getTableName()));

        // Consumer
        LayerCreateDto consumer = getLayerByTitle(layerConsumer);
        featuresCopyModel.setTarget(new ResourceQualifierDto(currentDatasetIdentifier, consumer.getTableName()));

        // Action
        copy(featuresCopyModel);

        response.then().
                log().ifError().
                statusCode(200);
    }

    private void copy(FeaturesCopyModel featuresCopyModel) {
        String json = gson.toJson(featuresCopyModel);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(json).
                        contentType(ContentType.JSON)
                .when().
                        post();
    }
}
