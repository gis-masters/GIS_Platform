package ru.mycrg.acceptance.gis_service;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.path.json.JsonPath;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.gis_service.dto.BaseMapCreateDto;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static java.lang.Thread.sleep;
import static org.apache.http.HttpStatus.SC_CREATED;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.*;
import static ru.mycrg.acceptance.Config.PATCH_CONTENT_TYPE;
import static ru.mycrg.acceptance.auth_service.OrganizationStepsDefinitions.MAX_RETRY_ATTEMPT;
import static ru.mycrg.acceptance.data_service.InitialBaseMapsStepsDefinitions.baseMapId;
import static ru.mycrg.acceptance.gis_service.ProjectStepsDefinitions.projectId;

public class BaseMapStepsDefinitions extends BaseStepsDefinitions {

    public static BaseMapCreateDto projectBasemapDto;
    public static Integer projectBasemapId;

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
        return projectBasemapId;
    }

    @Override
    public void setCurrentId(Integer id) {
        projectBasemapId = id;
    }

    @And("Сервер передает ID подложки проекта в ответе")
    public void extractAndSetProjectBaseMapIdFromBody() {
        super.extractAndSetEntityIdFromBody();

        projectBaseMapsPool.put(projectBasemapId, projectBasemapDto);
    }

    @When("Пользователь делает запрос на текущую подложку проекта")
    public void getCurrentProjectBaseMapInfoById() {
        super.getCurrentEntity();
    }

    @When("Пользователь делает запрос на удаленную подложку проекта")
    public void getDeletedProjectBaseMapInfoById() {
        try {
            int currentAttempt = 0;
            do {
                currentAttempt++;
                System.out.println("attempt getDeletedProjectBaseMapInfoById " + currentAttempt);

                super.getCurrentEntity();

                if (response.getStatusCode() == 404) {
                    return;
                }

                sleep(800);
            } while (currentAttempt < MAX_RETRY_ATTEMPT);

            throw new RuntimeException("Current Project BaseMap not deleted!");
        } catch (InterruptedException e) {
            throw new RuntimeException("Current Project BaseMap not deleted!");
        }
    }

    @And("Поля подложки проекта совпадают с переданными")
    public void checkProjectBaseMapData() {
        jsonPath = response.jsonPath();

        assertThat(jsonPath.get("baseMapId"), is(Math.toIntExact(projectBasemapDto.getBaseMapId())));
        assertThat(jsonPath.get("title"), equalTo(projectBasemapDto.getTitle()));
        assertThat(jsonPath.get("position"), is(projectBasemapDto.getPosition()));
    }

    @When("Пользователь делает запрос на создание подложки проекта {string}, {string}, {string}")
    public void createProjectBaseMap(String baseMapId, String title, String position) {
        projectBasemapDto = new BaseMapCreateDto(Long.parseLong(generateString(baseMapId)),
                                                 generateString(title),
                                                 Integer.parseInt(generateString(position)));

        super.createEntity(projectBasemapDto);
    }

    @Given("Существует подложкa проекта {string}, {string}, {string}")
    public void initProjectBasemap(String baseMapId, String title, String position) {
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

    @Given("Существует подложкa ссылающаяся на подложку источник {string}")
    public void initBasemapLinkedToCurrentSourceSubstrate(String title) {
        initProjectBasemap(baseMapId.toString(), title, "10");
    }

    @When("Пользователь делает повторный запрос на создание подложки проекта")
    public void createProjectBaseMapAgain() {
        super.createEntity(projectBasemapDto);
    }

    @When("Пользователь делает запрос на удаление текущей подложки текущего проекта")
    public void deleteProjectBaseMap() {
        super.deleteEntityById(projectBasemapId);

        projectBaseMapsPool.remove(projectBasemapId);
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
        projectBasemapDto = mapToProjectBaseMapDto(newBaseMapId, newTitle, newPosition);

        String payload = gson.toJson(projectBasemapDto);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(payload).
                        contentType(PATCH_CONTENT_TYPE)
                .when().
                        patch("" + projectBasemapId);
    }

    @When("Пользователь делает запрос на существующую подложку для проекта")
    public void getBasemapsByProject() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get();
    }

    @Then("В проект подключены pluggable подложки")
    public void checkResponseContainsBasemap() {
        getBasemapsByProject();

        JsonPath path = response.jsonPath();
        List<Object> baseMapList = path.getList("");
        assertFalse(baseMapList.isEmpty());
    }

    @Then("В подложке проставлено поле position и равно значению {string}")
    public void checkBaseMapHasPosition(String position) {
        JsonPath path = response.jsonPath();

        List<Map<String, Object>> baseMapList = path.getList("");
        assertFalse(baseMapList.isEmpty());

        Optional<Map<String, Object>> currentBasemapOpt = baseMapList.stream()
                                                                     .filter(basemap -> basemap.containsKey(
                                                                             "baseMapId"))
                                                                     .filter(basemap -> baseMapId.equals(
                                                                             basemap.get("baseMapId")))
                                                                     .findAny();

        assertTrue(currentBasemapOpt.isPresent());

        Map<String, Object> basemap = currentBasemapOpt.get();

        assertTrue(basemap.containsKey("position"));
        assertEquals(Integer.parseInt(position), basemap.get("position"));
    }

    @And("Поля подложки проекта совпадают с переданными {int}, {string}, {int}")
    public void checkProjectBaseMapData(Integer newBaseMapId, String newTitle, Integer newPosition) {
        jsonPath = response.jsonPath();

        assertEquals(newBaseMapId, jsonPath.get("baseMapId"));
        assertEquals(newTitle, jsonPath.get("title"));
        assertEquals(newPosition, jsonPath.get("position"));
    }

    @And("В ответе на удаление подложки проекта есть упоминание ID")
    public void checkCurrentIdInResponse() {
        super.checkCurrentIdInResponse();
    }

    @When("Администратор делает запрос с сортировкой по {string} и {string} на все подложки проекта")
    public void getAllProjectBaseMapsSorted(String sortingType, String sortingDirection) {
        super.get1000EntitiesSorted(sortingType, sortingDirection);
    }

    private BaseMapCreateDto mapToProjectBaseMapDto(String baseMapId, String title, String position) {
        return new BaseMapCreateDto(Long.parseLong(generateString(baseMapId)), generateString(title),
                                    Integer.parseInt(generateString(position)));
    }

    private boolean isProjectBaseMapExistInPool(String title) {
        return projectBaseMapsPool.values().stream()
                                  .anyMatch(dto -> title.equals(dto.getTitle()));
    }

    private void makeExactProjectBaseMapAsCurrent(String title) {
        projectBaseMapsPool.entrySet().stream()
                           .filter(entry -> entry.getValue().getTitle().equals(title))
                           .findFirst()
                           .ifPresent(entry -> {
                               projectBasemapId = entry.getKey();
                               projectBasemapDto = entry.getValue();
                           });
    }

    private void makeLastAvailableProjectBaseMapAsCurrent() {
        projectBaseMapsPool.entrySet().stream()
                           .skip(projectBaseMapsPool.size() - 1)
                           .findFirst()
                           .ifPresent(entry -> {
                               projectBasemapId = entry.getKey();
                               projectBasemapDto = entry.getValue();
                           });
    }
}
