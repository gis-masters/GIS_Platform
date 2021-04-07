package ru.mycrg.acceptance;

import io.cucumber.java.Before;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;

import java.util.List;
import java.util.Map;
import java.util.Objects;

import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.CoreMatchers.hasItems;
import static org.hamcrest.CoreMatchers.not;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.lessThanOrEqualTo;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class CommonStepDefinitions extends BaseStepsDefinitions {

    @Before
    public void setup() {
        super.setup();
    }

    @Then("Сервер отвечает со статус-кодом {int}")
    public void assertResponseCode(int status) {
        assertEquals(status, response.getStatusCode());
    }

    @And("В ответе есть пункт {string}")
    public void isThereField(String checkField) {
        jsonPath = response.jsonPath();
        List<String> entities = jsonPath.get(String.format("_embedded.%s.id", checkField));

        assertTrue(entities.size() >= 2);
    }

    @Then("Ответ имеет стандартное тело с паджинацией")
    public void isPagingStructureCorrect() {
        jsonPath = response.jsonPath();

        Map<String, String> presentedData = jsonPath.getMap("");
        Map<String, String> links = jsonPath.getMap("_links");
        Map<String, String> page = jsonPath.getMap("page");

        assertTrue(presentedData.containsKey("_links"));
        assertTrue(presentedData.containsKey("page"));

        assertTrue(links.containsKey("self"));

        assertTrue(page.containsKey("size"));
        assertTrue(page.containsKey("totalElements"));
        assertTrue(page.containsKey("totalPages"));
        assertTrue(page.containsKey("number"));
    }

    @Then("В выборке присутствуют определённое кол-во элементов: {string}")
    public void checkTotalElements(String count) {
        assertEquals(Integer.valueOf(count), response.jsonPath().get("page.totalElements"));
    }

    @And("Данные отсортированы по {string} и {string} в {string}")
    public void isDataSorted(String sortingType, String sortingDirection, String entity) {
        jsonPath = response.jsonPath();
        List<Object> sorted;
        try {
            sorted = jsonPath.getList(String.format("_embedded.%s.%s", entity, sortingType));
            if (sorted.isEmpty()) {
                sorted = jsonPath.get(sortingType);
            }
        } catch (NullPointerException e) {
            sorted = jsonPath.get(sortingType);
        }

        sorted.removeIf(Objects::isNull);

        assertThat(sorted, not(sorted.isEmpty()));

        for (int i = 1; i < sorted.size(); i++) {
            if (sorted.get(i) instanceof String) {
                String next = String.valueOf(sorted.get(i));
                String prev = String.valueOf(sorted.get(i - 1));

                if (sortingDirection.equals("asc")) {
                    assertThat(prev, lessThanOrEqualTo(next));
                } else if (sortingDirection.equals("desc")) {
                    assertThat(prev, greaterThanOrEqualTo(next));
                }
            } else if (sorted.get(i) instanceof Integer) {
                Integer next = (Integer) sorted.get(i);
                Integer prev = (Integer) sorted.get(i - 1);

                if (sortingDirection.equals("asc")) {
                    assertThat(prev, lessThanOrEqualTo(next));
                } else if (sortingDirection.equals("desc")) {
                    assertThat(prev, greaterThanOrEqualTo(next));
                }
            }
        }
    }

    @And("В ответе сервера для сущности {string} отсутствует пункт {string}")
    public void checkNonExistentField(String entity, String field) {
        getBaseRequestWithCurrentCookie()
                .when().
                get(String.format("%s/", entity))
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        body("", not(hasItems(field)));
    }

    @Then("В ответе пункт {string} имеет значение {string}")
    public void checkValueInTheField(String field, String value) {
        assertEquals(value, response.jsonPath().get(field));
    }
}
