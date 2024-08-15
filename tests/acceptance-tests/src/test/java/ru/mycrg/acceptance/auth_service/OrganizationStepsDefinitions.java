package ru.mycrg.acceptance.auth_service;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.http.Cookie;
import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.GeoserverStepDefinitions;
import ru.mycrg.acceptance.auth_service.dto.OrganizationBase;
import ru.mycrg.acceptance.data_service.datasets.DatasetsStepsDefinitions;
import ru.mycrg.acceptance.data_service.features.FeaturesStepsDefinitions;
import ru.mycrg.acceptance.data_service.libraries.LibraryBaseRecords;
import ru.mycrg.acceptance.data_service.tables.TablesStepsDefinitions;
import ru.mycrg.acceptance.data_service.tasks.TaskStepDefinition;
import ru.mycrg.acceptance.gis_service.LayerStepDefinitions;
import ru.mycrg.acceptance.gis_service.ProjectStepsDefinitions;
import ru.mycrg.auth_service_contract.dto.AuthorityCommonDto;
import ru.mycrg.auth_service_contract.dto.OrganizationCreateDto;
import ru.mycrg.auth_service_contract.dto.UserCreateDto;
import ru.mycrg.data_service_contract.enums.TaskType;

import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;

import static java.lang.Thread.sleep;
import static org.apache.http.HttpStatus.*;
import static org.junit.Assert.*;
import static ru.mycrg.acceptance.auth_service.AuthorizationBase.DEFAULT_TEST_PASSWORD;
import static ru.mycrg.acceptance.data_service.datasets.DatasetsStepsDefinitions.currentDatasetIdentifier;
import static ru.mycrg.acceptance.gis_service.ProjectStepsDefinitions.projectId;

public class OrganizationStepsDefinitions extends BaseStepsDefinitions {

    public static final int MAX_RETRY_ATTEMPT = 20;
    public static final int RETRY_DELAY = 6000;
    public static final int RETRY_DELAY_SM = 1000;

    public static Integer orgId;
    public static String emailForFeature;
    public static OrganizationCreateDto orgDto;

    private static final Map<String, Boolean> knownOrgTemplates = new HashMap<>() {{
        put("для тестирования доступности задач согласно иерархии пользователей", false);
    }};

    private final AuthorizationBase authorizationBase = new AuthorizationBase();
    private final TaskStepDefinition taskStepDefinition = new TaskStepDefinition();
    private final UserStepsDefinitions userStepsDefinitions = new UserStepsDefinitions();
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
        UserCreateDto owner = new UserCreateDto(generateString(data.get(2)), generateString(data.get(3)),
                                                ownerEmail, generateString(data.get(5)));

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
                                                    "aA111111");

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

        // Наличие найстроек организаций у системного администратора
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
        waitUntilOrganizationSuccessfullyDeleted(orgId, cookie);

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

    @Given("Существует организация созданная по шаблону: {string}")
    public void initEnhancedOrganization(String orgTemplate) throws InterruptedException {
        if (!knownOrgTemplates.containsKey(orgTemplate)) {
            throw new IllegalStateException(
                    String.format("Unknown orgTemplate: %s Plz implement it first!", orgTemplate));
        }

        if ("для тестирования доступности задач согласно иерархии пользователей".equals(orgTemplate)) {
            Boolean orgCreated = knownOrgTemplates.get(orgTemplate);
            if (!orgCreated) {
                List<String> org1 = new ArrayList<>();
                org1.add("ООО Задачи");
                org1.add("1234567888");
                org1.add("orgOwner");
                org1.add("Задач");
                org1.add("EMAIL_11");
                org1.add("aA111111");

                List<List<String>> orgData = new ArrayList<>();
                orgData.add(org1);

                sendCreateOrganizationRequest(DataTable.create(orgData));
                assertEquals(SC_ACCEPTED, response.getStatusCode());
                checkOrgIdInLocationSetAsCurrentPutInPool();
                waitUntilOrganizationSuccessfullyCreated(orgId);

                authorizationBase.loginAsOwner();
                userStepsDefinitions.createUsersByHierarchy("Иерархия вариант 1");
                initTasks();

                knownOrgTemplates.put(orgTemplate, true);
            } else {
                System.out.println("Organization already created by template: " + orgTemplate);
            }
        }
    }

    @Given("Существует новая организация")
    public void initNewOrg(DataTable dataTable) throws InterruptedException {
        sendCreateOrganizationRequest(dataTable);

        assertEquals(SC_ACCEPTED, response.getStatusCode());

        checkOrgIdInLocationSetAsCurrentPutInPool();

        waitUntilOrganizationSuccessfullyCreated(orgId);
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
                                                    emailForFeature, generateString(data.get(5)));

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
    public void getExistOrg() throws InterruptedException {
        fillOrganizationPoolFromServer();

        Iterator<Map.Entry<Integer, OrganizationCreateDto>> iterator = orgPool.entrySet().iterator();
        if (iterator.hasNext()) {
            Map.Entry<Integer, OrganizationCreateDto> entry = iterator.next();
            orgId = entry.getKey();
            orgDto = entry.getValue();

            System.out.println("Выбрана организация с id: " + orgId);
            System.out.println("Org owner: [" + orgDto.getOwner().getEmail() + "]");
        } else {
            List<String> data = new ArrayList<>();
            data.add("ООО AnyOrganization");
            data.add("1234567890");
            data.add("AnyAny");
            data.add("Any");
            data.add("EMAIL_12");
            data.add(DEFAULT_TEST_PASSWORD);

            List<List<String>> raw = new ArrayList<>();
            raw.add(data);

            initOrg(DataTable.create(raw));
        }
    }

    private void fillOrganizationPoolFromServer() {
        authorizationBase.loginAsSystemAdmin();

        response = getBaseRequestWithCurrentCookie()
                .when().
                        log().all().
                        get("/organizations");

        List<OrganizationBase> organizations = response.jsonPath().getList("content", OrganizationBase.class);
        for (OrganizationBase org: organizations) {
            final UserCreateDto[] ownerTmp = new UserCreateDto[1];
            org.getUsers().stream()
               .filter(user -> hasAdminAuthority(user.getAuthorities()))
               .findFirst()
               .ifPresent(userDto -> {
                   ownerTmp[0] = new UserCreateDto(userDto.getName(), userDto.getSurname(), userDto.getEmail(),
                                                   DEFAULT_TEST_PASSWORD);
               });

            if (ownerTmp[0] != null) {
                orgPool.put(org.getId(), new OrganizationCreateDto(org.getName(), org.getPhone(), ownerTmp[0]));
            }
        }
    }

    @When("Посылается запрос на удаление текущей организации")
    public void deleteCurrentOrganization() {
        assertNotNull(orgId);

        deleteOrganization(orgId);
    }

    @When("Посылается запрос на удаление чужой организации")
    public void deleteOtherOrganization() {
        Integer orgId = null;
        for (Map.Entry<Integer, OrganizationCreateDto> entry: orgPool.entrySet()) {
            Integer id = entry.getKey();
            OrganizationCreateDto dto = entry.getValue();
            if (!orgDto.getOwner().getEmail().equals(dto.getOwner().getEmail())) {
                orgId = id;
            }
        }

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

    @And("Согласно специализации созданы: набор данных, таблица с данными, библиотека документов, проект и слои")
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
        assertEquals("Проект по специализации 1", projectJsonPath.get("content.name[0]"));

        projectId = Integer.valueOf(projectJsonPath.get("content.id[0]").toString());

        JsonPath layerJsonPath = layerStepDefinitions.getAllEntities().jsonPath();
        assertEquals("Тестовое название первой таблицы", layerJsonPath.get("title[0]"));
        assertEquals("EPSG:7829", layerJsonPath.get("nativeCRS[0]"));
        assertEquals("zu_pro", layerJsonPath.get("styleName[0]"));
    }

    @When("Пользователь делает запрос на все организации")
    public void checkAllOrganizationsByRoot() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/organizations");
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

    @When("Администратор запрашивает данные о своей организации")
    public void checkOrgInfo() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/organizations/" + orgId);
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

        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/organizations/" + orgId);

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

    private void waitUntilOrganizationSuccessfullyDeleted(Integer id, Cookie cookie) throws InterruptedException {
        System.out.println("check status org: " + id);

        int currentAttempt = 0;
        do {
            System.out.println("attempt delete org: " + currentAttempt);
            currentAttempt++;

            Response response = getBaseRequestWithCurrentCookie()
                    .when().
                            get("/organizations/" + id);

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

            Response response = getBaseRequestWithCurrentCookie()
                    .when().
                            get("/organizations/" + id);

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

    private void getOrganization(Integer id) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        log().all().
                        get("/organizations/" + id);
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

    private void initTasks() {
        // Create tasks as owner
        authorizationBase.loginAsOwner();

        List<String> task1 = new ArrayList<>();
        task1.add("orgOwner");
        task1.add("orgOwner");
        task1.add(TaskType.CUSTOM.name());
        task1.add("orgOwner task 1");

        List<String> task2 = new ArrayList<>();
        task2.add("orgOwner");
        task2.add("orgOwner");
        task2.add(TaskType.CUSTOM.name());
        task2.add("orgOwner task 2");

        List<String> task3 = new ArrayList<>();
        task3.add("fiz1");
        task3.add("fiz1");
        task3.add(TaskType.CUSTOM.name());
        task3.add("fiz1 task 1");

        List<String> task4 = new ArrayList<>();
        task4.add("fiz1");
        task4.add("fiz1");
        task4.add(TaskType.CUSTOM.name());
        task4.add("fiz1 task 2");

        List<String> task5 = new ArrayList<>();
        task5.add("fiz1");
        task5.add("fiz1");
        task5.add(TaskType.CUSTOM.name());
        task5.add("fiz1 task 3");

        List<String> task6 = new ArrayList<>();
        task6.add("fiz2");
        task6.add("fiz2");
        task6.add(TaskType.CUSTOM.name());
        task6.add("fiz2 task 1");

        List<String> task7 = new ArrayList<>();
        task7.add("fiz2");
        task7.add("fiz2");
        task7.add(TaskType.CUSTOM.name());
        task7.add("fiz2 task 2");

        List<List<String>> tasksForOwner = new ArrayList<>();
        tasksForOwner.add(task1);
        tasksForOwner.add(task2);
        tasksForOwner.add(task3);
        tasksForOwner.add(task4);
        tasksForOwner.add(task5);
        tasksForOwner.add(task6);
        tasksForOwner.add(task7);

        taskStepDefinition.initTasks(DataTable.create(tasksForOwner));

        // Create tasks as fiz2
        UserCreateDto user2 = getUserByName("fiz2");
        authorizationBase.loginAs(user2.getEmail(), user2.getPassword());

        List<String> task8 = new ArrayList<>();
        task8.add("fiz3");
        task8.add("fiz3");
        task8.add(TaskType.CUSTOM.name());
        task8.add("fiz3 task 1");

        List<List<String>> tasksForFiz2 = new ArrayList<>();
        tasksForFiz2.add(task8);

        taskStepDefinition.initTasks(DataTable.create(tasksForFiz2));

        // Create tasks as fiz3
        UserCreateDto user3 = getUserByName("fiz3");
        authorizationBase.loginAs(user3.getEmail(), user3.getPassword());

        List<String> task9 = new ArrayList<>();
        task9.add("fiz4");
        task9.add("fiz4");
        task9.add(TaskType.CUSTOM.name());
        task9.add("fiz4 task 1");

        List<String> task10 = new ArrayList<>();
        task10.add("fiz4");
        task10.add("fiz4");
        task10.add(TaskType.CUSTOM.name());
        task10.add("fiz4 task 2");

        List<String> task11 = new ArrayList<>();
        task11.add("fiz4");
        task11.add("fiz4");
        task11.add(TaskType.CUSTOM.name());
        task11.add("fiz4 task 3");

        List<List<String>> tasksForFiz4 = new ArrayList<>();
        tasksForFiz4.add(task9);
        tasksForFiz4.add(task10);
        tasksForFiz4.add(task11);

        taskStepDefinition.initTasks(DataTable.create(tasksForFiz4));

        // Create tasks as fiz5
        UserCreateDto user5 = getUserByName("fiz5");
        authorizationBase.loginAs(user5.getEmail(), user5.getPassword());

        List<String> task5_1 = new ArrayList<>();
        task5_1.add("fiz5");
        task5_1.add("fiz5");
        task5_1.add(TaskType.CUSTOM.name());
        task5_1.add("description of fiz5 task 1");

        List<List<String>> tasksForFiz5 = new ArrayList<>();
        tasksForFiz5.add(task5_1);

        taskStepDefinition.initTasks(DataTable.create(tasksForFiz5));
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
}
