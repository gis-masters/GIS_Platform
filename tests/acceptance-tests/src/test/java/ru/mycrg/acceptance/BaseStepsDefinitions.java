package ru.mycrg.acceptance;

import com.google.gson.Gson;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.http.Cookie;
import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import org.junit.Ignore;
import org.junit.Test;
import ru.mycrg.acceptance.configs.GeneralEnvironmentsConfig;
import ru.mycrg.acceptance.data_service.dto.DatasetCreateDto;
import ru.mycrg.acceptance.data_service.dto.InitialBaseMapCreateDto;
import ru.mycrg.acceptance.data_service.dto.TableCreateDto;
import ru.mycrg.acceptance.data_service.dto.schemas.SchemaDto;
import ru.mycrg.acceptance.gis_service.dto.BaseMapCreateDto;
import ru.mycrg.acceptance.gis_service.dto.LayerCreateDto;
import ru.mycrg.acceptance.gis_service.dto.LayerGroupCreateDto;
import ru.mycrg.auth_service_contract.dto.GroupCreateDto;
import ru.mycrg.auth_service_contract.dto.OrganizationCreateDto;
import ru.mycrg.auth_service_contract.dto.UserCreateDto;
import ru.mycrg.common_contracts.generated.gis_service.project.ProjectCreateDto;
import ru.mycrg.geo_json.Feature;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static io.restassured.RestAssured.given;
import static java.util.Objects.isNull;
import static org.apache.commons.lang3.RandomStringUtils.random;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.CoreMatchers.hasItems;
import static org.junit.Assert.*;
import static ru.mycrg.acceptance.JsonMapper.asJson;
import static ru.mycrg.acceptance.auth_service.AuthorizationBase.AUTH_COOKIE_VALUE_SEPARATOR;

public class BaseStepsDefinitions {

    public static Random random = new Random();
    public static String testServerHost;
    public static Integer testServerPort;
    public static String rootUserName;
    public static String rootPassword;

    public static RequestSpecification request;
    public static Response response;
    public static Cookie cookie;
    public static Cookie oldCookie;
    public static JsonPath jsonPath;
    public static Gson gson = new Gson();

    public static int totalPages;
    public static int entityCount;

    public static Map<Integer, OrganizationCreateDto> orgPool = new LinkedHashMap<>();
    public static Map<Integer, UserCreateDto> userPool = new LinkedHashMap<>();
    public static Map<Integer, GroupCreateDto> usersGroupPool = new LinkedHashMap<>();
    public static Map<Integer, InitialBaseMapCreateDto> baseMapsPool = new LinkedHashMap<>();
    public static Map<Integer, ProjectCreateDto> projectPool = new LinkedHashMap<>();
    public static Map<Integer, Map<String, Object>> taskPool = new LinkedHashMap<>();
    public static Map<Integer, BaseMapCreateDto> projectBaseMapsPool = new LinkedHashMap<>();
    public static Map<Integer, LayerGroupCreateDto> layerGroupPool = new LinkedHashMap<>();
    public static Map<String, DatasetCreateDto> datasetsPool = new LinkedHashMap<>();
    public static Map<Integer, LayerCreateDto> layerPool = new LinkedHashMap<>();

    public static Map<Integer, OrganizationCreateDto> scenarioOrganizations = new HashMap<>();
    public static Map<String, SchemaDto> scenarioSchemas = new HashMap<>();
    public static List<LayerCreateDto> scenarioLayers = new ArrayList<>();
    public static List<TableCreateDto> scenarioTables = new ArrayList<>();
    public static List<Feature> scenarioFeatures = new ArrayList<>();

    public static Integer currentId;

    public Integer getCurrentId() {
        return currentId;
    }

    public void setCurrentId(Integer id) {
        currentId = id;
    }

    public void setup() {
        testServerHost = GeneralEnvironmentsConfig.getConfigValue("env.HOST", "http://localhost");

        rootPassword = GeneralEnvironmentsConfig.getConfigValue("env.ROOT_PASS");
        if (rootPassword == null) {
            fail("Переменная rootPassword == null true");
        }

        rootUserName = GeneralEnvironmentsConfig.getConfigValue("env.ROOT_NAME");
        if (rootUserName == null) {
            fail("Переменная rootUserName == null true");
        }

        String testServerPortAsString = GeneralEnvironmentsConfig.getConfigValue("env.PORT");
        if (testServerPortAsString == null) {
            testServerPort = 8100;
        } else {
            testServerPort = Integer.parseInt(testServerPortAsString);
        }

        request = getBaseRequest();
    }

    public RequestSpecification getBaseRequest() {
        return RestAssured
                .given().
                        log().ifValidationFails().
                        baseUri(testServerHost).
                        port(testServerPort).
                        basePath("");
    }

    public RequestSpecification getBaseRequest(int port) {
        String accessToken = cookie.getValue().split(AUTH_COOKIE_VALUE_SEPARATOR)[0];
        return RestAssured
                .given().
                        log().ifValidationFails().
                        baseUri(testServerHost).
                        port(port).
                        headers("Authorization", "Bearer " + accessToken).
                        basePath("");
    }

    public RequestSpecification getBaseRequestWithCurrentCookie() {
        if (cookie == null) {
            return getBaseRequest();
        }

        return getBaseRequest().cookie(cookie);
    }

    public RequestSpecification getBaseRequestWithOldCookie() {
        return getBaseRequest().cookie(oldCookie);
    }

    public RequestSpecification getBaseRequestWithCurrentTokenAndPort(int port) {
        return getBaseRequest(port);
    }

    public String getLocation(Response response) {
        String location = response.getHeader("Location");
        if (location == null || location.isBlank()) {
            throw new IllegalArgumentException("Header Location отсутствует!");
        }

        return location;
    }

    public Integer extractId(Response response) {
        return extractId(getLocation(response));
    }

    public Integer extractId(String location) {
        Integer id = null;
        Pattern pattern = Pattern.compile("\\d+$");
        Matcher matcher = pattern.matcher(location);
        while (matcher.find()) {
            id = Integer.parseInt(matcher.group());
        }

        assertNotNull(id);

        return id;
    }

    public String generateString(String controlKey) {
        if (isNull(controlKey)) {
            return null;
        }
        if (controlKey.equals("NULL")) {
            return null;
        }

        String[] params = controlKey.split("_");
        String type = params[0];
        int length;

        try {
            if (params.length == 1) {
                return controlKey;
            } else {
                length = Integer.parseInt(params[1]);
            }
        } catch (NumberFormatException e) {
            length = 0;
        }

        switch (type) {
            case "STRING":
                return random(length, true, false).toLowerCase();
            case "NUMBER":
                return random(length, false, true);
            case "EMAIL":
                return String.format("%s@t", random(length - 2, true, true).toLowerCase());
            default:
                return controlKey;
        }
    }

    public String generateJsonString(String command) {
        if ("JSON".equals(command)) {
            return "{\"name\": \"Jon\",  \"age\": \"19\"}";
        }

        return command;
    }

    public void checkPagesCount(String entitiesPerPage) {
        getAllAndFillEntityCount();

        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/?size=" + entitiesPerPage);
        jsonPath = response.jsonPath();

        double entitiesPerPageDouble = Integer.parseInt(entitiesPerPage);
        int estimatedPages = (int) Math.ceil(entityCount / entitiesPerPageDouble);
        totalPages = jsonPath.get("page.totalPages");

        assertEquals(totalPages, estimatedPages);
    }

    public void checkSomethingOnPages(String entitiesPerPage) {
        for (int i = 0; i < totalPages; i++) {
            response = getBaseRequestWithCurrentCookie()
                    .when().
                            get(String.format("/?size=%s&page=%s", entitiesPerPage, i));

            jsonPath = response.jsonPath();
            List<String> entitiesIds = response.jsonPath().getList("content");

            assertNotEquals(0, entitiesIds.size());
        }
    }

    @Test
    public void shouldReplaceStringCorrectly() {
        String test_10 = generateString("STRING_10");
        assertEquals(10, test_10.length());

        String number_10 = generateString("NUMBER_10");
        assertEquals(10, number_10.length());

        String test_0 = generateString("STRING_0");
        assertTrue(test_0.isEmpty());

        String email_3 = generateString("EMAIL_3");
        assertEquals(3, email_3.length());

        String email_20 = generateString("EMAIL_20");
        assertEquals(20, email_20.length());

        String testCustom = generateString("MyCustomString_DontTouchME!");
        assertEquals("MyCustomString_DontTouchME!", testCustom);
    }

    @Test
    @Ignore
    public void templateForManualTesting() {
        final String accessToken = "";

        String userName = "test_2_3@fiz";

        given().
                        log().ifValidationFails().
                        baseUri("http://localhost").
                        port(8080).
                        basePath("/").
                        headers("Authorization", "Bearer " + accessToken)
                .when().
                        get("/geoserver/rest/security/usergroup/service/postgres_db_user_service/users.json")
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        body("users.findAll { it.enabled == true }.userName", hasItems(userName));
    }

    public Integer extractEntityIdFromResponse(Response response) {
        return response.jsonPath().get("id");
    }

    public void extractAndSetEntityIdFromBody() {
        setCurrentId(extractEntityIdFromResponse(response));

        assertNotNull(getCurrentId());
    }

    public void getCurrentEntity() {
        getEntity(getCurrentId());
    }

    public void getEntityById(Integer id) {
        getEntity(id);
    }

    public Response getAllEntities() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get();

        return response;
    }

    public void get1000Entities() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/?size=1000");
    }

    public void getCurrentEntityByFilter(String field, String value) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("?filter=" + field + " iLike '%" + value + "%'");
    }

    public void getCurrentEntityByFilter(String filter) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("?" + filter);
    }

    // TODO: Временно дублирую метод: getCurrentEntityByFilter пока проекты не работают с полным фильтром
    public void getEntitiesWithFilterByField(String field, String value) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(String.format("?%s=%s", field, value));
    }

    public void get1000EntitiesSorted(String field, String direction) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(String.format("/?sort=%s,%s&%s", field, direction, "size=1000"));
    }

    public void getAllAndFillEntityCount() {
        get1000Entities();
        entityCount = getEntitiesCount();
    }

    public int getEntitiesCount() {
        jsonPath = response.jsonPath();

        List<Object> list = jsonPath.getList("content");

        return list.size();
    }

    public void checkErrorResponseMessage(String expectedMsg) {
        jsonPath = response.jsonPath();

        assertEquals(expectedMsg, jsonPath.get("message"));
    }

    public void checkCurrentIdInResponse() {
        checkIdInResponse(getCurrentId());
    }

    public void checkPassedIdInResponse(Integer id) {
        checkIdInResponse(id);
    }

    public void createEntity(Object dto) {
        createEntity(asJson(dto));
    }

    public void deleteCurrentEntity() {
        deleteEntity(getCurrentId());
    }

    public void deleteEntityById(Integer id) {
        deleteEntity(id);
    }

    public void clearAllOrganizationPools() {
        userPool.clear();
        usersGroupPool.clear();
        baseMapsPool.clear();
        projectPool.clear();
        taskPool.clear();
        projectBaseMapsPool.clear();
        layerGroupPool.clear();
        datasetsPool.clear();
        layerPool.clear();
    }

    public void checkResponseValue(String field, String expectedValue) {
        assertEquals(expectedValue, response.jsonPath().get(field));
    }

    public TableCreateDto getLatestTable() {
        if (scenarioTables.isEmpty()) {
            throw new IllegalStateException("Список таблиц пуст");
        }

        return scenarioTables.get(scenarioTables.size() - 1);
    }

    public LayerCreateDto getLayerByTitle(String layerTitle) {
        return scenarioLayers
                .stream()
                .filter(layer -> layer.getTitle().equals(layerTitle))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Не найден слой: " + layerTitle));
    }

    public void checkResponseValueContains(String field, String value) {
        assertTrue(((String) response.jsonPath().get(field)).contains(value));
    }

    public Optional<Map.Entry<Integer, OrganizationCreateDto>> getOrgByName(String name) {
        return orgPool.entrySet().stream()
                      .filter(item -> item.getValue().getName().contains(name))
                      .findFirst();
    }

    public int getUserGroupIdByName(String name) {
        return usersGroupPool
                .entrySet().stream()
                .filter(item -> item.getValue().getName().equals(name))
                .findFirst()
                .orElseThrow(
                        () -> new IllegalStateException("Not found userGroup in pool by name: '" + name + "'"))
                .getKey();
    }

    public int getUserIdByName(String name) {
        return userPool.entrySet().stream()
                       .filter(item -> item.getValue().getName().equals(name))
                       .findFirst()
                       .orElseThrow(() -> new IllegalStateException("Not found user in pool by name: '" + name + "'"))
                       .getKey();
    }

    public UserCreateDto getUserByName(String name) {
        return userPool.entrySet().stream()
                       .filter(item -> item.getValue().getName().equals(name))
                       .findFirst()
                       .orElseThrow(() -> new IllegalStateException("Not found user in pool by name: '" + name + "'"))
                       .getValue();
    }

    public int getProjectIdByName(String name) {
        return projectPool.entrySet().stream()
                          .filter(item -> item.getValue().getName().equals(name))
                          .findFirst()
                          .orElseThrow(
                                  () -> new IllegalStateException("Not found project in pool by name: '" + name + "'"))
                          .getKey();
    }

    public int getTaskByDescription(String desc) {
        return taskPool.entrySet().stream()
                       .filter(item -> item.getValue().get("description").equals(desc))
                       .findFirst()
                       .orElseThrow(() -> new IllegalStateException("Not found task in pool by desc: '" + desc + "'"))
                       .getKey();
    }

    private void createEntity(String jsonPayload) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(jsonPayload).
                        contentType(ContentType.JSON)
                .when().
                        post()
                .then().
                        log().ifError().
                        extract().response();
    }

    private void deleteEntity(Integer id) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        delete(String.valueOf(id));
    }

    private void checkIdInResponse(Integer id) {
        jsonPath = response.jsonPath();
        String message = jsonPath.get("message");

        assertTrue(message.contains(String.valueOf(id)));
    }

    private void getEntity(Integer id) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(String.valueOf(id));
    }
}
