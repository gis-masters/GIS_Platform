package ru.mycrg.acceptance;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.cucumber.messages.internal.com.google.gson.Gson;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import ru.mycrg.auth_service_contract.dto.GroupCreateDto;

import java.util.List;

import static java.lang.Thread.sleep;
import static org.apache.http.HttpStatus.SC_NO_CONTENT;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.CoreMatchers.hasItems;
import static org.hamcrest.CoreMatchers.not;
import static org.junit.Assert.*;

public class GroupStepsDefinitions extends BaseStepsDefinitions {

    public static GroupCreateDto currentUsersGroupDto;
    public static Integer currentUsersGroupId;
    public static int usersGroupsCount;

    public static int MAX_RETRY_ATTEMPT = 20;
    public static int RETRY_DELAY = 1000;

    @When("Администратор создает группу {string}, {string}")
    public void createUserGroup(String groupName, String groupDescription) {
        currentUsersGroupDto = new GroupCreateDto(replaceString(groupName), replaceString(groupDescription));
        String payload = new Gson().toJson(currentUsersGroupDto);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(payload).
                        contentType(ContentType.JSON)
                .when().
                        post("/groups");
    }

    @Then("Сервер передает ID созданный группы")
    public void extractUsersGroupId() {
        currentUsersGroupId = response.jsonPath().get("id");

        assertNotNull(currentUsersGroupId);
    }

    @When("Администратор делает запрос на указанную группу")
    public void getExactUsersGroup() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/groups/" + currentUsersGroupId);

    }

    @Then("Поля группы совпадают с переданными")
    public void isDataCorrect() {
        jsonPath = response.jsonPath();

        assertEquals(jsonPath.get("name"), currentUsersGroupDto.getName());
        assertEquals(jsonPath.get("description"), currentUsersGroupDto.getDescription());
    }

    @Given("Существует пользовательская группа {string}, {string}")
    public void checkUsersGroup(String groupName, String groupDescription) throws InterruptedException {
        if (!isUsersGroupExistInPool(replaceString(groupName))) {
            GroupCreateDto dto = mapToGroupDto(replaceString(groupName), replaceString(groupDescription));
            Response createResponse = createUsersGroup(dto);

            assertEquals(SC_OK, createResponse.getStatusCode());

            response = createResponse;
            Integer id = extractUsersGroupId(createResponse);

            waitUntilUsersGroupSuccessfullyCreated(id);

            currentUsersGroupId = id;
            currentUsersGroupDto = dto;
            usersGroupPool.put(id, dto);
        }
    }

    @When("Администратор делает запрос на все группы")
    public void getAllUsersGroups() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/groups?size=1000");

        assertEquals(SC_OK, response.statusCode());
    }

    @Then("В ответе есть пункт groups")
    public void areUsersGroups() {
        jsonPath = response.jsonPath();
        List<String> groups = jsonPath.get("_embedded.groups.name");

        assertTrue(groups.size() >= 1);
    }

    @When("Администратор делает запрос с сортировкой по {string} и {string} на все пользовательские группы")
    public void getAllUsersGroupsSorted(String sortingFactor, String sortingDirection) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(String.format("/groups?sort=%s,%s&%s", sortingFactor, sortingDirection, "size=1000"));
    }

    @And("Данные групп отсортированы по {string} и {string}")
    public void areUsersGroupsSorted(String sortingFactor, String sortingDirection) {
        List<String> sorted = jsonPath.getList("_embedded.groups." + sortingFactor);
        for (int i = 1; i < sorted.size(); i++) {
            if (sortingDirection.equals("asc")) {
                assertTrue(sorted.get(i - 1).compareTo(sorted.get(i)) < 1);
            } else if (sortingDirection.equals("desc")) {
                assertTrue(sorted.get(i - 1).compareTo(sorted.get(i)) > -1);
            }
        }
    }

    @When("Администратор делает постраничный запрос на все пользовательские группы")
    public void usersGroupsPerPage() {
        getAllUsersGroups();
        jsonPath = response.jsonPath();
        usersGroupsCount = jsonPath.getList("_embedded.groups.id").size();
    }

    @And("Количество страниц пропорционально количеству групп {string}")
    public void checkUsersGroupsPagesCount(String usersPerPage) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/groups?size=" + usersPerPage);

        jsonPath = response.jsonPath();

        double usersGroupsPerPageDouble = Integer.parseInt(usersPerPage);
        int estimatedPages = (int) Math.ceil(usersGroupsCount / usersGroupsPerPageDouble);
        totalPages = jsonPath.get("page.totalPages");

        assertEquals(totalPages, estimatedPages);
    }

    @And("На всех страницах есть группы {string}")
    public void isUsersGroupsOnPages(String usersGroupsPerPage) {
        for (int i = 0; i < totalPages; i++) {
            response = getBaseRequestWithCurrentCookie()
                    .when().
                            get(String.format("/groups?size=%s&page=%s", usersGroupsPerPage, i));

            jsonPath = response.jsonPath();
            List<String> usersEmails = response.jsonPath().getList("_embedded.groups.name");

            assertNotEquals(0, usersEmails.size());
        }
    }

    @When("Администратор изменяет поля группы {string}, {string}")
    public void updateUsersGroup(String newGroupName, String newGroupDescription) {
        currentUsersGroupDto = new GroupCreateDto(replaceString(newGroupName), replaceString(newGroupDescription));
        String payload = new Gson().toJson(currentUsersGroupDto);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(ContentType.JSON)
                .when().
                        body(payload).
                        patch("groups/" + currentUsersGroupId);
    }

    @When("Администратор добавляет пользователя в пользовательскую группу")
    public void addUserToUsersGroup() {
        getBaseRequestWithCurrentCookie()
                .given().
                contentType(ContentType.JSON)
                .when().
                        body("{}").
                        post(String.format("/groups/%s/users/%s", currentUsersGroupId,
                                           UserStepsDefinitions.currentUserId))
                .then().
                        log().ifValidationFails().
                        statusCode(SC_NO_CONTENT);
    }

    @Then("В пользовательской групппе присутствует указанный пользователь")
    public void isUserInUsersGroup() {
        getBaseRequestWithCurrentCookie()
                .when().
                get("groups/" + currentUsersGroupId)
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        body("users.id", hasItems(UserStepsDefinitions.currentUserId));
    }

    @When("Администратор удаляет пользователя из пользовательской группы")
    public void deleteUserToUsersGroup() {
        getBaseRequestWithCurrentCookie()
                .when().
                delete(String.format("/groups/%s/users/%s", currentUsersGroupId, UserStepsDefinitions.currentUserId))
                .then().
                        log().ifValidationFails().
                        statusCode(SC_NO_CONTENT);
    }

    @And("В пользовательской групппе отсутствует указанный пользователь")
    public void isNotUserInUsersGroup() {
        getBaseRequestWithCurrentCookie()
                .when().
                get("groups/" + currentUsersGroupId)
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        body("users.id", not(hasItems(UserStepsDefinitions.currentUserId)));
    }

    @When("Администратор организации удаляет пользовательскую группу")
    public void deleteUsersGroup() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        delete("/groups/" + currentUsersGroupId);

        assertEquals(response.statusCode(), SC_NO_CONTENT);
    }

    @Given("Существуют пользовательские группы")
    public void createMultipleUsersGroups(DataTable dataTable) {
        List<List<String>> data = dataTable.asLists();
        for (List<String> group: data) {
            createUserGroup(group);
        }
    }

    private Response createUsersGroup(GroupCreateDto dto) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(new Gson().toJson(dto)).
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        post("/groups");

        return response;
    }

    private void createUserGroup(List<String> group) {
        currentUsersGroupDto = new GroupCreateDto(replaceString(group.get(0)), replaceString(group.get(1)));
        String payload = new Gson().toJson(currentUsersGroupDto);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(payload).
                        contentType(ContentType.JSON)
                .when().
                        post("/groups");
    }

    private void isDataCorrect(String groupName, String groupDescription) {
        jsonPath = response.jsonPath();

        assertEquals(jsonPath.get("name"), replaceString(groupName));
        assertEquals(jsonPath.get("description"), replaceString(groupDescription));
    }

    private void waitUntilUsersGroupSuccessfullyCreated(Integer id) throws InterruptedException {
        System.out.println("check status users group: " + id);

        int currentAttempt = 0;
        do {
            System.out.println("attempt: " + currentAttempt);
            currentAttempt++;

            Response response = getBaseRequestWithCurrentCookie()
                    .when().
                            get("/groups/" + id);

            if (response.statusCode() == SC_OK) {
                return;
            }

            sleep(RETRY_DELAY);
        } while (currentAttempt < MAX_RETRY_ATTEMPT);

        throw new RuntimeException("Users group was not created: " + id);
    }

    private Integer extractUsersGroupId(Response response) {
        return response.jsonPath().get("id");
    }

    private boolean isUsersGroupExistInPool(String groupName) {
        return usersGroupPool
                .values().stream()
                .anyMatch(dto -> groupName.equals(dto.getName()));
    }

    private GroupCreateDto mapToGroupDto(String groupName, String groupDescription) {
        return new GroupCreateDto(groupName, groupDescription);
    }
}
