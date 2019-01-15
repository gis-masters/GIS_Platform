package ru.mycrg.gis.acceptance;

import com.jayway.restassured.RestAssured;
import com.jayway.restassured.http.ContentType;
import org.junit.BeforeClass;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;

import ru.mycrg.gis.util.Util;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.IntStream;

import static com.jayway.restassured.RestAssured.given;
import static com.jayway.restassured.RestAssured.when;
import static java.util.concurrent.TimeUnit.MILLISECONDS;
import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.Matchers.lessThan;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class OrganizationAPITest {

    @BeforeClass
    public static void setup() {
        RestAssured.baseURI = "http://10.10.10.112";
        RestAssured.port = 8088;
        RestAssured.basePath = "/organizations";
    }

    @Test
    public void aa_ShouldGetOk() {
        when()
            .get()
        .then().statusCode(200)
            .and()
            .body(containsString("content"));
    }

    @Test
    public void ab_ShouldResponse404_GetNotExistResource() {
        when()
            .get("/314")
        .then()
            .statusCode(404);
    }

    @Test
    public void ac_ShouldResponse404_DeleteNotExistResource() {
        when()
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
        when()
            .get("/1")
        .then()
            .statusCode(200)
        .and()
            .body("name", equalTo("organization name"))
            .body("status", equalTo("PENDING"));
    }

    @Test
    public void ag_ShouldDeleteExistingResource() {
        when()
            .delete("/1")
        .then()
            .statusCode(200);
    }

    @Test
    public void ah_CheckThatTheResourceIsDeleted() {
        when()
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
        when()
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
        when()
            .get().
        then()
            .time(lessThan(500L), MILLISECONDS);
    }

    @Test
    public void dx_pause() throws InterruptedException {
        // Ждем создания всех организаций. На домашнем ПК(8 ядер) примерно 40 сек.
        // Оснавная задержа, более секунды, при создании "EXTENSION postgis" в БД
        Thread.sleep(60_000L);
    }

    @Test
    public void ee_OrganizationStatus_ShouldBe_Ready() {
        when()
            .get("/2")
        .then().statusCode(200)
            .and()
            .body("status", equalTo("READY"));
    }

    @Test
    public void ff_ShouldCheck_workspaces_via_geoserverAPI() {
        given()
            .port(8080)
            .basePath("/geoserver/rest/workspaces.json")
        .when()
            .get()
        .then()
            .statusCode(200)
        .and()
            .body("workspaces.workspace.name", hasItems("workspace_31", "workspace_21", "workspace_11"));
    }

    @Test
    public void fl_ShouldCheck_Roles_via_geoserverAPI() {

        given()
            .port(8080)
            .basePath("/geoserver/rest/security/roles.json")
        .when()
            .get()
        .then()
            .statusCode(200)
        .and()
            .body("roles", hasItems("admin_workspace_10", "admin_workspace_20", "admin_workspace_30"));
    }

    @Test
    public void fo_ShouldCheck_Users_via_geoserverAPI() {
        given()
            .port(8080)
            .basePath("/geoserver/rest/security/usergroup/users.json")
        .when()
            .get()
        .then()
            .statusCode(200)
        .and()
            .body("users.userName", hasItems("Admin13", "Admin23", "Admin29"));
    }

    @Test
    public void fr_ShouldCheck_DataStores_via_geoserverAPI() {
        given()
            .port(8080)
            .basePath("/geoserver/rest/workspaces/workspace_2/datastores.json")
        .when()
            .get()
        .then()
            .statusCode(200)
        .and()
            .body("dataStores.dataStore.name", hasItems("workspace_store_2"));
    }

    @Test
    public void ga_ImportExtension_ShouldBeActive() {
        given()
            .port(8080)
            .basePath("/geoserver/rest/imports")
        .when()
            .get()
        .then()
            .statusCode(200);
    }

    private void createAndCheckStatus(Map<String, Object> organization, int statusCode) {
        given()
            .accept(ContentType.JSON)
            .contentType(ContentType.JSON)
            .body(organization)
        .when()
            .post()
        .then()
            .statusCode(statusCode);
    }

}
