package ru.mycrg.acceptance.data_service;

import io.cucumber.java.en.And;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static ru.mycrg.acceptance.data_service.FilesStepDefinitions.currentFileId;
import static ru.mycrg.acceptance.gis_service.LayerStepDefinitions.layerId;

public class LayersStepsDefinitions extends BaseStepsDefinitions {

    @Override
    public RequestSpecification getBaseRequest() {
        return super.getBaseRequest().basePath("/projects");
    }

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie().basePath("/projects");
    }

    @When("Пользователь делает запрос на получение проектов и слоёв связанных с файлом")
    public void getRelatedToDocumentsProjectsAndLayers() {

        Map<String, Object> queryParams = new HashMap<>() {{
            put("fileId", currentFileId);
        }};

        response = getBaseRequestWithCurrentCookie()
                .given().
                        queryParams(queryParams).
                        contentType(ContentType.JSON)
                .when().
                       get("/find-related-to-file-layers")
                .then().
                        log().ifError().
                        extract().response();
    }

    @And("Сервер возвращает список слоёв и проектов связанных с растровым файлом")
    public void checkResponseWithLayersAndProjects() {
        List<Object> layers = response.jsonPath().getList("layer");
        List<Object> projects = response.jsonPath().getList("project");

        assertEquals(1, layers.size());
        assertEquals(1, projects.size());

        Integer currentLayerId = (Integer) response.jsonPath().getList("layer.id").get(0);

        assertEquals(currentLayerId, layerId);
    }
}
