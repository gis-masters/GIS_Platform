package ru.mycrg.acceptance.data_service;

import io.cucumber.java.en.And;
import io.cucumber.java.en.When;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.data_service.dto.TableCreateDto;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static ru.mycrg.acceptance.data_service.DatasetsStepsDefinitions.currentDatasetName;

public class TablesStepsDefinitions extends BaseStepsDefinitions {

    public static String currentTableName;
    public static TableCreateDto currentTableDto;

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie()
                    .basePath("/api/data/datasets/" + currentDatasetName + "/tables");
    }

    @When("Отправляется запрос на создание таблицы {string} {string} {string} {string} {string}")
    public void createTablesRequest(String nameKey, String titleKey, String descriptionKey, String crsKey,
                                    String schemaId) {
        currentTableName = generateString(nameKey);
        currentTableDto = new TableCreateDto(currentTableName,
                                             generateString(titleKey),
                                             generateString(descriptionKey),
                                             generateString(crsKey),
                                             generateString(schemaId));

        super.createEntity(currentTableDto);
    }

    @When("Пользователь делает запрос на текущую таблицу")
    public void getCurrentTable() {
        super.getCurrentEntityInfoById(currentTableName);
    }

    @And("Поля таблицы совпадают с переданными")
    public void checkCurrentTableFields() {
        jsonPath = response.jsonPath();

        assertThat(jsonPath.get("name"), equalTo(currentTableDto.getName()));
        assertThat(jsonPath.get("title"), equalTo(currentTableDto.getTitle()));
        assertThat(jsonPath.get("details"), equalTo(currentTableDto.getDetails()));
        assertThat(jsonPath.get("crs"), equalTo(currentTableDto.getCrs()));
        assertThat(jsonPath.get("schemaId"), equalTo(currentTableDto.getSchemaId()));
    }
}
