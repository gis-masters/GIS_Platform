package ru.mycrg.acceptance.data_service;

import io.cucumber.java.en.When;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;

public class DatasetsStepsDefinitions extends BaseStepsDefinitions {

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie()
                    .basePath("/api/data/datasets");
    }

    @When("Владелец организации делает запрос на выборку всех наборов данных")
    public void getAllDatasets() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get();
    }
}
