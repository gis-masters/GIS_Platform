package ru.mycrg.acceptance.data_service.libraries;

import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.data_service.dto.RecordDto;

import static org.apache.http.HttpStatus.SC_CREATED;

public class LibraryBaseRecords extends BaseStepsDefinitions {

    @Override
    public RequestSpecification getBaseRequest() {
        return super.getBaseRequest().basePath("/api/data/document-libraries");
    }

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie().basePath("/api/data/document-libraries");
    }

    public Integer createRecord(String library, RecordDto record) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType("multipart/form-data").
                        multiPart("body", gson.toJson(record))
                .when().
                        post("/" + library + "/records");

        return response.then()
                       .log().ifValidationFails()
                       .statusCode(SC_CREATED)
                       .extract().jsonPath().get("id");
    }
}
