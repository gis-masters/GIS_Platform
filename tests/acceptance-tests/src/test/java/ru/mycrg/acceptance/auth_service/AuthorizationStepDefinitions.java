package ru.mycrg.acceptance.auth_service;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.Cookie;
import io.restassured.response.Response;
import ru.mycrg.acceptance.BaseStepsDefinitions;

import java.util.HashMap;
import java.util.Map;

import static java.lang.Thread.sleep;
import static org.apache.http.HttpStatus.SC_OK;
import static org.apache.http.HttpStatus.SC_UNAUTHORIZED;
import static org.junit.Assert.*;
import static ru.mycrg.acceptance.auth_service.OrganizationStepsDefinitions.*;
import static ru.mycrg.acceptance.auth_service.UserStepsDefinitions.userDto;

public class AuthorizationStepDefinitions extends BaseStepsDefinitions {

    public static final String AUTH_COOKIE = "crgAuthCookie";
    public static final String AUTH_COOKIE_VALUE_SEPARATOR = "---crg---";

    @When("Авторизируемся под рутом")
    public Cookie authorizeAsRoot() throws InterruptedException {
        response = authorizeUser(rootUserName, rootPassword);

        checkCookieAndWriteAsCurrent(response);

        return response.getDetailedCookie(AUTH_COOKIE);
    }

    @When("Авторизируемся пользователем")
    public void tryToAuthorizeUser() throws InterruptedException {
        response = authorizeUser(userDto.getEmail(), userDto.getPassword());

        checkCookieAndWriteAsCurrent(response);
    }

    @When("Авторизируемся владельцем организации")
    public void tryToGetAuthorizeAdmin() throws InterruptedException {
        response = authorizeUser(orgDto.getOwner().getEmail(), orgDto.getOwner().getPassword());

        checkCookieAndWriteAsCurrent(response);
    }

    @And("Пользователь не может авторизоваться")
    public void notPossibleToLogin() {
        Map<String, String> queryParams = new HashMap<String, String>() {{
            put("username", userDto.getEmail());
            put("password", userDto.getPassword());
            put("grant_type", "password");
        }};

        getBaseRequest()
                .given().
                formParams(queryParams)
                .when().
                        post("/oauth/token")
                .then().
                        log().ifValidationFails().
                        statusCode(SC_UNAUTHORIZED);
    }

    @When("Пользователь разлогинивается")
    public void logout() {
        response = getBaseRequest()
                .when().
                        post("/perform_logout");
    }

    @Then("Сервер обнуляет cookie")
    public void checkCookieIsEmpty() {
        cookie = response.getDetailedCookie(AUTH_COOKIE);

        assertNotNull(cookie);
        assertEquals(cookie.getMaxAge(), 0);
        assertEquals(cookie.getValue(), "");
    }

    @When("Пользователь пытается запросить что-либо, имея просроченную авторизацию")
    public void authWithOldCookie() {
        String oldAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNTEsInVzZXJfbmFtZSI6ImJhekBiYX" +
                "oiLCJzY29wZSI6WyJjcmciXSwib3JnYW5pemF0aW9ucyI6W3siaWQiOjE4LCJuYW1lIjoiQkFaIENvbXBhbnkifV0sImdyb3Vwc" +
                "yI6W10sImV4cCI6MTYxNTQwMTk2NCwiYXV0aG9yaXRpZXMiOlsiT1JHX0FETUlOIl0sImp0aSI6IjRkMDVhYzc3LWMyZmQtNDM" +
                "yNi05Mzc4LTUwY2VjYTdkYmY1MCIsImNsaWVudF9pZCI6ImFkbWluIn0.mqcrFSTUtbHgc4WsFuGeRKdi0ilgvSzJwBK5D79u_Y4";

        response = getBaseRequest().headers("Authorization", "Bearer " + oldAccessToken)
                                   .when().
                                           get("/projects");
    }

    private Response authorizeUser(String login, String password) throws InterruptedException {
        Response authResponse;

        int currentAttempt = 0;
        do {
            System.out.println("authorizeUser attempt: " + currentAttempt);
            currentAttempt++;

            Map<String, String> queryParams = new HashMap<String, String>() {{
                put("username", login);
                put("password", password);
                put("grant_type", "password");
            }};

            authResponse = getBaseRequest()
                    .given().
                            formParams(queryParams)
                    .when().
                            post("/oauth/token");

            if (authResponse.statusCode() == SC_OK) {
                return authResponse;
            } else {
                sleep(RETRY_DELAY);
            }
        } while (currentAttempt < MAX_RETRY_ATTEMPT);

        throw new RuntimeException("User not authorized: " + login);
    }

    private void checkCookieAndWriteAsCurrent(Response response) {
        cookie = response.getDetailedCookie(AUTH_COOKIE);
        String accessToken = response.getBody().toString();

        assertNotNull(cookie);
        assertNotNull(accessToken);
        assertTrue(cookie.getValue().contains(AUTH_COOKIE_VALUE_SEPARATOR));
    }
}
