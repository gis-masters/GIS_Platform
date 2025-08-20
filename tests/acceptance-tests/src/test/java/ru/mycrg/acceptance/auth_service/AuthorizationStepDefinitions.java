package ru.mycrg.acceptance.auth_service;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.auth_service_contract.dto.PasswordResetDto;
import ru.mycrg.auth_service_contract.dto.UserCreateDto;

import java.util.HashMap;
import java.util.Map;

import static java.lang.String.format;
import static org.apache.http.HttpStatus.SC_UNAUTHORIZED;
import static org.junit.Assert.*;
import static ru.mycrg.acceptance.auth_service.AuthorizationBase.AUTH_COOKIE;
import static ru.mycrg.acceptance.auth_service.AuthorizationBase.AUTH_COOKIE_VALUE_SEPARATOR;
import static ru.mycrg.acceptance.auth_service.OrganizationStepsDefinitions.orgDto;
import static ru.mycrg.acceptance.auth_service.UserStepsDefinitions.userDto;

public class AuthorizationStepDefinitions extends BaseStepsDefinitions {

    private final AuthorizationBase authorizationBase = new AuthorizationBase();

    @Given("Администратор системы авторизован")
    public void authorizeAsSystemAdmin() {
        authorizationBase.loginAsSystemAdmin();
    }

    @When("Авторизуемся пользователем")
    public void authorizeAsCurrentUser() {
        authorizationBase.loginAsCurrentUser();
    }

    @Given("Пользователь авторизован")
    public void currentUserAuthorized() {
        authorizeAsCurrentUser();
    }

    @Given("я авторизован как {string}")
    public void orgOwnerAuthorized(String userName) {
        switch (userName) {
            case "Администратор системы":
                authorizeAsSystemAdmin();
                break;
            case "пользователь":
                authorizeAsCurrentUser();
                break;
            case "Владелец организации":
                authorizeAsOrgOwner();
                break;
            default:
                UserCreateDto user = getUserByName(userName);

                authorizationBase.loginAs(user.getEmail(), user.getPassword());
                break;
        }
    }

    @Given("Владелец организации авторизован")
    public void orgOwnerAuthorized() {
        authorizationBase.loginAsOwner();
    }

    @When("Авторизуемся владельцем организации")
    public void authorizeAsOrgOwner() {
        authorizationBase.loginAsOwner();
    }

    @Given("Владелец организации пытается авторизоваться с не корректным логином {string}")
    public void tryAuthorizeWithIncorrectEmail(String email) {
        authorizationBase.authorizeAs(email, orgDto.getOwner().getPassword());
    }

    @Given("Владелец организации пытается авторизоваться с не корректным паролем {string}")
    public void tryAuthorizeWithIncorrectPassword(String password) {
        authorizationBase.authorizeAs(orgDto.getOwner().getEmail(), password);
    }

    @When("Авторизуемся пользователем у которого email прописан в верхнем регистре")
    public void authorizeAsUserIgnoreUsernameCase() {
        authorizationBase.loginAs(userDto.getEmail().toUpperCase(), userDto.getPassword());
    }

    @When("Авторизуемся пользователем у которого в поле email имеются отступы")
    public void authorizeAsUserIgnoreWhitespace() {
        authorizationBase.loginAs(String.format("   %s   ", userDto.getEmail()), userDto.getPassword());
    }

    @And("Пользователь не может авторизоваться")
    public void notPossibleToLogin() {
        Map<String, String> queryParams = new HashMap<>() {{
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

    @Given("Текущий токен пользователя сохранен")
    public void saveOldCookie() {
        authorizationBase.loginAs(userDto.getEmail(), userDto.getPassword());

        oldCookie = response.getDetailedCookie(AUTH_COOKIE);

        assertNotNull(oldCookie);
        assertTrue(oldCookie.getValue().contains(AUTH_COOKIE_VALUE_SEPARATOR));

        System.out.println("current auth cookie: " + oldCookie);
    }

    @Then("Старый токен подменен, пользователь получил права владельца на проект и успешно обновил информацию о проекте")
    public void checkThatTokenRefresh() {
        assertEquals(200, response.getStatusCode());
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

    @When("Отправляется POST запрос на эндпоинт request-password-reset, с телом в котором содержится поле email и origin")
    public void passwordResetRequest() {
        String body = "{\"email\": \"d.alekseev@mycrg.ru\", \"origin\": \"http://localhost:8100\"}";

        resetPassRequest(body);
    }

    @When("Текущий пользователь отправляет запрос на восстановление пароля")
    public void passwordResetRequestForCurrentUser() {
        String body = format("{\"email\": \"%s\", \"origin\": \"%s\"}", userDto.getEmail(), "http://localhost:8100");

        resetPassRequest(body);
    }

    @When("Пользователь делает запрос на восстановление пароля с невалидными данными {string} {string}")
    public void passwordResetRequestWithInvalidData(String email, String origin) {
        String body = format("{\"email\": \"%s\", \"origin\": \"%s\"}", email, origin);

        resetPassRequest(body);
    }

    @When("Отправляется запрос на восстановление пароля с почтой НЕ существующего пользователя")
    public void passwordResetRequestUserNotExist() {
        String body = format("{\"email\": \"%s\", \"origin\": \"http://localhost:8100\"}",
                             generateString("EMAIL_5"));

        resetPassRequest(body);
    }

    @When("Запросы на восстановление пароля отправляются чаще 1 раза в 10 секунд")
    public void passwordResetRequestMoreThenOnePerTenSeconds() {
        String body = "{\"email\": \"d.alekseev@mycrg.ru\", \"origin\": \"http://localhost:8100\"}";

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
