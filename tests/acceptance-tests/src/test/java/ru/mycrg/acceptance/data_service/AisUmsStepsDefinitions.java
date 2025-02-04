package ru.mycrg.acceptance.data_service;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.data_service.dto.AisUmsDto;
import ru.mycrg.acceptance.data_service.dto.AisUmsModel;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.junit.Assert.*;

public class AisUmsStepsDefinitions extends BaseStepsDefinitions {

    @Override
    public RequestSpecification getBaseRequest() {
        return super.getBaseRequest().basePath("/integration/ais_ums");
    }

    @When("Пользователь отправляет запрос с валидными данными, имитирующие данные от АИС УМС")
    public void importDataFromAisUms() {
        importAisUms(generateString("STRING_16"),
                     generateString("STRING_16"),
                     generateString("STRING_16"),
                     generateString("STRING_16"),
                     generateString("STRING_16"));
    }

    @Then("Данные записаны в базу данных")
    public void checkDataInDb() {
        getAllAisUms();
        List<String> ids = response.jsonPath().getList("content.id");

        assertFalse(ids.isEmpty());
    }

    @When("Пользователь отправляет запрос с не валидными данными, имитирующие данные от АИС УМС {string} {string} {string} {string} {string}")
    public void importDataFromAisUmsWithIncorrectBody(String nameTemplate,
                                                      String cadNumTemplate,
                                                      String regNumTemplate,
                                                      String propertyTypeTemplate,
                                                      String departmentNameTemplate) {
        importAisUms(generateString(nameTemplate),
                     generateString(cadNumTemplate),
                     generateString(regNumTemplate),
                     generateString(propertyTypeTemplate),
                     generateString(departmentNameTemplate));
    }

    @Given("В БД хранятся данные с одинаковым кадастровым номером от АИС УМС, в кол-ве {int} шт")
    public void initDataInBd(int count) {
        for (int i = 0; i < count; i++) {
            importAisUms(generateString("STRING_10"),
                         "98:12:0001:854",
                         generateString("STRING_10"),
                         generateString("STRING_10"),
                         "TEST_DEPARTMENT");
        }
    }

    @When("Администратор отправляет запрос на очистку данных")
    public void initCleanDb() {
        response = getBaseRequestWithCurrentCookie()
                .given()
                .when().
                        log().ifValidationFails().
                        get("/clean");
    }

    @Then("В БД нет объектов, с одинаковым кадастровым номером")
    public void checkUniqCadNum() {
        getAllAisUms();
        List<String> cadNums = response.jsonPath().getList("content.cadNum");
        Set<String> uniqCadNums = new HashSet<>(cadNums);

        assertEquals(uniqCadNums.size(), cadNums.size());
    }

    @And("Администратор отправляет запрос на очистку БД от тестовых записей\\(departmentName=TEST)")
    public void initDeleteByDepName() {
        response = getBaseRequestWithCurrentCookie()
                .given()
                .when().
                        log().ifValidationFails().
                        delete("/delete?departmentName=TEST");
    }

    @Then("В БД нет объектов, с departmentName=TEST")
    public void checkNoAisUmsWithDepNameTest() {
        getAllAisUms();
        List<String> departmentNames = response.jsonPath().getList("content.departmentName");

        assertFalse(departmentNames.contains("TEST"));
    }

    private void getAllAisUms() {
        response = getBaseRequestWithCurrentCookie()
                .given()
                .when().
                        log().ifValidationFails().
                        get();
    }

    private void importAisUms(String name,
                              String cadNum,
                              String regNum,
                              String propertyType,
                              String departmentName) {
        AisUmsModel aisUmsModel = new AisUmsModel(
                List.of(new AisUmsDto(name, cadNum, regNum, propertyType, departmentName)));

        response = getBaseRequest()
                .header("Authorization", "s-mxDFHIgKFSSppWScJoq_ZbcRFlNiaQ")
                .given().
                        body(gson.toJson(aisUmsModel)).
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        post("/import");
    }
}
