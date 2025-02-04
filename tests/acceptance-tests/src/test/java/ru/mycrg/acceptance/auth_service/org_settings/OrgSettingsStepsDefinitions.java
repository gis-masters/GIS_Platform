package ru.mycrg.acceptance.auth_service.org_settings;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.path.json.JsonPath;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.auth_service.AuthorizationBase;
import ru.mycrg.auth_service_contract.dto.OrgSettingsRequestDto;
import ru.mycrg.auth_service_contract.dto.OrgSettingsResponseDto;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.junit.Assert.*;
import static ru.mycrg.acceptance.auth_service.OrganizationStepsDefinitions.orgId;

public class OrgSettingsStepsDefinitions extends BaseStepsDefinitions {

    private final AuthorizationBase authorizationBase = new AuthorizationBase();

    @When("Пользователь отправляет GET запрос на эндпоинт {string}")
    public void getByUrlStep(String url) {
        getByUrl(url);
    }

    @When("Администратор системы устанавливает свойство {string} в значение {string}")
    public void updateSpecificOrgSettingAsRoot(String key, String value) {
        authorizationBase.loginAsSystemAdmin();

        Map<String, Object> settings = new HashMap<>();
        settings.put(key, value);

        updateOrgSetting(gson.toJson(new OrgSettingsRequestDto(Long.valueOf(orgId), settings)));
    }

    @When("Владелец организации устанавливает настройки организации {string}")
    public void updateSettings(String param) {
        authorizationBase.loginAsOwner();

        String[] split = param.split(":");
        Map<String, Object> settings = new HashMap<>();
        settings.put(split[0], split[1]);

        updateOrgSetting(gson.toJson(new OrgSettingsRequestDto(Long.valueOf(orgId), settings)));
    }

    @When("Администратор системы разрешает пользоваться схемами с тегами: {string}")
    public void updateAllowedTagsAsRoot(String tagsAsString) {
        authorizationBase.loginAsSystemAdmin();

        Map<String, Object> settings = new HashMap<>();
        Set<String> tags = Stream.of(tagsAsString.split(","))
                                 .map(String::trim)
                                 .collect(Collectors.toSet());

        settings.put("tags", tags);

        updateOrgSetting(gson.toJson(new OrgSettingsRequestDto(Long.valueOf(orgId), settings)));
    }

    @When("Владелец организации разрешает пользоваться схемами с тегами: {string}")
    public void updateAllowedTagsAsOwner(String tagsAsString) {
        authorizationBase.loginAsOwner();

        Map<String, Object> settings = new HashMap<>();
        Set<String> tags = Stream.of(tagsAsString.split(","))
                                 .map(String::trim)
                                 .collect(Collectors.toSet());

        settings.put("tags", tags);

        updateOrgSetting(gson.toJson(new OrgSettingsRequestDto(Long.valueOf(orgId), settings)));
    }

    @When("Владелец организации запрещает все схемы")
    public void denyAllTags() {
        authorizationBase.loginAsOwner();

        Map<String, Object> settings = new HashMap<>();
        settings.put("tags", new ArrayList<>());

        updateOrgSetting(gson.toJson(new OrgSettingsRequestDto(Long.valueOf(orgId), settings)));
    }

    @And("Схема настроек организации соответствует ожидаемому")
    public void checkSettingsSchema() {
        JsonPath path = response.jsonPath();

        Map<String, Object> knownSettings = path.getMap("");
        assertFalse(knownSettings.isEmpty());
        assertTrue(knownSettings.containsKey("name") && knownSettings.get("name").equals("org_settings"));
        assertTrue(path.getList("properties").size() > 11);
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

    @And("Для организации заданы настройки")
    public void setAllOrganizationSettingAsEnabled() {
        authorizationBase.loginAsOwner();

        Map<String, Object> settings = new HashMap<>();
        settings.put("downloadXml", true);
        settings.put("createProject", true);
        settings.put("downloadFiles", true);
        settings.put("editProjectLayer", true);
        settings.put("createLibraryItem", true);
        settings.put("viewDocumentLibrary", true);
        settings.put("viewBugReport", true);
        settings.put("downloadGml", true);
        settings.put("importShp", true);
        settings.put("viewServicesCalculator", true);

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
