package ru.mycrg.acceptance.auth_service;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.http.Cookie;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.auth_service_contract.dto.PasswordResetDto;

import java.util.HashMap;
import java.util.Map;

import static java.lang.String.format;
import static org.apache.http.HttpStatus.SC_UNAUTHORIZED;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static ru.mycrg.acceptance.auth_service.AuthorizationBase.AUTH_COOKIE;
import static ru.mycrg.acceptance.auth_service.UserStepsDefinitions.userDto;

public class AuthorizationStepDefinitions extends BaseStepsDefinitions {

    private final AuthorizationBase authorizationBase = new AuthorizationBase();

    @When("Авторизируемся под рутом")
    public void authorizeAsRoot() {
        authorizationBase.loginAsRoot();
    }

    @Given("Администратор системы авторизован")
    public void authorizeAsSystemAdmin() {
        authorizeAsRoot();
    }

    @When("Авторизируемся пользователем")
    public void authorizeAsCurrentUser() {
        authorizationBase.loginAsCurrentUser();
    }

    @Given("Пользователь авторизован")
    public void currentUserAuthorized() {
        authorizeAsCurrentUser();
    }

    @When("Авторизируемся владельцем организации")
    public void authorizeAsOrgOwner() {
        authorizationBase.loginAsOwner();
    }

    @When("Авторизуемся владельцем организации")
    public void orgOwnerAuthorized() {
        authorizeAsOrgOwner();
    }

    @When("Авторизируемся пользователем у которого email прописан в верхнем регистре")
    public void authorizeAsUserIgnoreUsernameCase() {
        String email = userDto.getEmail().toUpperCase();
        authorizationBase.loginAsUserWithEmailAndPassword(email, userDto.getPassword());
    }

    @When("Авторизируемся пользователем у которого в поле email имеются отступы")
    public void authorizeAsUserIgnoreWhitespace() {
        String email = "   " + userDto.getEmail() + "   ";
        authorizationBase.loginAsUserWithEmailAndPassword(email, userDto.getPassword());
    }

    @When("Владелец организации авторизован")
    public void tryToGetAuthorizeOrgAdmin() {
        authorizationBase.loginAsOwner();
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

    @When("Происходит разлогинивание")
    public void logout() {
        response = getBaseRequest()
                .when().
                        post("/perform_logout");
    }

    @When("Пользователь разлогинивается")
    public void logoutUser() {
        response = getBaseRequestWithCurrentCookie()
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

    @When("Отправляется POST запрос на эндпоинт request-password-reset, с телом в котором содержится поле email и originHost")
    public void passwordResetRequest() {
        String body = "{\"email\": \"d.alekseev@mycrg.ru\", \"originHost\": \"http://localhost:8100\"}";

        resetPassRequest(body);
    }

    @When("Пользователь делает запрос на восстановление пароля с невалидными данными {string} {string}")
    public void passwordResetRequestWithInvalidData(String email, String originHost) {
        String body = format("{\"email\": \"%s\", \"originHost\": \"%s\"}", email, originHost);

        resetPassRequest(body);
    }

    @When("Отправляется запрос на восстановление пароля с почтой НЕ существующего пользователя")
    public void passwordResetRequestUserNotExist() {
        String body = format("{\"email\": \"%s\", \"originHost\": \"http://localhost:8100\"}",
                             generateString("EMAIL_5"));

        resetPassRequest(body);
    }

    @When("Запросы на восстановление пароля отправляются чаще 1 раза в 10 секунд")
    public void passwordResetRequestMoreThenOnePerTenSeconds() {
        String body = "{\"email\": \"d.alekseev@mycrg.ru\", \"originHost\": \"http://localhost:8100\"}";

        resetPassRequest(body);
        resetPassRequest(body);
    }

    @When("Пользователь отправляет запрос на обновление пароля с неверным токеном")
    public void passwordResetWithInvalidToken() {
        PasswordResetDto passwordReset = new PasswordResetDto();
        passwordReset.setPassword("GeoplanTest200");
        passwordReset.setToken("184eb5b35e5f479b8b3eecc6d7eb61e77eb6faba102d");

        resetPassword(gson.toJson(passwordReset));
    }

    @When("Отправляется GET запрос для проверки актуальности несуществующего токена")
    public void checkToken() {
        checkResetToken("someNotExistResetToken");
    }

    @And("Тело ответа содержит ошибку о том что токен невалидный")
    public void checkErrorMessage() {
        String error = response.jsonPath().get("message");

        assertNotNull(error);
        assertEquals("Token invalid or expired", error);
    }

    private void resetPassRequest(String body) {
        response = getBaseRequest()
                .given().
                        body(body).
                        contentType(ContentType.JSON)
                .when().
                        post("/request-password-reset");
    }

    private void resetPassword(String body) {
        response = getBaseRequest()
                .given().
                        body(body).
                        contentType(ContentType.JSON)
                .when().
                        post("/password-reset");
    }

    private void checkResetToken(String token) {
        response = getBaseRequest()
                .when().
                        get("/password-reset?token=" + token);
    }
}
