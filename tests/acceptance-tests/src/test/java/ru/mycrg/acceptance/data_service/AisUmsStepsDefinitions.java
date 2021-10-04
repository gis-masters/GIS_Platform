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

    @When("Пользователь отправляет запрос с валидными данными,имитирующие данные от АИС УМС {string} {string} {string} {string} {string}")
    public void importDataFromAisUms(String name, String cadNum, String regNum, String propertyType,
                                     String departmentName) {
        String generateName = generateString(name);
        String generateCadNum = generateString(cadNum);
        String generateRegNum = generateString(regNum);
        String generatePropertyType = generateString(propertyType);
        String generateDepartmentName = generateString(departmentName);

        AisUmsDto aisUmsDto = new AisUmsDto(generateName, generateCadNum, generateRegNum, generatePropertyType,
                                            generateDepartmentName);
        AisUmsModel aisUmsModel = new AisUmsModel(List.of(aisUmsDto));

        response = getBaseRequest()
                .header("Authorization", "s-mxDFHIgKFSSppWScJoq_ZbcRFlNiaQ")
                .given().
                        body(gson.toJson(aisUmsModel)).
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        post("/import");
    }

    @Then("Данные записаны в базу данных")
    public void checkDataInDb() {
        getAllAisUms();
        List<String> ids = response.jsonPath().getList("content.id");

        assertTrue(ids.size() > 0);
    }

    @When("Пользователь отправляет запрос с не валидными данными,имитирующие данные от АИС УМС {string} {string} {string} {string} {string}")
    public void importDataFromAisUmsWithIncorrectBody(String name, String cadNum, String regNum, String propertyType,
                                                      String departmentName) {
        importDataFromAisUms(name, cadNum, regNum, propertyType, departmentName);
    }

    @Given("В БД хранятся данные с одинаковым кадастровым номером от АИС УМС, в кол-ве {int} шт")
    public void initDataInBd(int count) {
        for (int i = 0; i < count; i++) {
            importDataFromAisUms("STRING_10", "98:12:0001:854", "STRING_10", "STRING_10", "TEST");
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
}
