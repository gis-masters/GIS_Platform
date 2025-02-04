package ru.mycrg.acceptance.auth_service;

import io.cucumber.java.en.And;
import io.cucumber.java.en.When;
import io.restassured.common.mapper.TypeRef;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.common_contracts.generated.specialization.SpecializationView;

import java.util.List;

import static org.junit.Assert.assertFalse;

public class SpecializationsStepsDefinitions extends BaseStepsDefinitions {

    @Override
    public RequestSpecification getBaseRequest() {
        return super.getBaseRequest().basePath("/specializations");
    }

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie().basePath("/specializations");
    }

    @When("я запрашиваю специализации")
    public void getAllSpecializations() {
        super.getAllEntities();
    }

    @And("специализации получены в ожидаемом формате")
    public void checkSpecializationFormat() {
        List<SpecializationView> specializations = response.then()
                .extract()
                .as(new TypeRef<>() {
                });

        assertFalse(specializations.isEmpty());
    }
}
