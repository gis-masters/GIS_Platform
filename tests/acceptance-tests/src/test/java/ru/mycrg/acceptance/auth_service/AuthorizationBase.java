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
import static ru.mycrg.acceptance.auth_service.UserStepsDefinitions.userDto;

public class AuthorizationBase extends BaseStepsDefinitions {

    public static final String AUTH_COOKIE = "crgAuthCookie";
    public static final String AUTH_COOKIE_VALUE_SEPARATOR = "---crg---";
    public static final String DEFAULT_TEST_PASSWORD = "testPassword1";

    public static int authCounter;
    public static int authCacheUsedCounter;

    public static Map<String, Response> authorizationCache = new HashMap<>();

    public void loginAsSystemAdmin() {
        System.out.println("login as root");
        Response response = authorizeWithRetry(rootUserName, rootPassword);

        checkCookieAndWriteAsCurrent(response);
    }

    public void loginAsOwner() {
        loginAsOwner(true);
    }

    public void loginAsOwner(boolean cachable) {
        System.out.println("login as owner: " + orgDto.getOwner().getEmail());
        response = authorizeWithRetry(orgDto.getOwner().getEmail(), orgDto.getOwner().getPassword(), cachable);

        checkCookieAndWriteAsCurrent(response);
    }

    public void loginAsCurrentUser() {
        System.out.println("login as current user: " + userDto.getEmail());
        response = authorizeWithRetry(userDto.getEmail(), userDto.getPassword());

        checkCookieAndWriteAsCurrent(response);
    }

    public void loginAs(String email, String password) {
        System.out.println("login as user: " + email);
        response = authorizeWithRetry(email, password);

        checkCookieAndWriteAsCurrent(response);
    }

    public void checkCookieAndWriteAsCurrent(Response response) {
        cookie = response.getDetailedCookie(AUTH_COOKIE);
        String accessToken = response.getBody().toString();

        assertNotNull(cookie);
        assertNotNull(accessToken);
        assertTrue(cookie.getValue().contains(AUTH_COOKIE_VALUE_SEPARATOR));

        System.out.println("current auth cookie: " + cookie);
    }

    public void authorizeAs(String login,
                            String password) {
        System.out.println("Try authorize as " + login);

        Map<String, String> queryParams = new HashMap<>() {{
            put("username", login);
            put("password", password);
            put("grant_type", "password");
        }};

        getBaseRequest()
                .given().
                        formParams(queryParams)
                .when().
                        post("/oauth/token");
    }

    private Response authorizeWithRetry(String login, String password) {
        return authorizeWithRetry(login, password, true);
    }

    private Response authorizeWithRetry(String login,
                                        String password,
                                        boolean cachable) {
        if (cachable && authorizationCache.containsKey(login)) {
            authCacheUsedCounter++;

            return authorizationCache.get(login);
        }

        try {
            Response authResponse;

            int currentAttempt = 0;
            do {
                System.out.println("authorize as " + login + ". Attempt: " + currentAttempt);
                currentAttempt++;

                Map<String, String> queryParams = new HashMap<>() {{
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
                    authCounter++;
                    authorizationCache.put(login, authResponse);

                    return authResponse;
                } else {
                    sleep(RETRY_DELAY);
                }
            } while (currentAttempt < MAX_RETRY_ATTEMPT);

            throw new RuntimeException("User not authorized: " + login);
        } catch (InterruptedException e) {
            throw new RuntimeException("Failed to authorize by userType: " + login);
        }
    }
}
