package ru.mycrg.acceptance.data_service;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.data_service.dto.PermissionCreateDto;

import java.util.LinkedHashMap;
import java.util.Map;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.IsEqual.equalTo;
import static ru.mycrg.acceptance.auth_service.UserStepsDefinitions.userId;

public class LibraryPermissionsStepsDefinitions extends BaseStepsDefinitions {

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie()
                    .basePath("/api/data/document-libraries");
    }

    @When("Пользователь делает запрос на выборку библиотек")
    public void getAllLibraries() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get();
    }

    @When("Пользователь делает запрос на выборку не существующей библиотеки {string}")
    public void getNotExistLibrary(String libraryKey) {
        String libraryName = generateString(libraryKey);

        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + libraryName);
    }

    @Then("Отправляется запрос на создание правила для библиотеки: {string}, {string} {string} {string}")
    public void createPermissionForCurrentLibrary(String libraryName,
                                                  String role,
                                                  String principalIdKey,
                                                  String principalType) {
        long principalId = Long.parseLong(generateString(principalIdKey));
        PermissionCreateDto dto = new PermissionCreateDto(principalType, principalId, role);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(dto)).
                        contentType(ContentType.JSON)
                .when().
                        post("/" + libraryName + "/roleAssignment");
    }

    @And("Сервер передаёт Location созданного правила библиотеки: {string}")
    public void shouldReturnCorrectLibraryPermissionLocation(String libraryName) {
        String url = response.getHeader("Location");

        Integer permissionId = extractIdFromLocation();

        assertThat(url, equalTo(makeLibraryPermissionUrl(libraryName, permissionId)));
    }

    @Given("Владелец организации устанавливает роль {string} для текущего пользователя, для библиотеки: {string}")
    public void addRuleToLibraryForCurrentUser(String role, String libraryName) {
        addPermissionToLibrary(libraryName, userId, "user", role);
    }

    private String makeLibraryPermissionUrl(String libraryName, Integer permissionId) {
        return String.format("%s:%d/api/data/document-libraries/%s/roleAssignment/%s",
                             testServerHost, testServerPort, libraryName, permissionId);
    }

    private void addPermissionToLibrary(String libraryName, Integer principalId, String principalType, String role) {
        Map<String, String> payload = new LinkedHashMap<>();
        payload.put("principalId", principalId.toString());
        payload.put("principalType", principalType);
        payload.put("role", role);

        final String url = String.format("/%s/roleAssignment", libraryName);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(payload)).
                        contentType(ContentType.JSON)
                .when().
                        post(url);
    }
}
