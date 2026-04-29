package ru.mycrg.acceptance.auth_service;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.auth_service_contract.dto.PasswordResetDto;

import java.util.HashMap;
import java.util.Map;

import static org.apache.http.HttpStatus.SC_OK;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static ru.mycrg.acceptance.auth_service.UserStepsDefinitions.userDto;
import static ru.mycrg.acceptance.auth_service.UserStepsDefinitions.userId;

public class PasswordResetStepDefinitions extends BaseStepsDefinitions {

    private static final String DEFAULT_ORIGIN = "http://localhost:8100";

    public static String passwordResetToken;

    private final AuthorizationBase authorizationBase = new AuthorizationBase();

    @Given("отправлен запрос восстановления пароля для {string}")
    public void requestPasswordReset(String email) {
        Map<String, String> body = new HashMap<>();
        body.put("email", email);
        body.put("origin", DEFAULT_ORIGIN);

        response = getBaseRequest()
                .given().
                        body(gson.toJson(body)).
                        contentType(ContentType.JSON)
                .when().
                        post("/request-password-reset");

        assertEquals(SC_OK, response.getStatusCode());
    }

    @Given("получен токен для восстановления пароля")
    public void getPasswordResetToken() {
        assertNotNull("В контексте сценария должен быть ID пользователя", userId);

        passwordResetToken = null;

        response = getBaseRequest()
                .when().
                        get("/password-reset-token/" + userId);

        if (response.getStatusCode() == SC_OK) {
            passwordResetToken = unwrapToken(response.asString());

            assertNotNull(passwordResetToken);
            assertFalse(passwordResetToken.isBlank());
        }
    }

    @When("пользователь отправляет пароль {string}")
    public void resetPassword(String password) {
        assertNotNull("В контексте сценария должен быть токен восстановления", passwordResetToken);

        PasswordResetDto passwordResetDto = new PasswordResetDto();
        passwordResetDto.setPassword(password);
        passwordResetDto.setToken(passwordResetToken);

        response = getBaseRequest()
                .given().
                        body(gson.toJson(passwordResetDto)).
                        contentType(ContentType.JSON)
                .when().
                        post("/password-reset");

        assertEquals(SC_OK, response.getStatusCode());
    }

    @Then("пользователь {string} успешно авторизуется с паролем {string}")
    public void userSuccessfullyAuthorizedWithPassword(String email, String password) {
        AuthorizationBase.authorizationCache.remove(email);

        Map<String, String> queryParams = new HashMap<>();
        queryParams.put("username", email);
        queryParams.put("password", password);
        queryParams.put("grant_type", "password");

        response = getBaseRequest()
                .given().
                        formParams(queryParams)
                .when().
                        post("/oauth/token");

        assertEquals(SC_OK, response.getStatusCode());

        authorizationBase.checkCookieAndWriteAsCurrent(response);

        if (userDto != null && email.equalsIgnoreCase(userDto.getEmail())) {
            userDto.setPassword(password);
        }
    }

    private String unwrapToken(String token) {
        String trimmed = token.trim();

        if (trimmed.startsWith("\"") && trimmed.endsWith("\"")) {
            return trimmed.substring(1, trimmed.length() - 1);
        }

        return trimmed;
    }
}
