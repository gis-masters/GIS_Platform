package ru.mycrg.acceptance;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.Before;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.cucumber.messages.internal.com.google.gson.Gson;
import io.restassured.http.ContentType;
import ru.mycrg.auth_service_contract.dto.UserCreateDto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.junit.Assert.*;

public class UserStepsDefinitions extends BaseStepsDefinitions {
    public static UserCreateDto user;

    public static String userId;
    public static int usersCount;
    public static int totalPages;

    @Before
    public void setup() {
        super.setup();
    }

    @When("Администратор создает пользователя")
    public void createUser(DataTable dataTable) {
        setup();
        List<String> data = dataTable.asList();

        user = new UserCreateDto(replaceString(data.get(0)), replaceString(data.get(1)),
                replaceString(data.get(2)), replaceString(data.get(3)));

        String payload = new Gson().toJson(user);

        response = request
                .body(payload)
                .contentType(ContentType.JSON)
                .cookie(cookie)
                .when()
                .post("/users");
    }

    @Then("Пользователю присвоена роль = {string}")
    public void isUserRoleIsUser(String role) {
        response = request
                .cookie(cookie)
                .when()
                .get("/users/" + userId);

        jsonPath = response.jsonPath();

        assertEquals(jsonPath.getList("authorities.authority").get(0), role);
    }

    @Given("Существует пользователь")
    public void checkUser(DataTable dataTable) {
        if (!users.containsKey(dataTable.asList().get(2))) {
            createUser(dataTable);
        }
    }

    @When("Администратор организации удаляет пользователя")
    public void deleteUser() {
        response = request
                .cookie(cookie)
                .when()
                .delete("/users/" + userId);
    }

    @And("в заголовке Location передает ID созданного пользователя")
    public void extractLocation() {
        String header = response.getHeader("Location");
        Pattern pattern = Pattern.compile("\\d+$");
        Matcher matcher = pattern.matcher(header);

        while (matcher.find()) {
            userId = matcher.group();
        }

        assertNotEquals("", userId);
    }

    @When("Администратор делает запрос с сортировкой по {string} и {string} на всех пользователей")
    public void getAllUsersSorted(String sortingType, String sortingDirection) {
        response = request
                .cookie(cookie)
                .when()
                .get("/users?sort=" + sortingType + "," + sortingDirection);
    }

    @And("В ответе есть пункт users")
    public void isUsers() {
        jsonPath = response.jsonPath();
        ArrayList<String> users = jsonPath.get("_embedded.users.email");
        assertTrue(users.size() >= 2);
    }

    @Then("Данные отсортированы по {string} и {string}")
    public void isUsersSorted(String sortingType, String sortingDirection) {
        List<String> sorted = jsonPath.getList("_embedded.users." + sortingType);
        for (int i = 1; i < sorted.size(); i++) {
            if (sortingDirection.equals("asc")) {
                assertTrue(sorted.get(i - 1).compareTo(sorted.get(i)) < 1);
            } else if (sortingDirection.equals("desc")) {
                assertTrue(sorted.get(i - 1).compareTo(sorted.get(i)) > -1);
            }
        }
    }

    @When("Администратор делает запрос на указанного пользователя")
    public void getExactUser() {
        response = request
                .cookie(cookie)
                .when()
                .get("/users/" + userId);
    }

    @When("Администратор делает запрос на всех пользователей")
    public void getAllUsers() {
        response = request
                .cookie(cookie)
                .when()
                .get("/users");
    }


    @When("Администратор делает постраничный запрос на всех пользователей {string}")
    public void getAllUsersPaginated(String usersPerPage) {
        getAllUsers();
        jsonPath = response.jsonPath();
        usersCount = jsonPath.getList("_embedded.users.id").size();
    }

    @And("Количество страниц пропорционально {string}")
    public void checkPagesCount(String usersPerPage) {
        response = request
                .cookie(cookie)
                .when()
                .get("/users?size=" + usersPerPage);
        jsonPath = response.jsonPath();

        double usersPerPageDouble = Integer.parseInt(usersPerPage);
        int estimatedPages = (int) Math.ceil(usersCount / usersPerPageDouble);
        totalPages = jsonPath.get("page.totalPages");

        assertEquals(totalPages, estimatedPages);
    }

    @Then("Поля пользователя совпадают с переданными {string}, {string}, {string}")
    public void isDataCorrect(String userName, String userSurname, String userEmail) {
        jsonPath = response.jsonPath();

        assertEquals(jsonPath.get("name"), userName);
        assertEquals(jsonPath.get("surName"), userSurname);
        assertEquals(jsonPath.get("email"), userEmail);

        users.put(user.getEmail(), user);
    }

    @And("На всех страницах есть пользователи {string}")
    public void isUsersOnPages(String usersPerPage) {
        for (int i = 0; i < totalPages; i++) {
            setup();
            String url = String.format("/users?size=%s&page=%s", usersPerPage, i);
            response = request
                    .cookie(cookie)
                    .when()
                    .get(url);

            jsonPath = response.jsonPath();
            List<String> usersEmails = response.jsonPath().getList("_embedded.users.email");

            assertNotEquals(0, usersEmails.size());
        }
    }
}
