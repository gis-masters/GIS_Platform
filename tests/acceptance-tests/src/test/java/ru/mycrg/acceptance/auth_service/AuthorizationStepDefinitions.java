package ru.mycrg.acceptance.auth_service;

import io.cucumber.java.en.And;
import io.cucumber.java.en.When;
import io.restassured.http.Cookie;
import io.restassured.response.Response;
import ru.mycrg.acceptance.BaseStepsDefinitions;

import java.util.HashMap;
import java.util.Map;

import static java.lang.Thread.sleep;
import static org.apache.http.HttpStatus.SC_OK;
import static org.apache.http.HttpStatus.SC_UNAUTHORIZED;
import static org.junit.Assert.assertNotNull;
import static ru.mycrg.acceptance.auth_service.OrganizationStepsDefinitions.*;
import static ru.mycrg.acceptance.auth_service.UserStepsDefinitions.currentUserDto;

public class AuthorizationStepDefinitions extends BaseStepsDefinitions {

    @When("Авторизируемся под рутом")
    public Cookie getRootAuthority() throws InterruptedException {
        response = authorizeUser(rootUserName, rootPassword);

        checkCookieAndWriteAsCurrent(response);

        return response.getDetailedCookie("crgAuthCookie");
    }

    @When("Авторизируемся владельцем организации {string} {string}")
    public void tryToGetAuthorizeAdmin(String login, String password) throws InterruptedException {
        response = authorizeUser(replaceString(login), replaceString(password));

        checkCookieAndWriteAsCurrent(response);
    }

    @When("Авторизируемся пользователем {string} {string}")
    public void tryToAuthorizeUser(String login, String password) throws InterruptedException {
        response = authorizeUser(replaceString(login), replaceString(password));

        checkCookieAndWriteAsCurrent(response);
    }

    @When("Авторизируемся пользователем")
    public void tryToAuthorizeUser() throws InterruptedException {
        response = authorizeUser(currentUserDto.getEmail(), currentUserDto.getPassword());

        checkCookieAndWriteAsCurrent(response);
    }

    @When("Авторизируемся владельцем организации")
    public void tryToGetAuthorizeAdmin() throws InterruptedException {
        response = authorizeUser(currentOrgDto.getOwner().getEmail(), currentOrgDto.getOwner().getPassword());

        checkCookieAndWriteAsCurrent(response);
    }

    @And("Пользователь не может авторизоваться")
    public void notPossibleToLogin() {
        Map<String, String> queryParams = new HashMap<String, String>() {{
            put("username", currentUserDto.getEmail());
            put("password", currentUserDto.getPassword());
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
        cookie = response.getDetailedCookie("crgAuthCookie");
        String accessToken = response.getBody().toString();

        assertNotNull(cookie);
        assertNotNull(accessToken);
    }
}
