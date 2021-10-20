package ru.mycrg.acceptance.data_service.libraries;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import org.hamcrest.collection.IsCollectionWithSize;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.auth_service.AuthorizationBase;
import ru.mycrg.acceptance.data_service.dto.PermissionCreateDto;
import ru.mycrg.acceptance.data_service.dto.RecordDto;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.assertEquals;
import static ru.mycrg.acceptance.auth_service.UserStepsDefinitions.userId;
import static ru.mycrg.acceptance.data_service.libraries.LibraryBasePermissions.currentPermission;
import static ru.mycrg.acceptance.data_service.libraries.LibraryBasePermissions.makeLibraryPermissionUrl;

public class LibraryPermissionsStepsDefinitions extends BaseStepsDefinitions {

    public static final String DEFAULT_LIBRARY = "dl_default";

    public static Integer folder1Id;
    public static Integer folder11Id;
    public static Integer folder111Id;
    public static Integer file1112Id;

    private final LibraryBaseRecords baseRecords = new LibraryBaseRecords();
    private final AuthorizationBase authorizationBase = new AuthorizationBase();
    private final LibraryBasePermissions libraryBasePermissions = new LibraryBasePermissions();

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie()
                    .basePath("/api/data/document-libraries");
    }

    @When("Пользователь делает запрос на выборку библиотек")
    public void getAllLibraries() {
        authorizationBase.loginAsCurrentUser();

        response = getBaseRequestWithCurrentCookie()
                .when().
                        get();
    }

    @When("Пользователь делает запрос на выборку не существующей библиотеки {string}")
    public void getNotExistLibrary(String libraryKey) {
        String libraryName = generateString(libraryKey);

        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + libraryName);
    }

    @Then("Отправляется запрос на создание правила для библиотеки: {string}, {string} {string} {string}")
    public void createPermissionForCurrentLibrary(String libraryName,
                                                  String role,
                                                  String principalIdKey,
                                                  String principalType) {
        long principalId = Long.parseLong(generateString(principalIdKey));
        PermissionCreateDto dto = new PermissionCreateDto(principalType, principalId, role);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(dto)).
                        contentType(ContentType.JSON)
                .when().
                        post("/" + libraryName + "/roleAssignment");
    }

    @And("Сервер передаёт Location созданного правила библиотеки: {string}")
    public void shouldReturnCorrectLibraryPermissionLocation(String libraryName) {
        String url = response.getHeader("Location");

        Integer permissionId = extractId(response.getHeader("Location"));

        assertThat(url, equalTo(makeLibraryPermissionUrl(libraryName, permissionId)));
    }

    @Given("Владелец организации устанавливает роль {string} для текущего пользователя, для библиотеки: {string}")
    public void addRuleToLibraryForCurrentUser(String role, String libraryName) {
        authorizationBase.loginAsOwner();

        final String url = String.format("/%s/roleAssignment", libraryName);

        libraryBasePermissions.addPermission(url, userId, "user", role);

        currentPermission = super.extractId(response.getHeader("Location"));
    }

    @Given("В тестовой библиотеке существует следующая структура каталогов: Вариант {int}")
    public void createCatalogs(int option) {
        if (option == 1) {
            // Root folder: folder_1
            folder1Id = baseRecords.createRecord(DEFAULT_LIBRARY, new RecordDto("folder_1"));

            // In folder_1
            final String pathToFolder1 = "/root/" + folder1Id;
            folder11Id = baseRecords.createRecord(DEFAULT_LIBRARY, new RecordDto("folder_1_1", pathToFolder1));
            baseRecords.createRecord(DEFAULT_LIBRARY, new RecordDto("folder_1_2", pathToFolder1));
            baseRecords.createRecord(DEFAULT_LIBRARY, new RecordDto("file_1_1", pathToFolder1, "doc_v3"));
            baseRecords.createRecord(DEFAULT_LIBRARY, new RecordDto("file_1_2", pathToFolder1, "doc_v3"));
            baseRecords.createRecord(DEFAULT_LIBRARY, new RecordDto("file_1_3", pathToFolder1, "doc_v3"));

            // In folder_1_1
            final String pathToFolder11 = String.format("/root/%d/%d", folder1Id, folder11Id);
            folder111Id = baseRecords.createRecord(DEFAULT_LIBRARY, new RecordDto("folder_1_1_1", pathToFolder11));
            baseRecords.createRecord(DEFAULT_LIBRARY, new RecordDto("folder_1_1_2", pathToFolder11));
            baseRecords.createRecord(DEFAULT_LIBRARY, new RecordDto("file_1_1_1", pathToFolder11, "doc_v3"));

            // In folder_1_1_1
            final String pathToFolder111 = String.format("/root/%d/%d/%d", folder1Id, folder11Id, folder111Id);
            baseRecords.createRecord(DEFAULT_LIBRARY, new RecordDto("folder_1_1_1_1", pathToFolder111));
            baseRecords.createRecord(DEFAULT_LIBRARY, new RecordDto("folder_1_1_1_2", pathToFolder111));
            baseRecords.createRecord(DEFAULT_LIBRARY, new RecordDto("folder_1_1_1_3", pathToFolder111));
            baseRecords.createRecord(DEFAULT_LIBRARY, new RecordDto("file_1_1_1_1", pathToFolder111, "doc_v3"));
            file1112Id = baseRecords.createRecord(DEFAULT_LIBRARY,
                                                  new RecordDto("file_1_1_1_2", pathToFolder111, "doc_v3"));
        } else {
            System.out.println("Nothing to create. Not supported option: " + option);
        }
    }

    @When("Владелец организации устанавливает роль VIEWER для текущего пользователя, на каталог folder_1")
    public void addPermissionForCurrentUserForRootFolder() {
        authorizationBase.loginAsOwner();

        final String urlToFolder = String.format("/%s/records/%d/roleAssignment", DEFAULT_LIBRARY, folder1Id);

        libraryBasePermissions.addPermission(urlToFolder, userId, "user", "VIEWER");

        currentPermission = super.extractId(response.getHeader("Location"));
    }

    @Then("Пользователь не видит файлов и папок в тестовой библиотеке")
    public void checkLibraryIsEmptyForCurrentUser() {
        authorizationBase.loginAsCurrentUser();

        final String url = String.format("/%s/records", DEFAULT_LIBRARY);

        response = getBaseRequestWithCurrentCookie()
                .when().
                        get(url);

        assertEquals(0, response.jsonPath().getInt("page.totalElements"));
    }

    @Then("Пользователю становятся доступны folder_1 и все вложенные каталоги и файлы в тестовой библиотеке")
    public void checkAllFoldersAllowedForCurrentUser() {
        authorizationBase.loginAsCurrentUser();

        // На самом верхнем уровне доступна одна папка: folder_1
        getBaseRequestWithCurrentCookie()
                .when().get(String.format("/%s/records", DEFAULT_LIBRARY))
                .then().body("page.totalElements", equalTo(1));

        // В папке: folder_1 доступно все 5-ть элементов
        getBaseRequestWithCurrentCookie()
                .when().get(String.format("/%s/records?parent=%d", DEFAULT_LIBRARY, folder1Id))
                .then().body("page.totalElements", equalTo(5));

        // В папке: folder_1_1 доступно все 3-ть элемента
        getBaseRequestWithCurrentCookie()
                .when().get(String.format("/%s/records?parent=%d", DEFAULT_LIBRARY, folder11Id))
                .then().body("page.totalElements", equalTo(3));

        // В папке: folder_1_1_1 доступно все 5-ть элементов
        getBaseRequestWithCurrentCookie()
                .when().get(String.format("/%s/records?parent=%d", DEFAULT_LIBRARY, folder111Id))
                .then().body("page.totalElements", equalTo(5));
    }

    @When("Владелец организации устанавливает роль VIEWER для текущего пользователя, на файл file_1_1_1_2")
    public void addPermissionForCurrentUserForFile1112() {
        authorizationBase.loginAsOwner();

        final String urlToFile = String.format("/%s/records/%d/roleAssignment", DEFAULT_LIBRARY, file1112Id);

        libraryBasePermissions.addPermission(urlToFile, userId, "user", "VIEWER");

        currentPermission = super.extractId(response.getHeader("Location"));
    }

    @Then("Пользователю становятся доступна только цепочка каталогов: folder_1->folder_1_1->folder_1_1_1, ведущая к файлу")
    public void checkFoldersAllowedForCurrentUser() {
        authorizationBase.loginAsCurrentUser();

        // На самом верхнем уровне доступна одна папка: folder_1
        getBaseRequestWithCurrentCookie()
                .when().get(String.format("/%s/records", DEFAULT_LIBRARY))
                .then().body("_embedded.records.content.id", IsCollectionWithSize.hasSize(1));

        // В папке: folder_1 доступна одна папка: folder_1_1
        getBaseRequestWithCurrentCookie()
                .when().get(String.format("/%s/records?parent=%d", DEFAULT_LIBRARY, folder1Id))
                .then().body("_embedded.records.content.id", IsCollectionWithSize.hasSize(1));

        // В папке: folder_1_1 доступна одна папка: folder_1_1_1
        getBaseRequestWithCurrentCookie()
                .when().get(String.format("/%s/records?parent=%d", DEFAULT_LIBRARY, folder11Id))
                .then().body("_embedded.records.content.id", IsCollectionWithSize.hasSize(1));

        // В папке: folder_1_1_1 доступна один файл: file_1_1_1_2
        getBaseRequestWithCurrentCookie()
                .when().get(String.format("/%s/records?parent=%d", DEFAULT_LIBRARY, folder111Id))
                .then().body("_embedded.records.content.id", IsCollectionWithSize.hasSize(1));
    }

    @When("Пользователь пытается добавить правило для библиотеки: {string}")
    public void tryAddPermission(String libraryName) {
        authorizationBase.loginAsCurrentUser();

        final String url = String.format("/%s/roleAssignment", libraryName);

        libraryBasePermissions.addPermission(url, userId, "user", "VIEWER");
    }

    @When("Пользователь пытается удалить любое из правил для библиотеки: {string}")
    public void tryRemovePermission(String libraryName) {
        authorizationBase.loginAsCurrentUser();

        response = getBaseRequestWithCurrentCookie()
                .when().
                        delete(String.format("%s/roleAssignment/%d", libraryName, currentPermission));
    }
}
