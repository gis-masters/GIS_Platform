package ru.mycrg.acceptance.data_service;

import io.cucumber.java.en.When;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.auth_service.AuthorizationBase;

import static org.junit.Assert.assertTrue;

public class CacheInfoStepsDefinitions extends BaseStepsDefinitions {

    private long currentHitCount;

    private final AuthorizationBase authorizationBase = new AuthorizationBase();

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie()
                    .basePath("/api/data/cacheInfo");
    }

    @When("Администратор системы фиксирует текущие данные о использовании кеша")
    public void writeHitCount() {
        authorizationBase.loginAsSystemAdmin();

        getCacheInfo();

        this.currentHitCount = response.jsonPath().getLong("storageOccupiedSpace.hitCount");
    }

    @When("Администратор системы видит измененные данные о использовании кеша")
    public void checkCacheInfoChanged() {
        authorizationBase.loginAsSystemAdmin();

        getCacheInfo();
        long actualHitCount = response.jsonPath().getLong("storageOccupiedSpace.hitCount");

        System.out.printf("actualHitCount: '%d' this.currentHitCount: '%d'", actualHitCount, currentHitCount);

        assertTrue(actualHitCount > currentHitCount);
    }

    private void getCacheInfo() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get();
    }
}
