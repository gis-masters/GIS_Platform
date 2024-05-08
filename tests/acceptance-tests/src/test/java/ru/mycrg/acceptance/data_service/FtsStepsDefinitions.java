package ru.mycrg.acceptance.data_service;

import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.common_contracts.generated.fts.FtsRequestDto;
import ru.mycrg.common_contracts.generated.fts.FtsType;

import java.util.List;

import static org.junit.Assert.assertEquals;

public class FtsStepsDefinitions extends BaseStepsDefinitions {

    public static final int RETRY_COUNT = 3;
    public static final int RETRY_DELAY = 1000;

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie().basePath("/api/data/processes");
    }

    @Then("Найдена только одна запись с идентификатором: {int}")
    public void foundOnlyOneRecord(int expectedId) {
        List<Object> respList = response.jsonPath().getList("content");
        assertEquals("Должна быть найдена одна запись", respList.size(), 1);
        int id = response.jsonPath().getInt("content[0].payload.id");
        assertEquals("Идентификатор должен быть равен " + expectedId, expectedId, id);
    }

    @Then("Не найдены результаты fts поиска")
    public void shouldNotFoundAnything() {
        List<Object> respList = response.jsonPath().getList("content");
        assertEquals("Данные не должны быть найдены", respList.size(), 0);
    }

    @When("Пользователь запускает асинхронный полнотекстовый поиск: {string}")
    public void runAsyncFtsSearch(String text) {
        FtsRequestDto ftsDto = new FtsRequestDto();
        ftsDto.setText(text);
        ftsDto.setType(FtsType.FEATURE);
        ftsDto.setSources(null);

        ProcessDto processDto = new ProcessDto();
        processDto.setType("FULL_TEXT_SEARCH");
        processDto.setPayload(ftsDto);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(processDto).
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        post();
    }

    @Then("Пользователь ожидает завершение работы асинхронного запроса")
    public void waitFtsProcessToComplete() throws InterruptedException {
        String processUrl = response.jsonPath().getString("_links.process.href");

        int count = RETRY_COUNT;
        while (count > 0) {
            response = getBaseRequestWithCurrentCookie()
                    .when().
                            log().ifValidationFails().
                            get(processUrl);

            if ("DONE".equals(response.jsonPath().getString("status"))) {
                break;
            }

            count--;
            Thread.sleep(RETRY_DELAY);
        }
    }

    @Then("Не найдены результаты асинхронного полнотекстового поиска")
    public void shouldNotFoundAnythingAsync() {
        int total = response.jsonPath().getInt("details.totalElements");
        assertEquals("Данные не должны быть найдены", total, 0);
    }

    class ProcessDto {

        Object payload;

        String type;

        public ProcessDto() {
        }

        public Object getPayload() {
            return payload;
        }

        public void setPayload(Object payload) {
            this.payload = payload;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }
    }
}
