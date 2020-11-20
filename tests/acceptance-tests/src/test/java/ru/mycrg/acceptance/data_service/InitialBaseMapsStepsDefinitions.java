package ru.mycrg.acceptance.data_service;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.data_service.dto.InitialBaseMapCreateDto;

import java.util.List;
import java.util.Map;

import static org.apache.http.HttpStatus.SC_CREATED;
import static org.apache.http.HttpStatus.SC_OK;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class InitialBaseMapsStepsDefinitions extends BaseStepsDefinitions {

    public static Integer baseMapId;
    public static InitialBaseMapCreateDto baseMapDto;

    public Integer getCurrentId() {
        return baseMapId;
    }

    public void setCurrentId(Integer id) {
        baseMapId = id;
    }

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie().basePath("/api/data/basemaps/");
    }

    @Override
    public RequestSpecification getBaseRequest() {
        return super.getBaseRequest().basePath("/api/data/basemaps/");
    }

    @When("Пользователь делает запрос на создание подложки")
    public void createBaseMap(DataTable dataTable) {
        baseMapDto = mapToBaseMapDto(dataTable);

        String payload = gson.toJson(baseMapDto);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(payload).
                        contentType(ContentType.JSON)
                .when().
                        post("");
    }

    @When("Пользователь делает запрос на указанную подложку")
    public void getExactBaseMap() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("" + baseMapId);
    }

    @And("Поля подложки совпадают с переданными")
    public void isBaseMapDataCorrect() {
        jsonPath = response.jsonPath();

        assertEquals(jsonPath.get("name"), baseMapDto.getName());
        assertEquals(jsonPath.get("title"), baseMapDto.getTitle());
        assertEquals(jsonPath.get("thumbnailUrn"), baseMapDto.getThumbnailUrn());
        assertEquals(jsonPath.get("type"), baseMapDto.getType());
        assertEquals(jsonPath.get("url"), baseMapDto.getUrl());
        assertEquals(jsonPath.get("layerName"), baseMapDto.getLayerName());
        assertEquals(jsonPath.get("style"), baseMapDto.getStyle());
        assertEquals(jsonPath.get("projection"), baseMapDto.getProjection());
        assertEquals(jsonPath.get("format"), baseMapDto.getFormat());
        assertEquals(jsonPath.get("size"), baseMapDto.getSize());
        assertEquals(jsonPath.get("resolution"), baseMapDto.getResolution());
        assertEquals(jsonPath.get("matrixIds"), baseMapDto.getMatrixIds());

        baseMapsPool.put(baseMapId, baseMapDto);
    }

    @When("Пользователь делает запрос на все подложки организации")
    public void getAllBaseMaps() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/?size=1000");
    }

    @Given("Существует подложка")
    public void checkBaseMap(DataTable dataTable) {
        String name = replaceString(dataTable.asList().get(0));

        if (!isBaseMapExistInPool(name)) {
            InitialBaseMapCreateDto dto = mapToBaseMapDto(dataTable);
            Response createResponse = createBaseMap(dto);

            assertEquals(SC_CREATED, createResponse.getStatusCode());

            response = createResponse;
            Integer id = extractIdFromLocation(createResponse);

            baseMapId = id;
            baseMapDto = dto;
            baseMapsPool.put(id, dto);
        }
    }

    @When("Пользователь делает запрос на обновление полей подложки")
    public void updateExactBaseMap(DataTable dataTable) {
        baseMapDto = mapToBaseMapDto(dataTable);

        String payload = gson.toJson(baseMapDto);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(payload).
                        contentType(ContentType.JSON)
                .when().
                        patch("" + baseMapId);
    }

    @And("Поля подложки совпадают с переданными {string}, {string}, {string}, {string}")
    public void checkBaseMap(String newName, String newTitle, String newThumbnailUrn, String newType) {
        jsonPath = response.jsonPath();

        assertEquals(jsonPath.get("name"), newName);
        assertEquals(jsonPath.get("title"), newTitle);
        assertEquals(jsonPath.get("thumbnailUrn"), newThumbnailUrn);
        assertEquals(jsonPath.get("type"), newType);
    }

    @When("Пользователь делает запрос на удаление подложки")
    public void deleteExactBaseMap() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        delete("" + baseMapId);

        baseMapsPool.remove(baseMapId);
    }

    @And("Представление подложки корректно")
    public void isBaseMapPresentedCorrectly() {
        Map<String, String> presentedData = response
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        extract().jsonPath().
                        getMap("");

        assertTrue(presentedData.containsKey("name"));
        assertTrue(presentedData.containsKey("title"));
        assertTrue(presentedData.containsKey("thumbnailUrn"));
        assertTrue(presentedData.containsKey("type"));
        assertTrue(presentedData.containsKey("url"));
        assertTrue(presentedData.containsKey("layerName"));
        assertTrue(presentedData.containsKey("style"));
        assertTrue(presentedData.containsKey("projection"));
        assertTrue(presentedData.containsKey("format"));
        assertTrue(presentedData.containsKey("size"));
        assertTrue(presentedData.containsKey("resolution"));
        assertTrue(presentedData.containsKey("matrixIds"));
        assertTrue(presentedData.containsKey("createdAt"));
        assertTrue(presentedData.containsKey("lastModified"));
        assertTrue(presentedData.containsKey("_links"));
    }

    @And("Сервер передает ID созданной подложки")
    public void extractBaseMapIdFromLocation() {
        baseMapId = extractIdFromLocation();
    }

    @When("Администратор делает запрос с сортировкой по {string} и {string} на все подложки")
    public void getAllBaseMapsSorted(String sortingType, String sortingDirection) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(String.format("?sort=%s,%s&%s", sortingType, sortingDirection, "size=1000"));
    }

    @And("Количество страниц подложек {string} пропорционально {string}")
    public void checkBaseMapsPagesCount(String checkType, String entitiesPerPage) {
        super.checkPagesCount(checkType, entitiesPerPage);
    }

    @And("На всех страницах подложек {string} есть {string}")
    public void isBaseMapsOnPages(String checkType, String entitiesPerPage) {
        super.isSomethingOnPages(checkType, entitiesPerPage);
    }

    private boolean isBaseMapExistInPool(String name) {
        return baseMapsPool
                .values().stream()
                .anyMatch(dto -> name.equals(dto.getName()));
    }

    //TODO: Переделать создание объектов
    private InitialBaseMapCreateDto mapToBaseMapDto(DataTable dataTable) {
        List<String> data = dataTable.asList();
        switch (data.size()) {
            case 4:
                return new InitialBaseMapCreateDto(replaceString(data.get(0)), replaceString(data.get(1)),
                                                   replaceString(data.get(2)), replaceString(data.get(3)));
            case 12:
                return new InitialBaseMapCreateDto(replaceString(data.get(0)), replaceString(data.get(1)),
                                                   replaceString(data.get(2)), replaceString(data.get(3)),
                                                   replaceString(data.get(4)), replaceString(data.get(5)),
                                                   replaceString(data.get(6)), replaceString(data.get(7)),
                                                   replaceString(data.get(8)),
                                                   Integer.parseInt(replaceString(data.get(9))),
                                                   Integer.parseInt(replaceString(data.get(10))),
                                                   Integer.parseInt(replaceString(data.get(11))));
            default:
                return new InitialBaseMapCreateDto();
        }
    }

    private Response createBaseMap(InitialBaseMapCreateDto dto) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(dto)).
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        post("");

        return response;
    }

    @And("В ответе на подложки есть упоминание ID")
    public void checkIdInResponse() {
        super.checkIdInResponse();
    }
}
