package ru.mycrg.gis.acceptance;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.restassured.RestAssured;
import com.jayway.restassured.http.ContentType;
import com.jayway.restassured.specification.RequestSpecification;
import okhttp3.*;
import org.junit.BeforeClass;
import org.junit.FixMethodOrder;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import ru.mycrg.common.JWTTokenHolder;
import ru.mycrg.gis.util.Util;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.IntStream;

import static com.jayway.restassured.RestAssured.*;
import static java.util.concurrent.TimeUnit.MILLISECONDS;
import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.Matchers.lessThan;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.junit.Assert.assertNotNull;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class OrganizationAPITest {

    private static JWTTokenHolder jwtToken;
    private static RequestSpecification requestJwt;

    @BeforeClass
    public static void setup() {
        RestAssured.baseURI = "http://10.10.10.121";
        RestAssured.port = 8088;
        RestAssured.basePath = "/organizations";
    }

    @Test
    public void aa_ShouldGetOk() throws IOException {
        jwtToken = getJwtToken();

        assertNotNull(jwtToken);

        requestJwt = RestAssured.given()
                .headers("Authorization", "Bearer " + jwtToken.getAccess_token(), "Content-Type",
                        ContentType.JSON, "Accept", ContentType.JSON);

        requestJwt
            .when()
                .get()
            .then().statusCode(200)
                .and()
                .body(containsString("content"));
    }

    @Test
    public void ab_ShouldResponse404_GetNotExistResource() {
        requestJwt
            .when()
                .get("/314")
            .then()
                .statusCode(404);
    }

    @Test
    public void ac_ShouldResponse404_DeleteNotExistResource() {
        requestJwt
            .when()
                .delete("/314")
            .then()
                .statusCode(404);
    }

    @Test
    public void ad_ShouldResponse400_IncorrectOrganizationDto() {
        Map<String, Object> organization = new HashMap<>();
        organization.put("email", "valid@email.com");

        createAndCheckStatus(organization, 400);
    }

    @Test
    public void ae_ShouldSaveOrganization() {
        Map<String, Object> organization = new HashMap<>();
        organization.put("email", "valid@email.com");
        organization.put("name", "organization name");
        organization.put("password", "Valid1OrgPass");
        organization.put("phone", "+7(978)111 11 11");
        organization.put("userName", "userName");
        organization.put("userSurName", "userSurName");

        createAndCheckStatus(organization, 202);
    }

    @Test
    public void af_ShouldGetExistingResource() {
        requestJwt
            .when()
                .get("/1")
            .then()
                .statusCode(200)
            .and()
                .body("name", equalTo("organization name"))
                .body("status", equalTo("PENDING"));
    }

    @Test
    public void ag_ShouldDeleteExistingResource() {
        requestJwt
            .when()
                .delete("/1")
            .then()
                .statusCode(200);
    }

    @Test
    public void ah_CheckThatTheResourceIsDeleted() {
        requestJwt
            .when()
                .get("/1")
            .then()
                .statusCode(404);
    }

    @Test
    public void bb_ShouldSave30_Organizations() {
        IntStream
            .range(0, 30)
            .forEach(i -> createAndCheckStatus(Util.getRandomOrganization(), 202));
    }

    @Test
    public void cc_ShouldGet20_OrganizationsDefaultPaging() {
        requestJwt
            .when()
                .get()
            .then()
                .statusCode(200)
            .and()
                .body("size", equalTo(20))
                .body("number", equalTo(0))
                .body("first", equalTo(true))
                .body("content", hasSize(20));
    }

    @Test
    public void ci_ShouldGet5_OrganizationsDefaultPaging() {
        given()
            .headers("Authorization", "Bearer " + jwtToken.getAccess_token(),"Content-Type",
                    ContentType.JSON, "Accept", ContentType.JSON)
            .param("size", 5)
            .param("sort", "desc")
        .when()
            .get()
        .then()
            .statusCode(200)
        .and()
            .body("size", equalTo(5))
            .body("number", equalTo(0))
            .body("first", equalTo(true))
            .body("content", hasSize(5))
            .body("content.findAll { it.id == 31 }", notNullValue());
    }

    @Test
    public void dd_CheckResponseTime() {
        requestJwt
            .when()
                .get().
            then()
                .time(lessThan(500L), MILLISECONDS);
    }

    @Test
    public void dx_pause() throws InterruptedException {
        // Ждем создания всех организаций. На домашнем ПК(8 ядер) примерно 40 сек.
        // Задержа, более секунды, при создании "EXTENSION postgis" в БД
        Thread.sleep(120_000L);
    }

    @Test
    public void ee_OrganizationStatus_ShouldBe_Ready() {
        requestJwt
            .when()
                .get("/2")
            .then().statusCode(200)
                .and()
                .body("status", equalTo("READY"));
    }

    @Test
    public void ff_ShouldCheck_workspaces_via_geoserverAPI() {
        given()
            .headers("Authorization", "Bearer " + jwtToken.getAccess_token(),"Content-Type",
                    ContentType.JSON, "Accept", ContentType.JSON)
            .port(8080)
            .basePath("/geoserver/rest/workspaces.json")
        .when()
            .get()
        .then()
            .statusCode(200)
        .and()
            .body("workspaces.workspace.name", hasItems("scratch_database_1", "scratch_database_11"));
    }

    @Test
    public void fl_ShouldCheck_Roles_via_geoserverAPI() {
        given()
            .headers("Authorization", "Bearer " + jwtToken.getAccess_token(),"Content-Type",
                    ContentType.JSON, "Accept", ContentType.JSON)
            .port(8080)
            .basePath("/geoserver/rest/security/roles.json")
        .when()
            .get()
        .then()
            .statusCode(200)
        .and()
            .body("roles", hasItems("ADMIN", "admin_10", "admin_20", "admin_30"));
    }

    @Test
    public void fo_ShouldCheck_Users_via_geoserverAPI() {
        given()
            .headers("Authorization", "Bearer " + jwtToken.getAccess_token(),"Content-Type",
                    ContentType.JSON, "Accept", ContentType.JSON)
            .port(8080)
            .basePath("/geoserver/rest/security/usergroup/users.json")
        .when()
            .get()
        .then()
            .statusCode(200)
        .and()
            .body("users.userName", hasItems("admin@mail.ru"));
    }

    @Test
    public void fr_ShouldCheck_DataStores_via_geoserverAPI() {
        given()
            .headers("Authorization", "Bearer " + jwtToken.getAccess_token(),"Content-Type",
                    ContentType.JSON, "Accept", ContentType.JSON)
            .port(8080)
            .basePath("/geoserver/rest/workspaces/scratch_database_2/datastores.json")
        .when()
            .get()
        .then()
            .statusCode(200)
        .and()
            .body("dataStores.dataStore.name", hasItems("scratch_database_2_store"));
    }

    @Test
    public void ga_ImportExtension_ShouldBeActive() {
        given()
            .headers("Authorization", "Bearer " + jwtToken.getAccess_token(),"Content-Type",
                    ContentType.JSON, "Accept", ContentType.JSON)
            .port(8080)
            .basePath("/geoserver/rest/imports")
        .when()
            .get()
        .then()
            .statusCode(200);
    }

    private void createAndCheckStatus(Map<String, Object> organization, int statusCode) {
        given()
            .headers("Authorization", "Bearer " + jwtToken.getAccess_token(),"Content-Type",
                    ContentType.JSON, "Accept", ContentType.JSON)
            .accept(ContentType.JSON)
            .contentType(ContentType.JSON)
            .body(organization)
        .when()
            .post()
        .then()
            .statusCode(statusCode);
    }

    private static JWTTokenHolder getJwtToken() throws IOException {
        JWTTokenHolder jwtTokenHolder;
        String username = "admin@mail.ru";
        String password = "geoserver";

        MediaType mediaType = MediaType.parse("multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW");
        RequestBody body = RequestBody.create(mediaType, "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\n" +
                "Content-Disposition: form-data; name=\"grant_type\"\r\n\r\npassword\r\n" +
                "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\n" +
                "Content-Disposition: form-data; name=\"username\"\r\n\r\n" + username
                + "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\n" +
                "Content-Disposition: form-data; name=\"password\"\r\n\r\n" + password
                + "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--");
        Request request = new Request.Builder()
                .url("http://10.10.10.121:8100/oauth/token")
                .header("Authorization", Credentials.basic(username, password))
                .header("Content-type", "multipart/form-data")
                .header("cache-control", "no-cache")
                .post(body)
                .build();

        OkHttpClient httpClient = new OkHttpClient();
        Response response = httpClient.newCall(request).execute();

        ObjectMapper mapper = new ObjectMapper();
        jwtTokenHolder = mapper.readValue(response.body().string(), JWTTokenHolder.class);

        response.close();

        return jwtTokenHolder;
    }

}
