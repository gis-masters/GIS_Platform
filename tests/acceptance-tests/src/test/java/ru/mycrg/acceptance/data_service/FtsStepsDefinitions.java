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

public class FtsStepsDefinitions extends BaseStepsDefinitions {

    private final ProcessesStepDefinitions processesStepDefinitions = new ProcessesStepDefinitions();

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie().basePath("/api/data/fts");
    }

    @When("Пользователь запускает асинхронный полнотекстовый поиск: {string}")
    public void runAsyncFtsSearch(String text) {
        FtsRequestDto ftsDto = new FtsRequestDto();
        ftsDto.setText(text);
        ftsDto.setType(FtsType.FEATURE);
        ftsDto.setSources(null);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(ftsDto).
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        post();
    }

    @Then("Пользователь ожидает завершение работы асинхронного запроса")
    public void waitFtsProcessToComplete() {
        Integer currentProcessId = extractId((String) response.jsonPath().get("_links.self.href"));

        processesStepDefinitions.waitUntilProcessCompleteWithStatus(currentProcessId, "DONE");
    }

    @Then("Не найдены результаты асинхронного полнотекстового поиска")
    public void shouldNotFoundAnythingAsync() {
        int total = response.jsonPath().getInt("details.page.totalElements");
        assertEquals("Данные не должны быть найдены", total, 0);
    }
}
