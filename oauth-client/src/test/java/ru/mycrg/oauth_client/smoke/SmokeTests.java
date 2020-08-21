package ru.mycrg.oauth_client.smoke;

import com.jayway.restassured.RestAssured;
import com.jayway.restassured.http.ContentType;
import com.jayway.restassured.specification.RequestSpecification;
import org.junit.BeforeClass;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import ru.mycrg.oauth_client.JwtToken;
import ru.mycrg.oauth_client.OAuthClient;
import ru.mycrg.oauth_client.OAuthClientException;

import java.net.MalformedURLException;
import java.net.URL;

import static com.jayway.restassured.RestAssured.given;
import static java.util.concurrent.TimeUnit.MILLISECONDS;
import static org.hamcrest.Matchers.lessThan;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class SmokeTests {

    private static JwtToken jwtToken;
    private static RequestSpecification requestJwt;

    private static String testServerHost;
    private static int testServerPort;
    private static String rootUserName;
    private static String rootPassword;

    @BeforeClass
    public static void setup() {
        testServerHost = System.getProperty("env.HOST");
        rootUserName = System.getProperty("env.ROOT_NAME");
        rootPassword = System.getProperty("env.ROOT_PASS");

        assert testServerHost != null && rootPassword != null && rootUserName != null
                : "You should specify test server HOST as '-Denv.HOST', PORT as '-Denv.PORT', ROOT_NAME as '-Denv" +
                ".ROOT_NAME', ROOT_PASS as '-Denv.ROOT_PASS'";
        testServerPort = Integer.parseInt(System.getProperty("env.PORT"));

        RestAssured.baseURI = testServerHost;
        RestAssured.port = testServerPort;
        RestAssured.basePath = "/organizations";
    }

    @Test
    public void aa_ShouldAuthorize() throws MalformedURLException, OAuthClientException {
        OAuthClient oAuthClient = OAuthClient.builder()
                .url(new URL("http://" + testServerHost + ":" + testServerPort))
                .clientId(rootUserName)
                .clientSecret(rootPassword)
                .build();

        jwtToken = oAuthClient.getToken(rootUserName, rootPassword).get();

        requestJwt = RestAssured.given()
                .headers("Authorization", "Bearer " + jwtToken.getAccess_token(), "Content-Type",
                        ContentType.JSON, "Accept", ContentType.JSON);

        requestJwt
            .when()
                .get()
            .then().statusCode(200);
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
    public void dd_CheckResponseTime() {
        requestJwt
            .when()
                .get().
            then()
                .time(lessThan(500L), MILLISECONDS);
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
            .statusCode(200);
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
            .statusCode(200);
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
            .statusCode(200);
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

}
