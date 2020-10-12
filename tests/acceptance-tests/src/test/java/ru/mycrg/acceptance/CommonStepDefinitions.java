package ru.mycrg.acceptance;

import io.cucumber.java.en.Then;

import static org.junit.Assert.assertEquals;

public class CommonStepDefinitions extends BaseStepsDefinitions {

    @Then("Сервер отвечает со статус-кодом {int}")
    public void assertResponseCode(int status) {
        assertEquals(status, response.getStatusCode());
    }
}
