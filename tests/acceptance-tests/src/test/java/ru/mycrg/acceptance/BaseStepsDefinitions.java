package ru.mycrg.acceptance;

import io.cucumber.messages.internal.com.google.gson.Gson;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.http.Cookie;
import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import org.junit.Ignore;
import org.junit.Test;
import ru.mycrg.acceptance.data_service.dto.DatasetCreateDto;
import ru.mycrg.acceptance.data_service.dto.InitialBaseMapCreateDto;
import ru.mycrg.acceptance.gis_service.dto.BaseMapCreateDto;
import ru.mycrg.acceptance.gis_service.dto.LayerCreateDto;
import ru.mycrg.acceptance.gis_service.dto.LayerGroupCreateDto;
import ru.mycrg.acceptance.gis_service.dto.ProjectRequestDto;
import ru.mycrg.auth_service_contract.dto.GroupCreateDto;
import ru.mycrg.auth_service_contract.dto.OrganizationCreateDto;
import ru.mycrg.auth_service_contract.dto.UserCreateDto;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static io.restassured.RestAssured.given;
import static org.apache.commons.lang3.RandomStringUtils.random;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.CoreMatchers.hasItems;
import static org.junit.Assert.*;

public class BaseStepsDefinitions {

    public static Random random = new Random();
    public static String testServerHost;
    public static int testServerPort;
    public static String rootUserName;
    public static String rootPassword;

    public static RequestSpecification request;
    public static Response response;
    public static Cookie cookie;
    public static JsonPath jsonPath;
    public static Gson gson = new Gson();

    public static int totalPages;
    public static int entityCount;

    public static Map<Integer, OrganizationCreateDto> orgPool = new LinkedHashMap<>();
    public static Map<Integer, UserCreateDto> userPool = new LinkedHashMap<>();
    public static Map<Integer, GroupCreateDto> usersGroupPool = new LinkedHashMap<>();
    public static Map<Integer, InitialBaseMapCreateDto> baseMapsPool = new LinkedHashMap<>();
    public static Map<Integer, ProjectRequestDto> projectPool = new LinkedHashMap<>();
    public static Map<Integer, BaseMapCreateDto> projectBaseMapsPool = new LinkedHashMap<>();
    public static Map<Integer, LayerGroupCreateDto> layerGroupPool = new LinkedHashMap<>();
    public static Map<String, DatasetCreateDto> datasetsPool = new LinkedHashMap<>();
    public static Map<Integer, LayerCreateDto> layerPool = new LinkedHashMap<>();
    public static Map<String, String> filesPool = new LinkedHashMap<>();

    public static Integer currentId;

    public Integer getCurrentId() {
        return currentId;
    }

    public void setCurrentId(Integer id) {
        currentId = id;
    }

    public void setup() {
        testServerHost = System.getProperty("env.HOST");
        rootUserName = System.getProperty("env.ROOT_NAME");
        rootPassword = System.getProperty("env.ROOT_PASS");

        assert testServerHost != null && rootPassword != null && rootUserName != null
                : "You should specify test server HOST as '-Denv.HOST', PORT as '-Denv.PORT', ROOT_NAME as '-Denv" +
                ".ROOT_NAME', ROOT_PASS as '-Denv.ROOT_PASS'";
        testServerPort = Integer.parseInt(System.getProperty("env.PORT"));

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

    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return getBaseRequest().cookie(cookie);
    }

    public Integer extractIdFromLocation() {
        String header = response.getHeader("Location");
        Pattern pattern = Pattern.compile("\\d+$");
        Matcher matcher = pattern.matcher(header);

        Integer id = null;

        while (matcher.find()) {
            id = Integer.parseInt(matcher.group());
        }

        assertNotNull(id);

        return id;
    }

    public String generateString(String input) {
        String[] params = input.split("_");
        String type = params[0];
        int length;

        try {
            if (params.length == 1) {
                return input;
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
                return String.format("%s@t", random((length - 2), true, true).toLowerCase());
            default:
                return input;
        }
    }

    public void checkPagesCount(String entityType, String entitiesPerPage) {
        getAllAndFillEntityCount(entityType);

        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/?size=" + entitiesPerPage);
        jsonPath = response.jsonPath();

        double entitiesPerPageDouble = Integer.parseInt(entitiesPerPage);
        int estimatedPages = (int) Math.ceil(entityCount / entitiesPerPageDouble);
        totalPages = jsonPath.get("page.totalPages");

        assertEquals(totalPages, estimatedPages);
    }

    public void checkSomethingOnPages(String checkType, String entitiesPerPage) {
        for (int i = 0; i < totalPages; i++) {
            response = getBaseRequestWithCurrentCookie()
                    .when().
                            get(String.format("/?size=%s&page=%s", entitiesPerPage, i));

            jsonPath = response.jsonPath();
            List<String> entitiesIds = response.jsonPath().getList(String.format("_embedded.%s.id", checkType));

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
        final String accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VyX25hbWUiOiJh" +
                "ZG1pbkBtYWlsLnJ1Iiwic2NvcGUiOlsiY3JnIl0sIm9yZ2FuaXphdGlvbnMiOltdLCJncm91cHMiOltdLCJleHAiOjE2" +
                "MDE0NjU0NzksImF1dGhvcml0aWVzIjpbIkdMT0JBTF9BRE1JTiJdLCJqdGkiOiJmMmZlZWM0ZC0wODBlLTRmNWYtOTJk" +
                "OS0xYWJiZWE1OWJjMDEiLCJjbGllbnRfaWQiOiJhZG1pbiJ9.TXw7kkct4KFcnmhx7EfBiCGgwqwfi3ghF3mRK9yJ8j8";

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

    public void getAllEntities() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/?size=1000");
    }

    public void getCurrentEntityByFilter(String field, String value) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(String.format("?%s=%s", field, value));
    }

    public void getAllEntitiesSorted(String sortingType, String sortingDirection) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(String.format("/?sort=%s,%s&%s", sortingType, sortingDirection, "size=1000"));
    }

    public void getAllAndFillEntityCount(String entity) {
        getAllEntities();
        entityCount = getEntitiesCount(entity);
    }

    public int getEntitiesCount(String entity) {
        jsonPath = response.jsonPath();

        return jsonPath.getList(String.format("_embedded.%s.id", entity))
                       .size();
    }

    public void checkCurrentIdInResponse() {
        checkIdInResponse(getCurrentId());
    }

    public void checkPassedIdInResponse(Integer id) {
        checkIdInResponse(id);
    }

    public void createEntity(Object dto) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(dto)).
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        post("");
    }

    public void deleteCurrentEntity() {
        deleteEntity(getCurrentId());
    }

    public void deleteEntityById(Integer id) {
        deleteEntity(id);
    }

    public void deleteAllEntitiesInOrg() {
        userPool.clear();
        usersGroupPool.clear();
        baseMapsPool.clear();
        projectPool.clear();
        projectBaseMapsPool.clear();
        layerGroupPool.clear();
        datasetsPool.clear();
        layerPool.clear();
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
