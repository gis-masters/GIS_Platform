package ru.mycrg.acceptance.report_service;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.path.json.config.JsonParserType;
import io.restassured.path.json.config.JsonPathConfig;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.common_contracts.generated.report_service.TemplateCreateDto;
import ru.mycrg.common_contracts.generated.report_service.TemplateFullInfo;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.List;

import static org.apache.http.HttpStatus.SC_NO_CONTENT;
import static org.junit.Assert.*;
import static ru.mycrg.acceptance.JsonMapper.asJsonNode;
import static ru.mycrg.acceptance.data_service.TestFilesManager.getFile;

public class TemplatesStepsDefinitions extends BaseStepsDefinitions {

    @Override
    public RequestSpecification getBaseRequest() {
        return super.getBaseRequest().basePath("/templates");
    }

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie().basePath("/templates");
    }

    @When("я удаляю шаблон печати по имени {string}")
    public void deleteSystemTemplate(String templateName) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        basePath("/templates/" + templateName)
                .when().
                        log().ifValidationFails().
                        delete();
    }

    @When("я запрашиваю список всех шаблонов печати")
    public void getAllTemplates() {
        response = getBaseRequestWithCurrentCookie().get();
    }

    @When("я запрашиваю шаблон печати по имени {string}")
    public void getDefaultTemplate(String templateName) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                         basePath("/templates/" + templateName)
                .when().
                         log().ifValidationFails().
                         get();
    }

    @When("я скачиваю файл шаблона печати по имени {string}")
    public void downloadDefaultTemplate(String templateName) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                         basePath("/templates/" + templateName + "/download")
                .when().
                         log().ifValidationFails().
                         get();
    }

    @Then("ответ соответствует шаблону печати по имени {string}")
    public void checkAnswerOnDefaultTemplate(String expectedName) {
        assertEquals(expectedName, response.jsonPath().get("name"));
        assertEquals("Выписка об объекте", response.jsonPath().get("title"));
        assertEquals("SYSTEM", response.jsonPath().get("createdBy"));
        assertTrue(response.jsonPath().getBoolean("system"));
    }

    @Given("существует пользовательский шаблон печати с именем {string}")
    public void createNewTemplate(String templateName) throws IOException {
        File json = getFile(templateName + ".json");

        String jsonBody = Files.readString(json.toPath(), StandardCharsets.UTF_8);
        TemplateCreateDto additionalData = new TemplateCreateDto(templateName, templateName, asJsonNode(jsonBody));

        File file = getFile(templateName + ".docx");

        response = getBaseRequestWithCurrentCookie()
                .given().
                        multiPart("dto", additionalData, "application/json").
                        multiPart("file", file,
                                  "application/octet-stream")
                .when().
                        log().ifValidationFails().
                        post();
    }

    @Given("я удалил шаблон с именем {string}")
    public void deleteTemplate(String templateName) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        basePath("/templates/" + templateName)
                .when().
                        log().ifValidationFails().
                        delete();

        assertEquals(SC_NO_CONTENT, response.statusCode());
    }

    @And("среди шаблонов печати есть шаблон с именем {string}")
    public void templateResponseContainsArg(String arg) {
        List<TemplateFullInfo> answer = response
                .jsonPath(new JsonPathConfig().defaultParserType(JsonParserType.JACKSON_3))
                .getList("", TemplateFullInfo.class);

        assertTrue(answer.stream().anyMatch(t -> t.getTitle().equals(arg)));
    }

    @And("среди шаблонов печати нет шаблона с именем {string}")
    public void templateResponseNotContainsArg(String arg) {
        List<TemplateFullInfo> answer = response
                .jsonPath(new JsonPathConfig().defaultParserType(JsonParserType.JACKSON_3))
                .getList("", TemplateFullInfo.class);

        assertFalse(answer.stream().anyMatch(t -> t.getTitle().equals(arg)));
    }
}
