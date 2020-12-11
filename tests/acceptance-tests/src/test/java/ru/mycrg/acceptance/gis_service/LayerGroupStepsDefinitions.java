package ru.mycrg.acceptance.gis_service;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.gis_service.dto.LayerGroupCreateDto;

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

public class LayerGroupStepsDefinitions extends BaseStepsDefinitions {

    public static LayerGroupCreateDto layerGroupDto;
    public static Integer layerGroupId;
    public static Integer parentLayerGroupId;

    @Override
    public RequestSpecification getBaseRequest() {
        return super.getBaseRequest().basePath("/projects/" + projectId + "/groups");
    }

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie().basePath("/projects/" + projectId + "/groups");
    }

    @Override
    public Integer getCurrentId() {
        return layerGroupId;
    }

    @Override
    public void setCurrentId(Integer id) {
        layerGroupId = id;
    }

    @When("Пользователь делает запрос на создание группы слоев проекта {string}, {string}")
    public void createLayerGroup(String title, String position) {
        layerGroupDto = new LayerGroupCreateDto(generateString(title), Integer.parseInt(generateString(position)));

        super.createEntity(layerGroupDto);
    }

    @And("Сервер передает ID группы слоев проекта в ответе")
    public void extractAndSetLayerGroupIdFromBody() {
        super.extractAndSetEntityIdFromBody();

        layerGroupPool.put(layerGroupId, layerGroupDto);
    }

    @When("Пользователь делает запрос на текущую группу слоев проекта")
    public void getCurrentLayerGroupInfoById() {
        super.getCurrentEntityInfoById();
    }

    @And("Поля группы слоев проекта совпадают с переданными")
    public void checkLayerGroupData() {
        jsonPath = response.jsonPath();

        assertThat(jsonPath.get("title"), equalTo(layerGroupDto.getTitle()));
        assertThat(jsonPath.get("position"), is(layerGroupDto.getPosition()));
    }

    @Given("Существует группа слоев проекта {string}, {string}")
    public void initLayerGroup(String title, String position) {
        if (isExactLayerGroupExistInPool(title)) {
            makeExactLayerGroupAsCurrent(title);
        } else if (!layerGroupPool.isEmpty()) {
            makeLastAvailableLayerGroupAsCurrent();
        } else {
            createLayerGroup(title, position);
            assertEquals(SC_CREATED, response.getStatusCode());
            extractAndSetLayerGroupIdFromBody();
        }
    }

    @When("Пользователь делает запрос на создание группы слоев проекта c указанием родителя {string}, {string}")
    public void createLayerGroupWithParent(String title, String position) {
        layerGroupDto = new LayerGroupCreateDto(generateString(title),
                                                Integer.parseInt(generateString(position)),
                                                Long.valueOf(layerGroupId));
        parentLayerGroupId = layerGroupId;

        super.createEntity(layerGroupDto);
    }

    @And("Поля группы слоев проекта совпадают с переданными, включая информацию о родителе")
    public void checkLayerGroupDataWithParent() {
        jsonPath = response.jsonPath();

        assertThat(jsonPath.get("title"), equalTo(layerGroupDto.getTitle()));
        assertThat(jsonPath.get("position"), is(layerGroupDto.getPosition()));
        assertThat(jsonPath.get("parent"), is(parentLayerGroupId));
    }

    @When("Пользователь делает запрос на удаление текущей группы слоев текущего проекта")
    public void deleteLayerGroup() {
        super.deleteEntity();

        layerGroupPool.remove(getCurrentId());
    }

    @And("В ответе на удаление группы слоев проекта есть упоминание ID")
    public void checkIdInResponse() {
        super.checkIdInResponse();
    }

    @When("Пользователь делает запрос на удаление родительской группы слоев текущего проекта")
    public void deleteParentLayerGroup() {
        super.deleteEntity(parentLayerGroupId);

        layerGroupPool.remove(parentLayerGroupId);
    }

    @When("Пользователь делает запрос на родительскую группу слоев")
    public void getParentLayerGroupInfoById() {
        super.getCurrentEntityInfoById(parentLayerGroupId.toString());
    }

    @And("Представление группы слоев проекта корректно")
    public void checkLayerGroupDataStructure() {
        Map<String, String> presentedData = response
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        extract().jsonPath().
                        getMap("");

        assertTrue(presentedData.containsKey("title"));
        assertTrue(presentedData.containsKey("position"));
        assertTrue(presentedData.containsKey("enabled"));
        assertTrue(presentedData.containsKey("transparency"));
        assertTrue(presentedData.containsKey("expanded"));
    }

    @When("Пользователь делает запрос на все группы слоев организации")
    public void getAllLayerGroups() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get();
    }

    @Given("Существуют группы слоев проектов")
    public void createMultipleLayerGroups(DataTable dataTable) {
        List<List<String>> data = dataTable.asLists();
        for (List<String> layerGroup: data) {
            String title = layerGroup.get(0);
            String position = layerGroup.get(1);

            createLayerGroup(title, position);
        }
    }

    @When("Пользователь делает запрос на обновление полей групп слоев проекта {string}, {string}")
    public void updateLayerGroup(String newTitle, String newPosition) {
        layerGroupDto = mapToLayerGroupDto(newTitle, newPosition);

        String payload = gson.toJson(layerGroupDto);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(payload).
                        contentType("application/merge-patch+json")
                .when().
                        patch("" + layerGroupId);
    }

    @Then("Поля группы слоев проекта совпадают с переданными {string}, {int}")
    public void checkLayerGroupData(String newTitle, Integer newPosition) {
        jsonPath = response.jsonPath();

        assertThat(jsonPath.get("title"), equalTo(newTitle));
        assertThat(jsonPath.get("position"), is(newPosition));
    }

    @And("В ответе на удаление родительской группы слоев проекта есть упоминание ID")
    public void checkIdInResponseInParentLayerGroup() {
        super.checkIdInResponse(parentLayerGroupId.toString());
    }

    private LayerGroupCreateDto mapToLayerGroupDto(String title, String position) {
        return new LayerGroupCreateDto(generateString(title), Integer.parseInt(generateString(position)));
    }

    private void makeLastAvailableLayerGroupAsCurrent() {
        layerGroupPool.entrySet().stream()
                      .skip(layerGroupPool.size() - 1)
                      .findFirst()
                      .ifPresent(entry -> {
                          layerGroupId = entry.getKey();
                          layerGroupDto = entry.getValue();
                      });
    }

    private void makeExactLayerGroupAsCurrent(String title) {
        layerGroupPool.entrySet().stream()
                      .filter(entry -> entry.getValue().getTitle().equals(title))
                      .findFirst()
                      .ifPresent(entry -> {
                          layerGroupId = entry.getKey();
                          layerGroupDto = entry.getValue();
                      });
    }

    private boolean isExactLayerGroupExistInPool(String title) {
        return layerGroupPool.values().stream()
                             .anyMatch(dto -> title.equals(dto.getTitle()));
    }
}
