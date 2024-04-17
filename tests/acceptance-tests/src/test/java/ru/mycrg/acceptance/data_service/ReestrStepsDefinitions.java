package ru.mycrg.acceptance.data_service;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.auth_service.AuthorizationBase;
import ru.mycrg.acceptance.data_service.dto.ReestrItemDto;

import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class ReestrStepsDefinitions extends BaseStepsDefinitions {

    private final AuthorizationBase authorizationBase = new AuthorizationBase();

    @Override
    public RequestSpecification getBaseRequest() {
        return super.getBaseRequest().basePath("/api/data/reestrs");
    }

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie().basePath("/api/data/reestrs");
    }

    @When("В реестре {string} существуют записи")
    public void createRecordsInReestr(String tableName, DataTable dataTable) {
        List<List<String>> payload = dataTable.asLists();
        for (List<String> row: payload) {
            ReestrItemDto item = new ReestrItemDto(row.get(0), row.get(1), row.get(2), row.get(3));

            createRecordInReestr(tableName, item);

            response.then().statusCode(201);
        }
    }

    @When("Пользователь делает запрос на все реестры")
    public void fetchAllKnownReestrs() {
        super.get1000Entities();
    }

    @Then("Сервер отвечает постраничным списком существующих реестров")
    public void checkPagingStructure() {
        jsonPath = response.jsonPath();

        Map<String, String> presentedData = jsonPath.getMap("");
        assertTrue(presentedData.containsKey("content"));
        assertTrue(presentedData.containsKey("page"));

        Map<String, String> page = jsonPath.getMap("page");
        assertTrue(page.containsKey("size"));
        assertTrue(page.containsKey("totalElements"));
        assertTrue(page.containsKey("totalPages"));
        assertTrue(page.containsKey("number"));

        List<Object> content = jsonPath.getList("content");
        assertFalse(content.isEmpty());
    }

    @When("Администратор делает запрос на выборку из реестра входящих с сортировкой по {string} и {string}")
    public void checkReestrSorting(String field, String direction) {
        authorizationBase.loginAsOwner();

        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(String.format("/reestr_incoming/records?sort=%s,%s&%s", field, direction, "size=1000"));
    }

    @When("Администратор делает запрос на выборку из реестра входящих с фильтрацией по полю {string} и значению {string}")
    public void getItemsByFilter(String field, String value) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(String.format("/reestr_incoming/records?filter=%s like '%s'", field, value));
    }

    private void createRecordInReestr(String tableName, ReestrItemDto item) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(item)).
                        contentType(ContentType.JSON)
                .when().
                        post("/" + tableName + "/records");
    }
}
