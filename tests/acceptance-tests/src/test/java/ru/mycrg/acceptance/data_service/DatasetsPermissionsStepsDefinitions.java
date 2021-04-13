package ru.mycrg.acceptance.data_service;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.data_service.dto.PermissionCreateDto;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.assertEquals;
import static ru.mycrg.acceptance.auth_service.GroupStepsDefinitions.usersGroupId;
import static ru.mycrg.acceptance.auth_service.UserStepsDefinitions.userId;
import static ru.mycrg.acceptance.data_service.DatasetsStepsDefinitions.currentDatasetName;

public class DatasetsPermissionsStepsDefinitions extends BaseStepsDefinitions {

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
        String url = response.getHeader("Location");

        Integer permissionId = extractIdFromLocation();
        assertThat(url, equalTo(makeDatasetPermissionUrl(currentDatasetName, permissionId)));
    }

    private String makeDatasetPermissionUrl(String datasetName, Integer permissionId) {
        return String.format("%s:%d/api/data/datasets/%s/roleAssignment/%s",
                             testServerHost, testServerPort, datasetName, permissionId);
    }

    @When("Администратор даёт доступ: {string} для текущего пользователя на текущий набор данных")
    public void createPermissionForCurrentUserForCurrentDataset(String role) {
        createPermissionForCurrentDataset(new PermissionCreateDto("user", userId, role));
    }

    @When("Администратор даёт доступ: {string} для текущей группы на текущий набор данных")
    public void createPermissionForCurrentGroupForCurrentDataset(String role) {
        createPermissionForCurrentDataset(new PermissionCreateDto("group", usersGroupId, role));
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
                        get(currentDatasetName + "/roleAssignment/?size=" + pageSize);
    }

    @When("Пользователь запрашивает правила для текущего набора")
    public void makePageableRequest() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(currentDatasetName + "/roleAssignment");
    }

    @And("Количество правил соответствует ожидаемому: {string}")
    public void checkPermissionsSize(String permissionsSize) {
        int realCount = getEntitiesCount("permissions");

        assertEquals(Integer.parseInt(permissionsSize), realCount);
    }

    private void createPermissionForCurrentDataset(PermissionCreateDto dto) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(dto)).
                        contentType(ContentType.JSON)
                .when().
                        post(currentDatasetName + "/roleAssignment");
    }

    private PermissionCreateDto generateRandomPermission() {
        final PermissionCreateDto permissionCreateDto = new PermissionCreateDto(
                random.nextBoolean() ? "group" : "user",
                random.nextInt(77777),
                random.nextBoolean() ? "CONTRIBUTOR" : "VIEWER");

        System.out.println(" ---------- " + permissionCreateDto);

        return permissionCreateDto;
    }
}
