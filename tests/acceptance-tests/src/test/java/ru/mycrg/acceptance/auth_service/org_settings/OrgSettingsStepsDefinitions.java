package ru.mycrg.acceptance.auth_service.org_settings;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.auth_service.AuthorizationBase;

import java.util.Map;

import static java.lang.Thread.sleep;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;

public class OrgSettingsStepsDefinitions extends BaseStepsDefinitions {

    private final AuthorizationBase authorizationBase = new AuthorizationBase();

    @Given("Заданы глобальные настройки разрешающие всё")
    public void setGlobalSettings() throws InterruptedException {
        updateOrgSetting("{" +
                                 "    \"downloadXml\": true," +
                                 "    \"createLibraryItem\": true," +
                                 "    \"editProjectLayer\": true," +
                                 "    \"dataManagement\": true," +
                                 "    \"createProject\": true," +
                                 "    \"downloadFiles\": true" +
                                 "}");

        sleep(1000);
    }

    @When("Пользователь отправляет GET запрос на эндпоинт {string}")
    public void getByUrlStep(String url) {
        getByUrl(url);
    }

    @When("Владелец организации устанавливает свойство {string} в значение {string}")
    public void updateSpecificOrgSettingAsOwner(String key, String value) {
        authorizationBase.loginAsOwner();

        updateOrgSetting("{\"" + key + "\": " + value + "}");
    }

    @When("Администратор системы устанавливает свойство {string} в значение {string}")
    public void updateSpecificOrgSettingAsRoot(String key, String value) {
        authorizationBase.loginAsRoot();

        updateOrgSetting("{\"" + key + "\": " + value + "}");
    }

    @When("Администратор системы для организации с id: {string} устанавливает свойство {string} в значение {string}")
    public void updateSpecificOrgSettingAsRoot(String orgId, String key, String value) {
        authorizationBase.loginAsRoot();

        updateOrgSetting(orgId, "{\"" + key + "\": " + value + "}");
    }

    @And("Возвращает существующие настройки и их описание")
    public void checkKnownSettings() {
        Map<String, Object> knownSettings = response.jsonPath().getMap("");

        assertFalse(knownSettings.isEmpty());
    }

    @And("Возвращает существующие настройки организации")
    public void checkSettings() {
        Map<String, Object> settings = response.jsonPath().getMap("");

        assertFalse(settings.isEmpty());
    }

    @And("Возвращает существующие глобальные настройки")
    public void checkGlobalSettings() {
        Map<String, Object> settings = response.jsonPath().getMap("");

        assertFalse(settings.isEmpty());
    }

    @And("Для организации заданы настройки")
    public void setSomeOrganizationSetting() {
        authorizationBase.loginAsOwner();

        updateOrgSetting("{\"createProject\": true}");
    }

    @Then("Параметр {string} имеет значение {string}")
    public void checkSpecificSetting(String key, String value) {
        checkSpecificSetting("/organizations/settings", key, value);
    }

    @Then("Для организации с id: {string} {string} имеет значение {string}")
    public void checkSpecificSettingForOrganization(String orgId, String key, String value) {
        checkSpecificSetting("/organizations/" + orgId + "/settings", key, value);
    }

    @Given("Для организации с id: {string} свойство {string} установлено в значение {string}")
    public void setSpecificSettingForOrganization(String orgId, String key, String value) {
        updateOrgSetting(orgId, "{\"" + key + "\": " + value + "}");
    }

    private void checkSpecificSetting(String url, String key, String value) {
        getByUrl(url);

        Map<String, Object> settings = response.jsonPath().getMap("");

        boolean expectedValue = Boolean.parseBoolean(value);
        boolean resultValue = (boolean) settings.get(key);

        assertEquals(expectedValue, resultValue);
    }

    private void getByUrl(String url) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(url);
    }

    private void updateOrgSetting(String settingsAsJson) {
        response = getBaseRequestWithCurrentCookie().
                        body(settingsAsJson).
                        contentType(ContentType.JSON)
                .when().
                        patch("/organizations/settings");

        response.then()
                .statusCode(204);
    }

    private void updateOrgSetting(String orgId, String settingsAsJson) {
        response = getBaseRequestWithCurrentCookie().
                        body(settingsAsJson).
                        contentType(ContentType.JSON)
                .when().
                        patch("/organizations/" + orgId + "/settings");

        response.then()
                .statusCode(204);
    }
}
