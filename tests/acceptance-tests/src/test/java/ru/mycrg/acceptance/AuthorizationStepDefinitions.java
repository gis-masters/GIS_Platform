package ru.mycrg.acceptance;

import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.Cookie;
import io.restassured.response.Response;

import java.util.HashMap;
import java.util.Map;

import static java.lang.Thread.sleep;
import static org.junit.Assert.assertNotNull;
import static ru.mycrg.acceptance.OrganizationStepsDefinitions.MAX_RETRY_ATTEMPT;
import static ru.mycrg.acceptance.OrganizationStepsDefinitions.RETRY_DELAY;

public class AuthorizationStepDefinitions extends BaseStepsDefinitions {

    @When("Авторизируемся под рутом")
    public Cookie getRootAuthority() throws InterruptedException {
        response = authorizeUser(rootUserName, rootPassword);

        checkCookieAndWriteAsCurrent(response);

        return response.getDetailedCookie("crgAuthCookie");
    }

    @When("Авторизируемся владельцем организации {string} {string}")
    public void tryToGetAuthorizeAdmin(String login, String password) throws InterruptedException {
        response = authorizeUser(login, password);

        checkCookieAndWriteAsCurrent(response);
    }

    @When("Авторизируемся пользователем {string} {string}")
    public void tryToAuthorizeUser(String login, String password) throws InterruptedException {
        response = authorizeUser(login, password);

        checkCookieAndWriteAsCurrent(response);
    }

    @When("Пытаемся авторизоваться пользователем {string} {string}")
    public void tryToAuthorize(String login, String password) throws InterruptedException {
        Map<String, String> queryParams = new HashMap<String, String>() {{
            put("username", login);
            put("password", password);
            put("grant_type", "password");
        }};

        response = getBaseRequest()
                .given().
                        formParams(queryParams)
                .when().
                        post("/oauth/token");
    }

    @Then("Сервер авторизует пользователя")
    public void serverAuthorizeUser() {
        checkCookieAndWriteAsCurrent(response);
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

            if (authResponse.statusCode() == 200) {
                return authResponse;
            } else {
                sleep(RETRY_DELAY);
            }
        } while (currentAttempt < MAX_RETRY_ATTEMPT);

        throw new RuntimeException("User not authorized: " + login);
    }

    private void checkCookieAndWriteAsCurrent(Response response) {
        cookie = response.getDetailedCookie("crgAuthCookie");
        String accessToken = response.getBody().toString();

        assertNotNull(cookie);
        assertNotNull(accessToken);
    }
}
