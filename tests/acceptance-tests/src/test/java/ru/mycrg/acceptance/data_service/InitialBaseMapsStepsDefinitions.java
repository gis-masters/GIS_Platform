package ru.mycrg.acceptance.data_service;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
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

        super.createEntity(baseMapDto);
    }

    @When("Пользователь делает запрос на указанную подложку источник")
    public void getBaseMap() {
        super.getCurrentEntity();
    }

    @And("Поля подложки совпадают с переданными")
    public void checkBaseMapData() {
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
        super.get1000Entities();
    }

    @Given("Существует подложка источник")
    public void initBaseMap(DataTable dataTable) {
        String name = generateString(dataTable.cell(0, 1));

        if (isBaseMapExistInPool(name)) {
            makeExactBaseMapAsCurrent(name);
        } else if (!baseMapsPool.isEmpty()) {
            makeLastAvailableBasemapAsCurrent();
        } else {
            createBaseMap(dataTable);
            assertEquals(SC_CREATED, response.getStatusCode());
            extractBaseMapIdFromLocation();
        }
    }

    @Given("Существует подложка с указанными pluggableToNewProject и position {string}")
    public void initBaseMapWithPositionAndPluggable(String position) {
        baseMapDto = new InitialBaseMapCreateDto("wmts", "Test basemap", "/assets/images/thumbnail-our.jpg",
                                                 "WMTS", "http://localhost:8100/geoserver/gwc/service/wmts",
                                                 "TestLayerName", "raster", "EPSG:900913",
                                                 "image/png", 256, 21, 21,
                                                 Integer.parseInt(position), true);

        super.createEntity(baseMapDto);
        extractBaseMapIdFromLocation();
    }

    @When("Пользователь делает запрос на обновление полей подложки")
    public void updateBaseMap(DataTable dataTable) {
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

    @When("Пользователь делает запрос на удаление подложки источника")
    public void deleteBaseMap() {
        super.deleteCurrentEntity();

        baseMapsPool.remove(baseMapId);
    }

    @And("Представление подложки корректно")
    public void checkBaseMapKeys() {
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
    }

    @And("Сервер передает ID созданной подложки")
    public void extractBaseMapIdFromLocation() {
        baseMapId = extractId(response);

        baseMapsPool.put(baseMapId, baseMapDto);
    }

    @When("Администратор делает запрос с сортировкой по {string} и {string} на все подложки")
    public void getAllBaseMapsSorted(String sortingType, String sortingDirection) {
        super.get1000EntitiesSorted(sortingType, sortingDirection);
    }

    @And("Количество страниц подложек пропорционально {string}")
    public void checkBaseMapsPagesCount(String entitiesPerPage) {
        super.checkPagesCount(entitiesPerPage);
    }

    @And("На всех страницах подложек есть {string}")
    public void isBaseMapsOnPages(String entitiesPerPage) {
        super.checkSomethingOnPages(entitiesPerPage);
    }

    @And("В ответе на подложки есть упоминание ID")
    public void checkCurrentIdInResponse() {
        super.checkCurrentIdInResponse();
    }

    private boolean isBaseMapExistInPool(String name) {
        return baseMapsPool
                .values().stream()
                .anyMatch(dto -> name.equals(dto.getName()));
    }
    //TODO: Переделать создание объектов

    private InitialBaseMapCreateDto mapToBaseMapDto(DataTable dataTable) {
        List<String> data = dataTable.asLists(String.class).get(0);
        switch (data.size()) {
            case 4:
                return new InitialBaseMapCreateDto(generateString(data.get(0)), generateString(data.get(1)),
                                                   generateString(data.get(2)), generateString(data.get(3)));
            case 12:
                return new InitialBaseMapCreateDto(generateString(data.get(0)), generateString(data.get(1)),
                                                   generateString(data.get(2)), generateString(data.get(3)),
                                                   generateString(data.get(4)), generateString(data.get(5)),
                                                   generateString(data.get(6)), generateString(data.get(7)),
                                                   generateString(data.get(8)),
                                                   Integer.parseInt(generateString(data.get(9))),
                                                   Integer.parseInt(generateString(data.get(10))),
                                                   Integer.parseInt(generateString(data.get(11))));
            case 14:
                return new InitialBaseMapCreateDto(generateString(data.get(0)), generateString(data.get(1)),
                                                   generateString(data.get(2)), generateString(data.get(3)),
                                                   generateString(data.get(4)), generateString(data.get(5)),
                                                   generateString(data.get(6)), generateString(data.get(7)),
                                                   generateString(data.get(8)),
                                                   Integer.parseInt(generateString(data.get(9))),
                                                   Integer.parseInt(generateString(data.get(10))),
                                                   Integer.parseInt(generateString(data.get(11))),
                                                   Integer.parseInt(generateString(data.get(12))),
                                                   Boolean.parseBoolean(data.get(13)));
            default:
                return new InitialBaseMapCreateDto();
        }
    }

    private void makeExactBaseMapAsCurrent(String name) {
        baseMapsPool.entrySet().stream()
                    .filter(entry -> entry.getValue().getName().equals(name))
                    .findFirst()
                    .ifPresent(entry -> {
                        baseMapId = entry.getKey();
                        baseMapDto = entry.getValue();
                    });
    }

    private void makeLastAvailableBasemapAsCurrent() {
        baseMapsPool.entrySet().stream()
                    .skip(baseMapsPool.size() - 1)
                    .findFirst()
                    .ifPresent(entry -> {
                        baseMapId = entry.getKey();
                        baseMapDto = entry.getValue();
                    });
    }
}
