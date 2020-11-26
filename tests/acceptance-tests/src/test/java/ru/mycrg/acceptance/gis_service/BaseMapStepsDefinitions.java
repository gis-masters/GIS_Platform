package ru.mycrg.acceptance.gis_service;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.gis_service.dto.BaseMapCreateDto;

import java.util.Map;

import static org.apache.http.HttpStatus.SC_CREATED;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertEquals;
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
    public void extractAndSetProjectIdFromBody() {
        super.extractAndSetEntityIdFromBody();
    }

    @When("Пользователь делает запрос на текущую подложку")
    public void getCurrentProjectBaseMapInfoById() {
        super.getCurrentEntityInfoById();
    }

    @And("Поля подложки проекта совпадают с переданными")
    public void isProjectBaseMapDataIsCorrect() {
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

        String payload = gson.toJson(baseMapDto);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(payload).
                        contentType(ContentType.JSON)
                .when().
                        post("");
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
        if (takeAnyProjectBaseMapFromPoll()) {
            return;
        }

        if (!isProjectBaseMapExistInPool(generateString(baseMapId))) {
            BaseMapCreateDto dto = mapToProjectBaseMapDto(baseMapId, title, position);
            Response createResponse = createProjectBaseMap(dto);

            assertEquals(SC_CREATED, createResponse.getStatusCode());

            response = createResponse;
            Integer id = extractEntityIdFromResponse(createResponse);

            baseMapDto = dto;
            setCurrentId(id);

            projectBaseMapsPool.put(id, dto);
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
    }

    @And("В ответе на удаление подложки проекта есть упоминание ID")
    public void checkIdInResponse() {
        super.checkIdInResponse();
    }

    private BaseMapCreateDto mapToProjectBaseMapDto(String baseMapId, String title, String position) {
        return new BaseMapCreateDto(Long.parseLong(generateString(baseMapId)), generateString(title),
                                    Integer.parseInt(generateString(position)));
    }

    private boolean isProjectBaseMapExistInPool(String title) {
        return projectBaseMapsPool.values().stream()
                                  .anyMatch(dto -> title.equals(dto.getTitle()));
    }

    private boolean takeAnyProjectBaseMapFromPoll() {
        if (!projectBaseMapsPool.isEmpty()) {
            for (Map.Entry<Integer, BaseMapCreateDto> entry: projectBaseMapsPool.entrySet()) {
                baseMapId = entry.getKey();
                baseMapDto = entry.getValue();

                return true;
            }
        }

        return false;
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
}
