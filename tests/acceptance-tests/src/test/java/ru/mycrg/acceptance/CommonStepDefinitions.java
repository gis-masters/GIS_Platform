package ru.mycrg.acceptance;

import io.cucumber.java.Before;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;

import java.util.List;
import java.util.Map;

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

    @And("Данные отсортированы по {string} и {string} в {string}")
    public void isDataSorted(String sortingType, String sortingDirection, String entity) {
        List<Object> sorted = jsonPath.getList(String.format("_embedded.%s.%s", entity, sortingType));
        for (int i = 1; i < sorted.size(); i++) {
            String next = String.valueOf(sorted.get(i));
            String prev = String.valueOf(sorted.get(i - 1));

            if (next.equals("null") || prev.equals("null")) {
                continue;
            }

            if (sortingDirection.equals("asc")) {
                assertTrue(prev.compareTo(next) < 1);
            } else if (sortingDirection.equals("desc")) {
                assertTrue(prev.compareTo(next) > -1);
            }
        }
    }
}
