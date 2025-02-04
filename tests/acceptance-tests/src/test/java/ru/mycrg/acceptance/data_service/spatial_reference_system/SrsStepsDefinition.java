package ru.mycrg.acceptance.data_service.spatial_reference_system;

import io.cucumber.java.en.And;
import io.cucumber.java.en.When;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.common_contracts.generated.SpatialReferenceSystem;

import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.hamcrest.core.IsNull.notNullValue;

public class SrsStepsDefinition extends BaseStepsDefinitions {

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie()
                    .basePath("/api/data/srs");
    }

    @When("Пользователь создаёт систему координат: {string}")
    public void createSrsFromWkt(String wktKey) {
        SpatialReferenceSystem srs = new SpatialReferenceSystem();
        srs.setSrtext(WktPool.getWkt(wktKey));

        super.createEntity(srs);
    }

    @And("Система координат создана и имеет ожидаемые параметры: {string}")
    public void checkSrs(String wktKey) {
        response.then()
                .statusCode(SC_OK)
                .body("authSrid", notNullValue())
                .body("srtext", notNullValue())
                .body("proj4Text", equalTo(WktPool.getSrs(wktKey).getProj4Text()));
    }
}
