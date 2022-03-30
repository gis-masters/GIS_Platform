package ru.mycrg.acceptance.auth_service;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.Cookie;
import ru.mycrg.acceptance.BaseStepsDefinitions;

import java.util.HashMap;
import java.util.Map;

import static org.apache.http.HttpStatus.SC_UNAUTHORIZED;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static ru.mycrg.acceptance.auth_service.AuthorizationBase.AUTH_COOKIE;
import static ru.mycrg.acceptance.auth_service.UserStepsDefinitions.userDto;

public class AuthorizationStepDefinitions extends BaseStepsDefinitions {

    private final AuthorizationBase authorizationBase = new AuthorizationBase();

    @When("Авторизируемся под рутом")
    public Cookie authorizeAsRoot() {
        response = authorizationBase.loginAsRoot();

        authorizationBase.checkCookieAndWriteAsCurrent(response);

        return response.getDetailedCookie(AUTH_COOKIE);
    }

    @When("Авторизируемся пользователем")
    public void authorizeAsCurrentUser() {
        authorizationBase.loginAsCurrentUser();
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

    @When("Авторизируемся владельцем организации")
    public void tryToGetAuthorizeAdmin() {
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
}
