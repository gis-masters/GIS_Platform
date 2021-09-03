package ru.mycrg.acceptance.data_service;

import io.cucumber.java.en.When;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;

import java.io.File;

public class GmlParsingStepDefinitions extends BaseStepsDefinitions {

    @Override
    public RequestSpecification getBaseRequest() {
        return super.getBaseRequest().basePath("/api/data");
    }

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie().basePath("/api/data");
    }

    @When("Пользователь делает запрос на импорт gml файла {string} {string} {string} {string} {string} {string} " +
            "{string} {string}")
    public void importGml(String fileName, String oktmo, String documentType, String details, String docDateApprove,
                          String scale, String title, String invertCoordinates) {
        Object gmlFile;
        if (!generateString(fileName).isEmpty()) {
            gmlFile = new File(String.format("src/test/resources/ru/mycrg/acceptance/data_service/files/%s", fileName));
        } else {
            gmlFile = "";
        }

        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType("multipart/form-data").
                        multiPart("gmlFile", gmlFile).
                        multiPart("oktmo", generateString(oktmo)).
                        multiPart("documentType", generateString(documentType)).
                        multiPart("details", generateString(details)).
                        multiPart("docDateApprove", generateString(docDateApprove)).
                        multiPart("scale", generateString(scale)).
                        multiPart("title", generateString(title)).
                        multiPart("invertCoordinates", invertCoordinates)
                .when().
                        log().ifValidationFails().
                        post("/import/file/gml");
    }
}
