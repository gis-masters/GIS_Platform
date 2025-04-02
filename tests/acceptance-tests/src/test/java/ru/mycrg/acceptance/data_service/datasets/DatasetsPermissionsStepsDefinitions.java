package ru.mycrg.acceptance.data_service.datasets;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.auth_service.AuthorizationBase;
import ru.mycrg.acceptance.data_service.dto.PermissionCreateDto;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.assertEquals;
import static ru.mycrg.acceptance.auth_service.UserGroupStepsDefinitions.usersGroupId;
import static ru.mycrg.acceptance.auth_service.UserStepsDefinitions.userId;
import static ru.mycrg.acceptance.data_service.datasets.DatasetsStepsDefinitions.currentDatasetIdentifier;

public class DatasetsPermissionsStepsDefinitions extends BaseStepsDefinitions {

    private final AuthorizationBase authorizationBase = new AuthorizationBase();

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie()
                    .basePath("/api/data/datasets/");
    }

    @Then("Отправляется запрос на создание правила для текущего набора данных {string} {string} {string}")
    public void createPermissionForCurrentDataset(String role, String principalIdKey, String principalType) {
        createPermissionForCurrentDataset(
                new PermissionCreateDto(principalType,
                                        Long.parseLong(generateString(principalIdKey)),
                                        role));
    }

    @And("Сервер передаёт Location созданного правила")
    public void shouldReturnCorrectDatasetPermissionLocation() {
        Integer permissionId = extractId(response);

        assertThat(response.getHeader("Location"),
                   equalTo(makeDatasetPermissionUrl(currentDatasetIdentifier, permissionId)));
    }

    @When("Администратор даёт доступ: {string} для текущего пользователя на текущий набор данных")
    public void createPermissionForCurrentUserForCurrentDataset(String role) {
        authorizationBase.loginAsOwner();

        createPermissionForCurrentDataset(new PermissionCreateDto("user", userId, role));
    }

    @When("Администратор даёт доступ: {string} для текущей группы на текущий набор данных")
    public void createPermissionForCurrentGroupForCurrentDataset(String role) {
        createPermissionForCurrentDataset(new PermissionCreateDto("group", usersGroupId, role));
    }

    @When("Пользователь пытается удалить любое из правил для текущего набора")
    public void tryDeleteAnyPermission() {
        authorizationBase.loginAsCurrentUser();

        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(currentDatasetIdentifier + "/roleAssignment");

        Integer firstPermissionId = response.jsonPath().get("content[0].id");

        deletePermissionForCurrentDataset(firstPermissionId);
    }

    @Given("Текущему набору задаётся некое кол-во правил: {int}")
    public void initSomePermissionsForCurrentDataset(int count) {
        for (int i = 0; i < count; i++) {
            createPermissionForCurrentDataset(generateRandomPermission());
        }
    }

    @When("Текущий пользователь запрашивает правила для текущего набора, с размером страницы: {string}")
    public void makePageableRequest(String pageSize) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(currentDatasetIdentifier + "/roleAssignment/?size=" + pageSize);
    }

    @When("Пользователь запрашивает правила для текущего набора")
    public void makePageableRequest() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(currentDatasetIdentifier + "/roleAssignment");
    }

    @And("Количество правил соответствует ожидаемому: {string}")
    public void checkPermissionsSize(String permissionsSize) {
        int realCount = getEntitiesCount();

        assertEquals(Integer.parseInt(permissionsSize), realCount);
    }

    @And("Общее кол-во страниц соответствует ожидаемому: {string}")
    public void checkTotalPages(String expectedTotalPages) {
        totalPages = jsonPath.get("page.totalPages");

        assertEquals(Integer.parseInt(expectedTotalPages), totalPages);
    }

    private void createPermissionForCurrentDataset(PermissionCreateDto dto) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(dto)).
                        contentType(ContentType.JSON)
                .when().
                        post(currentDatasetIdentifier + "/roleAssignment");
    }

    private void deletePermissionForCurrentDataset(Integer permissionId) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        delete(String.format("%s/roleAssignment/%d", currentDatasetIdentifier, permissionId));
    }

    private PermissionCreateDto generateRandomPermission() {
        return new PermissionCreateDto(random.nextBoolean() ? "group" : "user",
                                       random.nextInt(77777),
                                       random.nextBoolean() ? "CONTRIBUTOR" : "VIEWER");
    }

    private String makeDatasetPermissionUrl(String datasetName, Integer permissionId) {
        return String.format("%s:%d/api/data/datasets/%s/roleAssignment/%s",
                             testServerHost, testServerPort, datasetName, permissionId);
    }
}
