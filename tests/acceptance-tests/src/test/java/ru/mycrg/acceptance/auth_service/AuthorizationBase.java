package ru.mycrg.acceptance.auth_service;

import io.restassured.response.Response;
import ru.mycrg.acceptance.BaseStepsDefinitions;

import java.util.HashMap;
import java.util.Map;

import static java.lang.Thread.sleep;
import static org.apache.http.HttpStatus.SC_OK;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static ru.mycrg.acceptance.auth_service.OrganizationStepsDefinitions.*;
import static ru.mycrg.acceptance.auth_service.OrganizationStepsDefinitions.orgDto;
import static ru.mycrg.acceptance.auth_service.UserStepsDefinitions.userDto;

public class AuthorizationBase extends BaseStepsDefinitions {

    public static final String AUTH_COOKIE = "crgAuthCookie";
    public static final String AUTH_COOKIE_VALUE_SEPARATOR = "---crg---";

    public void loginAsRoot() {
        Response response = authorizeUser(rootUserName, rootPassword, "root");

        checkCookieAndWriteAsCurrent(response);
    }

    public void loginAsOwner() {
        Response response = authorizeUser(orgDto.getOwner().getEmail(), orgDto.getOwner().getPassword(), "owner");

        checkCookieAndWriteAsCurrent(response);
    }

    public void loginAsCurrentUser() {
        Response response = authorizeUser(userDto.getEmail(), userDto.getPassword(), "current_user");

        checkCookieAndWriteAsCurrent(response);
    }

    public void loginAsUserWithEmailAndPassword(String email, String password) {
        response = authorizeUser(email, password, "user");

        checkCookieAndWriteAsCurrent(response);
    }

    public void checkCookieAndWriteAsCurrent(Response response) {
        cookie = response.getDetailedCookie(AUTH_COOKIE);
        String accessToken = response.getBody().toString();

        assertNotNull(cookie);
        assertNotNull(accessToken);
        assertTrue(cookie.getValue().contains(AUTH_COOKIE_VALUE_SEPARATOR));
    }

    private Response authorizeUser(String login, String password, String user) {
        try {
            Response authResponse;

            int currentAttempt = 0;
            do {
                System.out.println("authorize as " + user + ". Attempt: " + currentAttempt);
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
        } catch (InterruptedException e) {
            throw new RuntimeException("Failed to authorize by user: " + login);
        }
    }
}
