package ru.mycrg.acceptance.auth_service;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.auth_service_contract.dto.OrganizationIntentDto;

import static ru.mycrg.acceptance.auth_service.OrganizationStepsDefinitions.orgDto;

public class OrganizationIntentStepDefinitions extends BaseStepsDefinitions {

    @Override
    public RequestSpecification getBaseRequest() {
        return super.getBaseRequest().basePath("/organizations/intents");
    }

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie().basePath("/organizations/intents");
    }

    @When("я отправляю идентификатор не существующей специализации")
    public void createIntentWithIncorrectSpecialization() {
        OrganizationIntentDto dto = new OrganizationIntentDto("localhost", "asd@asd", 314);

        createIntent(dto);
    }

    @When("я отправляю заявку на создание новой организации используя email уже существующего в системе пользователя")
    public void createIntentWithAlreadyExistEmail() {
        OrganizationIntentDto dto = new OrganizationIntentDto("localhost", orgDto.getOwner().getEmail(), 1);

        createIntent(dto);
    }

    @Given("существует заявка на создание новой организации от {string}")
    public void existIntent(String email) {
        OrganizationIntentDto dto = new OrganizationIntentDto("localhost", email, 1);

        createIntent(dto);
    }

    @When("я отправляю заявку на создание новой организации: {string}")
    public void createIntent(String email) {
        OrganizationIntentDto dto = new OrganizationIntentDto("localhost", email, 1);

        createIntent(dto);
    }

    private void createIntent(OrganizationIntentDto intent) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(ContentType.JSON)
                .when().
                        body(gson.toJson(intent)).
                        post();
    }
}
