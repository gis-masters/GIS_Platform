package ru.mycrg.acceptance.gis_service;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.gis_service.dto.BaseMapCreateDto;

import java.util.List;
import java.util.Map;

import static org.apache.http.HttpStatus.SC_CREATED;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static ru.mycrg.acceptance.gis_service.ProjectStepsDefinitions.projectId;

public class BaseMapStepsDefinitions extends BaseStepsDefinitions {

    public static BaseMapCreateDto baseMapDto;
    public static Integer baseMapId;

    @Override
    public RequestSpecification getBaseRequest() {
        return super.getBaseRequest().basePath("/projects/" + projectId + "/basemaps");
    }

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie().basePath("/projects/" + projectId + "/basemaps");
    }

    @Override
    public Integer getCurrentId() {
        return baseMapId;
    }

    @Override
    public void setCurrentId(Integer id) {
        baseMapId = id;
    }

    @And("Сервер передает ID подложки проекта в ответе")
    public void extractAndSetProjectBaseMapIdFromBody() {
        super.extractAndSetEntityIdFromBody();

        projectBaseMapsPool.put(baseMapId, baseMapDto);
    }

    @When("Пользователь делает запрос на текущую подложку")
    public void getCurrentProjectBaseMapInfoById() {
        super.getCurrentEntityInfoById();
    }

    @And("Поля подложки проекта совпадают с переданными")
    public void checkProjectBaseMapData() {
        jsonPath = response.jsonPath();

        assertThat(jsonPath.get("baseMapId"), is(Math.toIntExact(baseMapDto.getBaseMapId())));
        assertThat(jsonPath.get("title"), equalTo(baseMapDto.getTitle()));
        assertThat(jsonPath.get("position"), is(baseMapDto.getPosition()));
    }

    @When("Пользователь делает запрос на создание подложки проекта {string}, {string}, {string}")
    public void createProjectBaseMap(String baseMapId, String title, String position) {
        baseMapDto = new BaseMapCreateDto(Long.parseLong(generateString(baseMapId)),
                                          generateString(title),
                                          Integer.parseInt(generateString(position)));

        super.createEntity(baseMapDto);
    }

    @When("Пользователь делает запрос на текущую подложку {string}")
    public void checkExactProjectBaseMap(String baseMapId) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        get("/" + baseMapId);
    }

    @Given("Существует подложкa проекта {string}, {string}, {string}")
    public void isProjectBaseMapExist(String baseMapId, String title, String position) {
        if (isProjectBaseMapExistInPool(title)) {
            makeExactProjectBaseMapAsCurrent(title);
        } else if (!projectBaseMapsPool.isEmpty()) {
            makeLastAvailableProjectBaseMapAsCurrent();
        } else {
            createProjectBaseMap(baseMapId, title, position);
            assertEquals(SC_CREATED, response.getStatusCode());
            extractAndSetProjectBaseMapIdFromBody();
        }
    }

    @When("Пользователь делает повторный запрос на создание подложки проекта")
    public void createProjectBaseMapAgain() {
        String payload = gson.toJson(baseMapDto);
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(payload).
                        contentType(ContentType.JSON)
                .when().
                        post("");
    }

    @When("Пользователь делает запрос на удаление текущей подложки текущего проекта")
    public void deleteProjectBaseMap() {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        delete("/" + baseMapDto.getBaseMapId());

        projectBaseMapsPool.remove(baseMapId);
    }

    @And("Представление подложки проекта корректно")
    public void isProjectBaseMapPresentedCorrectly() {
        Map<String, String> presentedData = response
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        extract().jsonPath().
                        getMap("");

        assertTrue(presentedData.containsKey("baseMapId"));
        assertTrue(presentedData.containsKey("title"));
        assertTrue(presentedData.containsKey("position"));
    }

    @Given("Существуют подложки проектов")
    public void createMultipleProjectBaseMaps(DataTable dataTable) {
        List<List<String>> data = dataTable.asLists();
        for (List<String> basemap: data) {
            String baseMapId = basemap.get(0);
            String title = basemap.get(1);
            String position = basemap.get(2);

            createProjectBaseMap(baseMapId, title, position);
        }
    }

    @When("Пользователь делает запрос на обновление полей подложки проекта {string}, {string}, {string}")
    public void updateProjectBaseMap(String newBaseMapId, String newTitle, String newPosition) {
        baseMapDto = mapToProjectBaseMapDto(newBaseMapId, newTitle, newPosition);

        String payload = gson.toJson(baseMapDto);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(payload).
                        contentType("application/merge-patch+json")
                .when().
                        patch("" + baseMapId);
    }

    @And("Поля подложки проекта совпадают с переданными {int}, {string}, {int}")
    public void checkProjectBaseMapData(Integer newBaseMapId, String newTitle, Integer newPosition) {
        jsonPath = response.jsonPath();

        assertEquals(newBaseMapId, jsonPath.get("baseMapId"));
        assertEquals(newTitle, jsonPath.get("title"));
        assertEquals(newPosition, jsonPath.get("position"));
    }

    @And("В ответе на удаление подложки проекта есть упоминание ID")
    public void checkIdInResponse() {
        super.checkIdInResponse();
    }

    @When("Администратор делает запрос с сортировкой по {string} и {string} на все подложки проекта")
    public void getAllProjectBaseMapsSorted(String sortingType, String sortingDirection) {
        super.getAllEntitiesSorted(sortingType, sortingDirection);
    }

    private BaseMapCreateDto mapToProjectBaseMapDto(String baseMapId, String title, String position) {
        return new BaseMapCreateDto(Long.parseLong(generateString(baseMapId)), generateString(title),
                                    Integer.parseInt(generateString(position)));
    }

    private boolean isProjectBaseMapExistInPool(String title) {
        return projectBaseMapsPool.values().stream()
                                  .anyMatch(dto -> title.equals(dto.getTitle()));
    }

    private Response createProjectBaseMap(BaseMapCreateDto dto) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(dto)).
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        post("");

        return response;
    }

    private void makeExactProjectBaseMapAsCurrent(String title) {
        projectBaseMapsPool.entrySet().stream()
                           .filter(entry -> entry.getValue().getTitle().equals(title))
                           .findFirst()
                           .ifPresent(entry -> {
                               baseMapId = entry.getKey();
                               baseMapDto = entry.getValue();
                           });
    }

    private void makeLastAvailableProjectBaseMapAsCurrent() {
        projectBaseMapsPool.entrySet().stream()
                           .skip(projectBaseMapsPool.size() - 1)
                           .findFirst()
                           .ifPresent(entry -> {
                               baseMapId = entry.getKey();
                               baseMapDto = entry.getValue();
                           });
    }
}
