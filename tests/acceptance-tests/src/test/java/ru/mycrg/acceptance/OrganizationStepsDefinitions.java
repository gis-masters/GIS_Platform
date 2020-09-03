package ru.mycrg.acceptance;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.Before;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.cucumber.messages.internal.com.google.gson.Gson;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.auth_service_contract.dto.OrganizationCreateDto;
import ru.mycrg.auth_service_contract.dto.UserCreateDto;

import java.util.List;

import static org.junit.Assert.assertEquals;

public class OrganizationStepsDefinitions {

    private static String testServerHost;
    private static int testServerPort;
    private static String rootUserName;
    private static String rootPassword;

    private static RequestSpecification request;
    private static Response response;

    @Before
    public static void setup() {
        testServerHost = System.getProperty("env.HOST");
        rootUserName = System.getProperty("env.ROOT_NAME");
        rootPassword = System.getProperty("env.ROOT_PASS");

        assert testServerHost != null && rootPassword != null && rootUserName != null
                : "You should specify test server HOST as '-Denv.HOST', PORT as '-Denv.PORT', ROOT_NAME as '-Denv" +
                ".ROOT_NAME', ROOT_PASS as '-Denv.ROOT_PASS'";
        testServerPort = Integer.parseInt(System.getProperty("env.PORT"));

        request = RestAssured.given();
        request.baseUri(testServerHost);
        request.port(testServerPort);
        request.basePath("/organizations");
    }

    @When("Пользователь вводит корректные данные")
    public void createValidOrganization(DataTable dataTable) {
        List<String> data = dataTable.asList();

        UserCreateDto owner = new UserCreateDto(data.get(2), data.get(3), data.get(4), data.get(5));
        OrganizationCreateDto org = new OrganizationCreateDto(data.get(0), data.get(1), owner);

        String payload = new Gson().toJson(org);

        response = request
                    .body(payload)
                    .contentType(ContentType.JSON)
                .when()
                    .post("/init");
    }

    @Then("Сервер отвечает статус-кодом {int}")
    public void assertResponseCode(int status) {
        assertEquals(status, response.getStatusCode());
    }

}
