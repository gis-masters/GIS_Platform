package ru.mycrg.acceptance.data_service;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.data_service.dto.BaseMapCreateDto;

import java.util.List;
import java.util.Map;

import static org.apache.http.HttpStatus.SC_CREATED;
import static org.apache.http.HttpStatus.SC_OK;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class BaseMapsStepsDefinitions extends BaseStepsDefinitions {

    public static Integer currentId;
    public static BaseMapCreateDto currentDto;

    public Integer getCurrentId() {
        return currentId;
    }

    public void setCurrentId(Integer currentId) {
        BaseMapsStepsDefinitions.currentId = currentId;
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
        currentDto = mapToBaseMapDto(dataTable);

        String payload = gson.toJson(currentDto);

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
                        get("" + currentId);
    }

    @And("Поля подложки совпадают с переданными")
    public void isBaseMapDataCorrect() {
        jsonPath = response.jsonPath();

        assertEquals(jsonPath.get("name"), currentDto.getName());
        assertEquals(jsonPath.get("title"), currentDto.getTitle());
        assertEquals(jsonPath.get("thumbnailUrn"), currentDto.getThumbnailUrn());
        assertEquals(jsonPath.get("type"), currentDto.getType());
        assertEquals(jsonPath.get("url"), currentDto.getUrl());
        assertEquals(jsonPath.get("layerName"), currentDto.getLayerName());
        assertEquals(jsonPath.get("style"), currentDto.getStyle());
        assertEquals(jsonPath.get("projection"), currentDto.getProjection());
        assertEquals(jsonPath.get("format"), currentDto.getFormat());
        assertEquals(jsonPath.get("size"), currentDto.getSize());
        assertEquals(jsonPath.get("resolution"), currentDto.getResolution());
        assertEquals(jsonPath.get("matrixIds"), currentDto.getMatrixIds());

        baseMapsPool.put(currentId, currentDto);
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
            BaseMapCreateDto dto = mapToBaseMapDto(dataTable);
            Response createResponse = createBaseMap(dto);

            assertEquals(SC_CREATED, createResponse.getStatusCode());

            response = createResponse;
            Integer id = extractIdFromLocation(createResponse);

            currentId = id;
            currentDto = dto;
            baseMapsPool.put(id, dto);
        }
    }

    @When("Пользователь делает запрос на обновление полей подложки")
    public void updateExactBaseMap(DataTable dataTable) {
        currentDto = mapToBaseMapDto(dataTable);

        String payload = gson.toJson(currentDto);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(payload).
                        contentType(ContentType.JSON)
                .when().
                        patch("" + currentId);
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
                        delete("" + currentId);

        baseMapsPool.remove(currentId);
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
        currentId = extractIdFromLocation();
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
    private BaseMapCreateDto mapToBaseMapDto(DataTable dataTable) {
        List<String> data = dataTable.asList();
        switch (data.size()) {
            case 4:
                return new BaseMapCreateDto(replaceString(data.get(0)), replaceString(data.get(1)),
                                            replaceString(data.get(2)), replaceString(data.get(3)));
            case 12:
                return new BaseMapCreateDto(replaceString(data.get(0)), replaceString(data.get(1)),
                                            replaceString(data.get(2)), replaceString(data.get(3)),
                                            replaceString(data.get(4)), replaceString(data.get(5)),
                                            replaceString(data.get(6)), replaceString(data.get(7)),
                                            replaceString(data.get(8)), Integer.parseInt(replaceString(data.get(9))),
                                            Integer.parseInt(replaceString(data.get(10))),
                                            Integer.parseInt(replaceString(data.get(11))));
            default:
                return new BaseMapCreateDto();
        }
    }

    private Response createBaseMap(BaseMapCreateDto dto) {
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
