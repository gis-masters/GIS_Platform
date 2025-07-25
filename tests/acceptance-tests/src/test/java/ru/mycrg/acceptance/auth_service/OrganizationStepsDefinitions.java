package ru.mycrg.acceptance.auth_service;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.GeoserverStepDefinitions;
import ru.mycrg.acceptance.auth_service.dto.OrganizationBase;
import ru.mycrg.acceptance.auth_service.dto.UserDto;
import ru.mycrg.acceptance.auth_service.dto.UserGroupDto;
import ru.mycrg.acceptance.data_service.datasets.DatasetsStepsDefinitions;
import ru.mycrg.acceptance.data_service.features.FeaturesStepsDefinitions;
import ru.mycrg.acceptance.data_service.libraries.LibraryBaseRecords;
import ru.mycrg.acceptance.data_service.tables.TablesStepsDefinitions;
import ru.mycrg.acceptance.gis_service.LayerStepDefinitions;
import ru.mycrg.acceptance.gis_service.ProjectStepsDefinitions;
import ru.mycrg.auth_service_contract.dto.AuthorityCommonDto;
import ru.mycrg.auth_service_contract.dto.GroupCreateDto;
import ru.mycrg.auth_service_contract.dto.OrganizationCreateDto;
import ru.mycrg.auth_service_contract.dto.UserCreateDto;
import ru.mycrg.common_contracts.generated.gis_service.project.ProjectDto;

import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;

import static java.lang.Thread.sleep;
import static org.apache.http.HttpStatus.*;
import static org.junit.Assert.*;
import static ru.mycrg.acceptance.auth_service.AuthorizationBase.DEFAULT_TEST_PASSWORD;
import static ru.mycrg.acceptance.data_service.datasets.DatasetsStepsDefinitions.currentDatasetIdentifier;
import static ru.mycrg.acceptance.gis_service.ProjectStepsDefinitions.projectId;

public class OrganizationStepsDefinitions extends BaseStepsDefinitions {

    public static final int MAX_RETRY_ATTEMPT = 100;
    public static final int RETRY_DELAY = 1000;

    public static Integer orgId;
    public static String emailForFeature;
    public static OrganizationCreateDto orgDto;

    private static final Map<String, Boolean> knownOrgTemplates = new HashMap<>();

    private final AuthorizationBase authorizationBase = new AuthorizationBase();
    private final UserStepsDefinitions userStepsDefinitions = new UserStepsDefinitions();
    private final UserGroupStepsDefinitions userGroupStepsDefinitions = new UserGroupStepsDefinitions();
    private final TablesStepsDefinitions tablesStepsDefinitions = new TablesStepsDefinitions();
    private final LibraryBaseRecords libraryBaseRecords = new LibraryBaseRecords();
    private final FeaturesStepsDefinitions featuresStepsDefinitions = new FeaturesStepsDefinitions();
    private final LayerStepDefinitions layerStepDefinitions = new LayerStepDefinitions();
    private final ProjectStepsDefinitions projectStepsDefinitions = new ProjectStepsDefinitions();
    private final DatasetsStepsDefinitions datasetsStepsDefinitions = new DatasetsStepsDefinitions();
    private final GeoserverStepDefinitions geoserverStepDefinitions = new GeoserverStepDefinitions();

    @When("Отправляется запрос на создание организации")
    public void sendCreateOrganizationRequest(DataTable dataTable) {
        List<String> data = dataTable.asList();
        String ownerEmail = generateString(data.get(4));

        String password = DEFAULT_TEST_PASSWORD;
        if (data.size() > 5 && data.get(5) != null) {
            if (!data.get(5).equalsIgnoreCase("DEFAULT_TEST_PASSWORD")) {
                password = generateString(data.get(5));
            }
        }

        UserCreateDto owner = new UserCreateDto(generateString(data.get(2)), generateString(data.get(3)),
                                                ownerEmail, password);

        System.out.println("Organization owner: " + ownerEmail);

        userPool.put(-1, owner);
        orgDto = new OrganizationCreateDto(generateString(data.get(0)), generateString(data.get(1)), owner);

        if (data.size() > 6) {
            orgDto.setSpecializationId(Integer.valueOf(data.get(6)));
        }

        createOrganization(orgDto);
    }

    @When("я отправляю запрос на создание {int} организаций одновременно")
    public void createMultipleOrganizations(int count) {
        for (int i = 1; i <= count; i++) {
            String ownerEmail = String.format("%s@fiz__%d", generateString("STRING_6"), i);
            UserCreateDto owner = new UserCreateDto("ownerName_" + i,
                                                    "ownerSurName_" + i,
                                                    ownerEmail,
                                                    DEFAULT_TEST_PASSWORD);

            System.out.println("Organization owner: " + ownerEmail);

            OrganizationCreateDto org = new OrganizationCreateDto("OOO Fiz_" + i, "1234567890", owner);

            createOrganization(org);

            assertEquals(202, response.getStatusCode());
            Integer orgId = super.extractId(response);

            scenarioOrganizations.put(orgId, org);
        }
    }

    @When("я дождался окончания процесса создания для всех организаций")
    public void waitUntilAllScenarioOrganizationsCreated() throws InterruptedException {
        for (Map.Entry<Integer, OrganizationCreateDto> entry: scenarioOrganizations.entrySet()) {
            waitUntilOrganizationSuccessfullyCreated(entry.getKey());
        }
    }

    @When("все организации созданы корректно и имеют статус {string} [auth-service]")
    public void checkAllScenarioOrganizations_AuthService(String status) {
        for (Map.Entry<Integer, OrganizationCreateDto> entry: scenarioOrganizations.entrySet()) {
            Integer id = entry.getKey();
            OrganizationCreateDto orgDto = entry.getValue();
            UserCreateDto owner = orgDto.getOwner();

            authorizationBase.loginAs(owner.getEmail(), owner.getPassword());

            getOrganization(id);

            // сверяем поля
            JsonPath jsonPath = response.jsonPath();
            assertEquals(jsonPath.get("status"), status);
            assertEquals(jsonPath.get("name"), orgDto.getName());
            assertEquals(jsonPath.get("phone"), orgDto.getPhone());
            assertEquals(jsonPath.getList("users.name").get(0), owner.getName());
            assertEquals(jsonPath.getList("users.surname").get(0), owner.getSurname());
            assertEquals(jsonPath.getList("users.email").get(0), owner.getEmail());
            assertNotNull(jsonPath.get("settings"));
            assertNotNull(jsonPath.get("createdAt"));
        }

        // Наличие настроек организаций у системного администратора
        authorizationBase.loginAsSystemAdmin();
        getSystemSettings();

        List<Integer> orgIds = response.jsonPath().getList("id", Integer.class);
        scenarioOrganizations.forEach((id, org) -> {
            assertTrue(orgIds.contains(id));
        });
    }

    @When("для всех организаций корректно созданы зависимости в данных [data-service]")
    public void checkAllScenarioOrganizations_DataService() {
        for (Map.Entry<Integer, OrganizationCreateDto> entry: scenarioOrganizations.entrySet()) {
            Integer id = entry.getKey();
            OrganizationCreateDto orgDto = entry.getValue();
            UserCreateDto owner = orgDto.getOwner();

            authorizationBase.loginAs(owner.getEmail(), owner.getPassword());

            Response response = getDatabase(id);

            checkStatusCodeIs(response, SC_OK);
        }
    }

    @When("на геосервере создано всё необходимое и даны права [geoserver]")
    public void checkAllScenarioOrganizations_Geoserver() {
        authorizationBase.loginAsSystemAdmin();

        for (Map.Entry<Integer, OrganizationCreateDto> entry: scenarioOrganizations.entrySet()) {
            Integer id = entry.getKey();

            geoserverStepDefinitions.checkUserOnGeoserver();
            geoserverStepDefinitions.checkGeoserverRole(id);
            geoserverStepDefinitions.checkGeoserverWorkspaceAndStorage(id);
            geoserverStepDefinitions.checkGeoserverLayersRules(id);

            geoserverStepDefinitions.checkGeoserverServiceRules(id);
            geoserverStepDefinitions.checkGeoserverRestRules(id);
        }
    }

    @And("В заголовке Location передается ID созданной организации")
    public void checkOrgIdInLocationSetAsCurrentPutInPool() {
        orgId = super.extractId(response);

        orgPool.put(orgId, orgDto);
    }

    @When("Проверяем создана ли организация")
    public void getOrganization() {
        getOrganization(orgId);
    }

    @When("Ждем окончания процесса создания организации")
    public void waitUntilOrganizationSuccessfullyCreated() throws InterruptedException {
        waitUntilOrganizationSuccessfullyCreated(orgId);

        orgPool.put(orgId, orgDto);
    }

    @When("Ждем окончания процесса удаления организации")
    public void waitUntilOrganizationSuccessfullyDeleted() throws InterruptedException {
        waitUntilOrganizationSuccessfullyDeleted(orgId);

        orgPool.remove(orgId);
    }

    @And("Статус организации соответствует {string}")
    public void checkIsOrgProvisioned(String status) {
        JsonPath jsonPath = response.jsonPath();

        assertEquals(jsonPath.get("status"), status);

        if (status.equalsIgnoreCase("DELETING")) {
            userPool.remove(userPool.get(-1));
        } else {
            orgPool.put(orgId, orgDto);
        }
    }

    @And("Поля совпадают с переданными")
    public void checkOrgData() {
        JsonPath jsonPath = response.jsonPath();

        assertEquals(jsonPath.get("name"), orgDto.getName());
        assertEquals(jsonPath.get("phone"), orgDto.getPhone());
        assertEquals(jsonPath.getList("users.name").get(0), orgDto.getOwner().getName());
        assertEquals(jsonPath.getList("users.surname").get(0), orgDto.getOwner().getSurname());
        assertEquals(jsonPath.getList("users.email").get(0), orgDto.getOwner().getEmail());
    }

    @And("Настройки организации включены в зависимости от выбранной специализации {string}")
    public void checkSettingsBySpecialization(String specializationId) {
        JsonPath jsonPath = response.jsonPath();

        List<Map<String, Object>> allSpecializations = getSpecializations();
        Map<String, Object> existSpecialization = allSpecializations
                .stream()
                .filter(specialization -> specializationId.equals(specialization.get("id").toString()))
                .findFirst()
                .get();
        Map<String, Object> specializationSettings = (Map<String, Object>) existSpecialization.get("settings");

        List<String> tags = jsonPath.get("settings.tags");
        List<String> tagsBySpecialization = (List<String>) specializationSettings.get("tags");
        assertTrue(tags.size() == tagsBySpecialization.size()
                           && tags.containsAll(tagsBySpecialization)
                           && tagsBySpecialization.containsAll(tags));

        checkIsTrue(specializationSettings, "reestrs");
        checkIsTrue(specializationSettings, "sedDialog");
        checkIsTrue(specializationSettings, "downloadXml");
        checkIsTrue(specializationSettings, "taskManagement");
        checkIsTrue(specializationSettings, "createProject");
        checkIsTrue(specializationSettings, "downloadFiles");
        checkIsTrue(specializationSettings, "editProjectLayer");
        checkIsTrue(specializationSettings, "createLibraryItem");
        checkIsTrue(specializationSettings, "viewDocumentLibrary");
        checkIsTrue(specializationSettings, "viewBugReport");
        checkIsTrue(specializationSettings, "downloadGml");
        checkIsTrue(specializationSettings, "importShp");
        checkIsTrue(specializationSettings, "viewServicesCalculator");

        Object storageSize = specializationSettings.get("storageSize");
        assertNotNull(storageSize);
        assertEquals(20, storageSize);
    }

    private void checkIsTrue(Map<String, Object> specializationSettings, String key) {
        Object actualValue = specializationSettings.get(key);

        assertNotNull(actualValue);
        assertEquals(Boolean.TRUE, actualValue);
    }

    /**
     * Гарантирует создание огранизации, если таковая не была найдена в пуле. Добавляет созданную орг. в пул и "current"
     * переменные
     *
     * @param dataTable Параметры организации.
     *
     * @throws InterruptedException Возникает если организация не создалась успешно и закончились попытки её проверки.
     */
    @Given("Существует организация")
    public void initOrg(DataTable dataTable) throws InterruptedException {
        boolean isPassedEmailRandom = dataTable.asList().get(4).split("_")[0].equals("EMAIL");
        String eMail = generateString(dataTable.asList().get(4));

        clearAllOrganizationPools();

        if (isOrgExistInPool(eMail)) {
            System.out.println("---OrgExistInPool--- " + eMail);

            makeExactOrgAsCurrent(eMail);
        } else if (!orgPool.isEmpty() && isPassedEmailRandom) {
            System.out.println("---makeFirstAvailableOrgAsCurrent---");

            makeFirstAvailableOrgAsCurrent();
        } else {
            System.out.println("---sendCreateOrganizationRequest---");

            sendCreateOrganizationRequest(dataTable);

            assertEquals(SC_ACCEPTED, response.getStatusCode());

            checkOrgIdInLocationSetAsCurrentPutInPool();

            waitUntilOrganizationSuccessfullyCreated(orgId);
        }
    }

    /**
     * Создавать организацию по шаблону означает создание организации и только того, что непосредственно к ней
     * относится, т.е. - пользователи их иерархии, группы пользователей.
     */
    @Given("Существует организация созданная по шаблону: {string}")
    public void initEnhancedOrganization(String orgTemplate) throws InterruptedException {
        Boolean isOrgCreatedInFeature = knownOrgTemplates.getOrDefault(orgTemplate, false);
        if (isOrgCreatedInFeature) {
            System.out.println("Организация уже создана при выполнении текущего feature: " + orgTemplate);

            return;
        }

        Optional<OrganizationBase> oOrganization = tryFetchOrganizationFromServer(orgTemplate);
        if (oOrganization.isPresent()) {
            System.out.println("Организация уже существует: " + orgTemplate);

            UserCreateDto owner = null;
            OrganizationBase org = oOrganization.get();
            for (UserDto user: org.getUsers()) {
                UserCreateDto dto = new UserCreateDto(user.getName(), user.getSurname(), user.getEmail(),
                                                      DEFAULT_TEST_PASSWORD);
                userPool.put(Math.toIntExact(user.getId()), dto);

                if (hasAdminAuthority(user.getAuthorities())) {
                    owner = dto;
                }
            }

            for (UserGroupDto group: org.getGroups()) {
                GroupCreateDto dto = new GroupCreateDto(group.getName(), group.getDescription());
                usersGroupPool.put(group.getId(), dto);
            }

            orgId = org.getId();
            orgDto = new OrganizationCreateDto(org.getName(), org.getPhone(), owner);
            orgPool.put(orgId, orgDto);
        } else {
            System.out.println("Организация '" + orgTemplate + "' НЕ найдена на сервере. Создаём новую.");

            initNewEnhancedOrganization(orgTemplate);
        }
    }

    @Given("Существует другая организация")
    public void createOrgForFeature(DataTable dataTable) throws InterruptedException {
        List<String> data = dataTable.asList();

        if (emailForFeature == null) {
            emailForFeature = generateString(data.get(4));
        }
        if (isOrgExistInPool(emailForFeature)) {
            makeExactOrgAsCurrent(emailForFeature);
        } else {
            UserCreateDto owner = new UserCreateDto(generateString(data.get(2)), generateString(data.get(3)),
                                                    emailForFeature, DEFAULT_TEST_PASSWORD);

            System.out.println("Org. Owner: " + emailForFeature);

            userPool.put(-1, owner);
            orgDto = new OrganizationCreateDto(generateString(data.get(0)), generateString(data.get(1)), owner);

            createOrganization(orgDto);

            assertEquals(SC_ACCEPTED, response.getStatusCode());

            checkOrgIdInLocationSetAsCurrentPutInPool();

            waitUntilOrganizationSuccessfullyCreated(orgId);
        }
    }

    /**
     * Берем любую существующую организацию из пула. Создаём если пул организаций еще пуст.
     */
    @Given("Существует любая организация")
    public void getExistOrgOrCreate() throws InterruptedException {
        initEnhancedOrganization("");
    }

    @When("Посылается запрос на удаление текущей организации")
    public void deleteCurrentOrganization() {
        assertNotNull(orgId);

        deleteOrganization(orgId);
    }

    @And("Удалена БД организации")
    public void isOrgDbNotExist() throws InterruptedException {
        sleep(2000);

        Response response = getDatabase(orgId);

        checkStatusCodeIs(response, SC_NOT_FOUND);
    }

    @And("Существует база данных")
    public void isOrgDbExist() {
        Response response = getDatabase(orgId);

        checkStatusCodeIs(response, SC_OK);
    }

    @And("В базе аутентификации удалены упоминания о организации")
    public void isOrgExistInSettings() {
        getOrganization(orgId);
        assertEquals(SC_NOT_FOUND, response.getStatusCode());

        getAllOrganizations();
        JsonPath jsonPath = response.jsonPath();

        // Добавляем ID организаций
        List<Integer> orgIds = jsonPath.getList("content.id", Integer.class);
        List<Integer> allIds = new ArrayList<>(orgIds);

        // Добавляем ID настроек
        List<Integer> settingsIds = jsonPath.getList("content.settings.id.flatten()", Integer.class);
        allIds.addAll(settingsIds);

        assertFalse("Организация с ID " + orgId + " все еще существует в списке организаций", allIds.contains(orgId));
    }

    @And("Согласно специализации 1 созданы: набор данных, таблица с данными, библиотека документов, проект и слои")
    public void checkBySpecialization1() {
        JsonPath datasetsJsonPath = datasetsStepsDefinitions.getAllDatasets().jsonPath();
        assertEquals("Набор данных по специализации 1", datasetsJsonPath.get("content.title[0]"));

        currentDatasetIdentifier = datasetsJsonPath.get("content.identifier[0]").toString();

        JsonPath tablesJsonPath = tablesStepsDefinitions.getAllEntities().jsonPath();
        assertEquals("Тестовое название первой таблицы", tablesJsonPath.get("content.title[0]"));
        assertEquals("EPSG:7829", tablesJsonPath.get("content.crs[0]"));
        assertEquals("zu_pro", tablesJsonPath.get("content.schema.name[0]"));

        String tableIdentifier = tablesJsonPath.get("content.identifier[0]").toString();

        Response allFeatures = featuresStepsDefinitions.getAllFeatures(tableIdentifier);
        allFeatures.prettyPrint();

        JsonPath featuresJsonPath = allFeatures.jsonPath();
        assertEquals("3", featuresJsonPath.get("page.totalElements").toString());

        JsonPath docLibrariesJsonPath = libraryBaseRecords.getAllEntities().jsonPath();
        List<String> docLibraries = docLibrariesJsonPath.get("content.schema.name");
        assertTrue(docLibraries.contains("dl_data_kpt"));

        JsonPath projectJsonPath = projectStepsDefinitions.getAllEntities().jsonPath();
        List<ProjectDto> projects = projectJsonPath.getList("content", ProjectDto.class);
        assertEquals(2, projects.size());

        ProjectDto firstProject = projects
                .stream()
                .filter(p -> p.getName().equalsIgnoreCase("Проект 1"))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Не найден проект с именем: 'Проект 1'"));

        assertEquals("Проект 1", firstProject.getName());
        assertEquals("[3733187.3, 5540706.2,  3745910.5, 5550374.5]", firstProject.getBbox());
        assertEquals("Проект по-молчанию, с проставленным bbox и одним слоем внутри.", firstProject.getDescription());
        assertTrue(firstProject.isDefault());

        projectId = Integer.valueOf(firstProject.getId());

        JsonPath layerJsonPath = layerStepDefinitions.getAllEntities().jsonPath();
        assertEquals("Тестовое название первой таблицы", layerJsonPath.get("title[0]"));
        assertEquals("EPSG:7829", layerJsonPath.get("nativeCRS[0]"));
        assertEquals("zu_pro", layerJsonPath.get("styleName[0]"));
    }

    @When("Пользователь делает запрос на все организации")
    public void checkAllOrganizationsByRoot() {
        getAllOrganizations();
    }

    @And("Представление организации корректно")
    public void checkOrgKeys() {
        Map<String, String> presentedData = response
                .then().
                        log().ifValidationFails().
                        statusCode(SC_OK).
                        extract().jsonPath().
                        getMap("");

        assertTrue(presentedData.containsKey("status"));
        assertTrue(presentedData.containsKey("groups"));
        assertTrue(presentedData.containsKey("phone"));
        assertTrue(presentedData.containsKey("createdAt"));
        assertTrue(presentedData.containsKey("users"));
    }

    @When("я отправляю запрос на создание организации используя email уже созданной организации")
    public void sendAgainCreateOrganizationRequest() {
        createOrganization(orgDto);
    }

    @When("Владелец организации запрашивает данные о своей организации")
    public void checkOrgInfo() {
        getOrganization(orgId);
    }

    @When("Администратор запрашивает данные о чужой организации")
    public void checkOtherOrgInfo() {
        Integer orgId = null;
        for (Map.Entry<Integer, OrganizationCreateDto> entry: orgPool.entrySet()) {
            Integer id = entry.getKey();
            OrganizationCreateDto dto = entry.getValue();
            if (!orgDto.getOwner().getEmail().equals(dto.getOwner().getEmail())) {
                orgId = id;
                break;
            }
        }

        getOrganization(orgId);

        assertNotNull(orgId);
    }

    private Response getDatabase(Integer orgId) {
        return getBaseRequestWithCurrentCookie()
                .when().
                        get("/api/data/databases/database_" + orgId);
    }

    private List<Map<String, Object>> getSpecializations() {
        Response specializations = getBaseRequestWithCurrentCookie()
                .when().
                        get("/specializations");

        return specializations.jsonPath().get();
    }

    private void checkStatusCodeIs(Response response, int code) {
        response.then()
                .assertThat().
                statusCode(code);
    }

    private void createOrganization(OrganizationCreateDto dto) {
        response = getBaseRequest()
                .given().
                        body(gson.toJson(dto)).
                        contentType(ContentType.JSON)
                .when().
                        log().ifValidationFails().
                        post("/organizations/init");
    }

    private void waitUntilOrganizationSuccessfullyDeleted(Integer id) throws InterruptedException {
        System.out.println("check status org: " + id);

        int currentAttempt = 0;
        do {
            System.out.println("attempt delete org: " + currentAttempt);
            currentAttempt++;

            getOrganization(id);

            if (response.statusCode() == SC_NOT_FOUND) {
                return;
            }

            sleep(RETRY_DELAY);
        } while (currentAttempt < MAX_RETRY_ATTEMPT);

        throw new RuntimeException("Organization not created: " + id);
    }

    private void waitUntilOrganizationSuccessfullyCreated(Integer id) throws InterruptedException {
        System.out.println("Wait until organization: " + id + " created.");
        authorizationBase.loginAsSystemAdmin();

        int currentAttempt = 0;
        do {
            System.out.println("check organization: " + id + " attempt: " + currentAttempt);
            currentAttempt++;

            getOrganization(id);

            if (response.statusCode() == SC_OK && "PROVISIONED".equals(response.jsonPath().get("status"))) {
                return;
            }

            sleep(RETRY_DELAY);
        } while (currentAttempt < MAX_RETRY_ATTEMPT);

        throw new RuntimeException("Organization not created: " + id);
    }

    private boolean isOrgExistInPool(String eMail) {
        return orgPool
                .values().stream()
                .anyMatch(dto -> eMail.equals(dto.getOwner().getEmail()));
    }

    private void deleteOrganization(Integer id) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        delete("/organizations/" + id);

        orgPool.remove(orgId);
    }

    private void getAllOrganizations() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/organizations/");
    }

    private void getOrganization(Integer id) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/organizations/" + id);
    }

    private Optional<OrganizationBase> tryFetchOrganizationFromServer(String orgTemplate) {
        clearAllOrganizationPools();

        authorizationBase.loginAsSystemAdmin();
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/organizations?size=314");

        List<OrganizationBase> organizations = response.jsonPath().getList("content", OrganizationBase.class);

        return organizations.stream()
                            .filter(org -> org.getId() > 0)
                            .filter(org -> org.getName().contains(orgTemplate))
                            .findFirst();
    }

    private void getSystemSettings() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/organizations/settings");
    }

    private void makeExactOrgAsCurrent(String email) {
        orgPool.entrySet().stream()
               .filter(entry -> entry.getValue().getOwner().getEmail().equals(email))
               .findFirst()
               .ifPresent(entry -> {
                   orgId = entry.getKey();
                   orgDto = entry.getValue();
               });
    }

    private void makeFirstAvailableOrgAsCurrent() {
        orgPool.entrySet().stream()
               .findFirst()
               .ifPresent(entry -> {
                   orgId = entry.getKey();
                   orgDto = entry.getValue();
               });
    }

    private boolean hasAdminAuthority(Set<AuthorityCommonDto> authorities) {
        AtomicBoolean result = new AtomicBoolean(false);
        authorities.forEach(authority -> {
            if (authority.getAuthority().equals("ORG_ADMIN")) {
                result.set(true);
            }
        });

        return result.get();
    }

    private void initNewEnhancedOrganization(String orgTemplate) throws InterruptedException {
        if ("для тестирования доступности задач согласно иерархии пользователей".equals(orgTemplate)) {
            List<String> org1 = new ArrayList<>();
            org1.add(orgTemplate);
            org1.add("1234567888");
            org1.add("orgOwner");
            org1.add("Задач");
            org1.add("EMAIL_11");
            org1.add(DEFAULT_TEST_PASSWORD);
            org1.add("1");

            List<List<String>> orgData = new ArrayList<>();
            orgData.add(org1);

            // Организация
            sendCreateOrganizationRequest(DataTable.create(orgData));

            assertEquals(SC_ACCEPTED, response.getStatusCode());
            checkOrgIdInLocationSetAsCurrentPutInPool();
            waitUntilOrganizationSuccessfullyCreated(orgId);

            // Пользователи
            authorizationBase.loginAsOwner();
            userStepsDefinitions.createUsersByTemplate("Иерархия вариант 1");

            knownOrgTemplates.put(orgTemplate, true);
        } else if ("для тестирования доступности вложений задач".equals(orgTemplate)) {
            List<String> org1 = new ArrayList<>();
            org1.add(orgTemplate);
            org1.add("1234567888");
            org1.add("orgOwner");
            org1.add("Владелец");
            org1.add("EMAIL_11");
            org1.add(DEFAULT_TEST_PASSWORD);
            org1.add("1");

            List<List<String>> orgData = new ArrayList<>();
            orgData.add(org1);

            // Организация
            sendCreateOrganizationRequest(DataTable.create(orgData));

            assertEquals(SC_ACCEPTED, response.getStatusCode());
            checkOrgIdInLocationSetAsCurrentPutInPool();
            waitUntilOrganizationSuccessfullyCreated(orgId);

            // Пользователи
            authorizationBase.loginAsOwner();
            userStepsDefinitions.createUsersByTemplate("Иерархия вариант 1");

            knownOrgTemplates.put(orgTemplate, true);
        } else if ("тестирование прав на проекты".equals(orgTemplate)) {
            List<String> orgParams = new ArrayList<>();
            orgParams.add(orgTemplate);
            orgParams.add("314159265");
            orgParams.add("orgOwner");
            orgParams.add("Владелец");
            orgParams.add("orgOwner@fiz");
            orgParams.add(DEFAULT_TEST_PASSWORD);

            List<List<String>> orgData = new ArrayList<>();
            orgData.add(orgParams);

            // Организация
            sendCreateOrganizationRequest(DataTable.create(orgData));

            assertEquals(SC_ACCEPTED, response.getStatusCode());
            checkOrgIdInLocationSetAsCurrentPutInPool();
            waitUntilOrganizationSuccessfullyCreated(orgId);

            // Пользователи
            authorizationBase.loginAsOwner();
            userStepsDefinitions.createUsersByTemplate(orgTemplate);
            userGroupStepsDefinitions.createGroupsByTemplate(orgTemplate);

            knownOrgTemplates.put(orgTemplate, true);
        } else if ("для тестирования задач РНС по СМЭВ".equals(orgTemplate)) {
            List<String> orgParams = new ArrayList<>();
            orgParams.add(orgTemplate);
            orgParams.add("1234567888");
            orgParams.add("rnsSmev");
            orgParams.add("Владелец");
            orgParams.add("rnsSmev@smev.ru");
            orgParams.add(DEFAULT_TEST_PASSWORD);
            orgParams.add("5");

            List<List<String>> orgData = new ArrayList<>();
            orgData.add(orgParams);

            // Организация
            sendCreateOrganizationRequest(DataTable.create(orgData));

            assertEquals(SC_ACCEPTED, response.getStatusCode());
            checkOrgIdInLocationSetAsCurrentPutInPool();
            waitUntilOrganizationSuccessfullyCreated(orgId);

            // Пользователи
            authorizationBase.loginAsOwner();
            userStepsDefinitions.createUsersByTemplate(orgTemplate);
            knownOrgTemplates.put(orgTemplate, true);
        } else if (orgTemplate.isEmpty()) {
            List<String> orgParams = new ArrayList<>();
            orgParams.add("ООО Любая организация");
            orgParams.add("654987640");
            orgParams.add("orgOwner");
            orgParams.add("Владелец");
            orgParams.add("orgOwner@any.ru");
            orgParams.add(DEFAULT_TEST_PASSWORD);
            orgParams.add("1");

            List<List<String>> orgData = new ArrayList<>();
            orgData.add(orgParams);

            // Организация
            sendCreateOrganizationRequest(DataTable.create(orgData));

            assertEquals(SC_ACCEPTED, response.getStatusCode());
            checkOrgIdInLocationSetAsCurrentPutInPool();
            waitUntilOrganizationSuccessfullyCreated(orgId);
        } else {
            throw new IllegalArgumentException("Передан не поддерживаемый шаблон организации: " + orgTemplate);
        }
    }
}
