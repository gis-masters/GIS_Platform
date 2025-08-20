package ru.mycrg.acceptance.data_service;

import io.cucumber.java.en.When;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;

public class OccupiedSpaceCacheStepsDefinitions extends BaseStepsDefinitions {

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie()
                    .basePath("/api/data/storage/occupied");
    }

    @When("я запрашиваю информацию о свободном месте")
    public void getStorageOccupiedSpace() {
        fetchStorageOccupiedSpace();
        fetchStorageOccupiedSpace();
    }

    public void fetchStorageOccupiedSpace() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get();
    }
}
