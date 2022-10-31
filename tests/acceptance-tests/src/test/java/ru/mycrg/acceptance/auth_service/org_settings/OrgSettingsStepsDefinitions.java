package ru.mycrg.acceptance.auth_service.org_settings;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.auth_service.AuthorizationBase;
import ru.mycrg.auth_service_contract.dto.OrgSettingsRequestDto;
import ru.mycrg.auth_service_contract.dto.OrgSettingsResponseDto;

import java.util.*;

import static java.lang.Thread.sleep;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static ru.mycrg.acceptance.auth_service.OrganizationStepsDefinitions.orgId;

public class OrgSettingsStepsDefinitions extends BaseStepsDefinitions {

    private final AuthorizationBase authorizationBase = new AuthorizationBase();

    @Given("Заданы глобальные настройки разрешающие всё")
    public void setGlobalSettingsForOrgAsEnabled(Integer orgId) throws InterruptedException {
        Map<String, Object> settings = new HashMap<>();
        settings.put("downloadXml", true);
        settings.put("createProject", true);
        settings.put("downloadFiles", true);
        settings.put("dataManagement", true);
        settings.put("editProjectLayer", true);
        settings.put("createLibraryItem", true);

        updateOrgSetting(gson.toJson(new OrgSettingsRequestDto(Long.valueOf(orgId), settings)));

        sleep(1000);
    }

    @When("Пользователь отправляет GET запрос на эндпоинт {string}")
    public void getByUrlStep(String url) {
        getByUrl(url);
    }

    @When("Администратор системы устанавливает свойство {string} в значение {string}")
    public void updateSpecificOrgSettingAsRoot(String key, String value) {
        authorizationBase.loginAsRoot();

        Map<String, Object> settings = new HashMap<>();
        settings.put(key, value);

        updateOrgSetting(gson.toJson(new OrgSettingsRequestDto(Long.valueOf(orgId), settings)));
    }

    @When("Владелец организации устанавливает свойство {string} в значение {string}")
    public void updateSpecificOrgSettingAsOwner(String key, String value) {
        authorizationBase.loginAsOwner();

        Map<String, Object> settings = new HashMap<>();
        settings.put(key, value);

        updateOrgSetting(gson.toJson(new OrgSettingsRequestDto(Long.valueOf(orgId), settings)));
    }

    @And("Возвращает существующие настройки и их описание")
    public void checkKnownSettings() {
        Map<String, Object> knownSettings = response.jsonPath().getMap("");

        assertFalse(knownSettings.isEmpty());
    }

    @And("Возвращает существующие настройки организации")
    public void checkSettings() {
        OrgSettingsResponseDto orgSettings = response.jsonPath().getObject("", OrgSettingsResponseDto.class);

        assertFalse(orgSettings.getOrganization().isEmpty());
    }

    @And("Возвращает существующие настройки организаций")
    public void checkOrganizationSettings() {
        List<OrgSettingsResponseDto> orgSettings = response.jsonPath().getList("", OrgSettingsResponseDto.class);

        assertFalse(orgSettings.isEmpty());
    }

    @And("Возвращает существующие глобальные настройки")
    public void checkGlobalSettings() {
        Map<String, Object> settings = response.jsonPath().getMap("settings");

        assertFalse(settings.isEmpty());
    }

    @And("Для организации заданы настройки")
    public void setAllOrganizationSettingAsEnabled() {
        authorizationBase.loginAsOwner();

        Map<String, Object> settings = new HashMap<>();
        settings.put("downloadXml", true);
        settings.put("createProject", true);
        settings.put("downloadFiles", true);
        settings.put("dataManagement", true);
        settings.put("editProjectLayer", true);
        settings.put("createLibraryItem", true);

        updateOrgSetting(gson.toJson(new OrgSettingsRequestDto(Long.valueOf(orgId), settings)));
    }

    @Then("Параметр {string} для организации имеет значение {string}")
    public void checkSpecificSetting(String key, String value) {
        getByUrl("/organizations/settings");

        OrgSettingsResponseDto orgSettings = response.jsonPath().getObject("", OrgSettingsResponseDto.class);

        boolean expectedValue = Boolean.parseBoolean(value);
        boolean resultValue = Boolean.parseBoolean(orgSettings.getOrganization().get(key).toString());

        assertEquals(expectedValue, resultValue);
    }

    @Then("Параметр {string} в глобальных настройках имеет значение {string}")
    public void checkSpecificSettings(String key, String value) {
        getByUrl("/organizations/settings");

        List<OrgSettingsResponseDto> orgSettings = response.jsonPath().getList("", OrgSettingsResponseDto.class);
        Optional<OrgSettingsResponseDto> oOrg = orgSettings.stream()
                                                          .filter(settings -> settings.getId() == Long.valueOf(orgId))
                                                          .findFirst();

        boolean resultValue = false;
        if (oOrg.isPresent()) {
            OrgSettingsResponseDto organizationSettings = oOrg.get();
            resultValue = Boolean.parseBoolean(organizationSettings.getSystem().get(key).toString());
        }

        boolean expectedValue = Boolean.parseBoolean(value);

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
}
