package ru.mycrg.acceptance.data_service;

import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.data_service.processes.ProcessesStepDefinitions;
import ru.mycrg.common_contracts.generated.fts.FtsRequestDto;
import ru.mycrg.common_contracts.generated.fts.FtsType;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;

public class FtsStepsDefinitions extends BaseStepsDefinitions {

    private final ProcessesStepDefinitions processesStepDefinitions = new ProcessesStepDefinitions();

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie().basePath("/api/data/fts");
    }

    @When("Пользователь полнотекстовым поиском по {word} ищет {string}")
    public void runAsyncFtsSearch(String type, String text) {
        FtsRequestDto ftsDto = new FtsRequestDto();
        ftsDto.setText(text);
        if ("документам".equals(type)) {
            ftsDto.setType(FtsType.DOCUMENT);
        } else if ("таблице".equals(type)) {
            ftsDto.setType(FtsType.FEATURE);
        } else {
            throw new RuntimeException("Укажите по чему вести поиск: документам или слоям.");
        }
        ftsDto.setSources(null);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(ftsDto).
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        post();
    }

    @Then("Пользователь ожидает завершения работы поиска")
    public void waitFtsProcessToComplete() {
        Integer currentProcessId = extractId((String) response.jsonPath().get("_links.self.href"));

        processesStepDefinitions.waitUntilProcessCompleteWithStatus(currentProcessId, "DONE");
    }

    @Then("Полнотекстовый поиск не нашел ничего")
    public void shouldNotFoundAnything() {
        int total = response.jsonPath().getInt("details.page.totalElements");
        assertEquals("Количество записей в ответе должно быть равно 0", 0, total);
    }

    @Then("Полнотекстовый поиск нашёл документы")
    public void shouldFoundAnything() {
        int total = response.jsonPath().getInt("details.page.totalElements");
        assertNotEquals("Количество записей в ответе должно быть больше 0", 0, total);
    }

    @Then("В результате поиска найдена строка {string}")
    public void shouldFoundString(String str) {
        String respStr = response.jsonPath().getString("details.content[0].payload.properties.field_1");
        assertEquals("Должна быть найдена строка" + str, str, respStr);
    }
}
