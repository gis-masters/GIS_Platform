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

import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.junit.Assert.assertEquals;
import static ru.mycrg.acceptance.auth_service.UserStepsDefinitions.userId;
import static ru.mycrg.acceptance.data_service.libraries.LibraryBasePermissions.currentPermissionId;
import static ru.mycrg.acceptance.data_service.libraries.LibraryBasePermissions.makeLibraryPermissionUrl;
import static ru.mycrg.acceptance.data_service.libraries.LibraryStepsDefinitions.currentRecordId;

public class LibraryPermissionsStepsDefinitions extends BaseStepsDefinitions {

    public static final String DEFAULT_LIBRARY = "dl_default";

    public static Integer folder1Id;
    public static Integer folder11Id;
    public static Integer folder111Id;
    public static Integer file1112Id;
    public static Map<String, Integer> libraryCatalog = new HashMap<>();

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
    public void addPermissionToLibraryForCurrentUser(String role, String libraryName) {
        authorizationBase.loginAsOwner();

        String url = String.format("/%s/roleAssignment", libraryName);

        libraryBasePermissions.addPermission(url, userId, "user", role);

        response.prettyPrint();

        currentPermissionId = super.extractId(response.getHeader("Location"));
    }

    /**
     * Визуальное представление структуры каталогов и фалов представлены в файле {@code prepearedLibraryStructures}
     * который расположен тут: {@code ru/mycrg/acceptance/data_service/libraries/prepearedLibraryStructures}
     */
    @Given("В тестовой библиотеке существует следующая структура каталогов: Вариант {int}")
    public void createSomeCatalogsAndFiles(int option) {
        authorizationBase.loginAsOwner();

        if (option == 1) {
            // Root folder: folder_1
            folder1Id = baseRecords.createRecord(DEFAULT_LIBRARY, new RecordDto("folder_1"));

            // In folder_1
            String pathToFolder1 = "/root/" + folder1Id;
            folder11Id = baseRecords.createRecord(DEFAULT_LIBRARY, new RecordDto("folder_1_1", pathToFolder1));
            baseRecords.createRecord(DEFAULT_LIBRARY, new RecordDto("folder_1_2", pathToFolder1));
            baseRecords.createRecord(DEFAULT_LIBRARY, new RecordDto("file_1_1", pathToFolder1, "doc_v3"));
            baseRecords.createRecord(DEFAULT_LIBRARY, new RecordDto("file_1_2", pathToFolder1, "doc_v3"));
            baseRecords.createRecord(DEFAULT_LIBRARY, new RecordDto("file_1_3", pathToFolder1, "doc_v3"));

            // In folder_1_1
            String pathToFolder11 = String.format("/root/%d/%d", folder1Id, folder11Id);
            folder111Id = baseRecords.createRecord(DEFAULT_LIBRARY, new RecordDto("folder_1_1_1", pathToFolder11));
            baseRecords.createRecord(DEFAULT_LIBRARY, new RecordDto("folder_1_1_2", pathToFolder11));
            baseRecords.createRecord(DEFAULT_LIBRARY, new RecordDto("file_1_1_1", pathToFolder11, "doc_v3"));

            // In folder_1_1_1
            String pathToFolder111 = String.format("/root/%d/%d/%d", folder1Id, folder11Id, folder111Id);
            baseRecords.createRecord(DEFAULT_LIBRARY, new RecordDto("folder_1_1_1_1", pathToFolder111));
            baseRecords.createRecord(DEFAULT_LIBRARY, new RecordDto("folder_1_1_1_2", pathToFolder111));
            baseRecords.createRecord(DEFAULT_LIBRARY, new RecordDto("folder_1_1_1_3", pathToFolder111));
            baseRecords.createRecord(DEFAULT_LIBRARY, new RecordDto("file_1_1_1_1", pathToFolder111, "doc_v3"));
            file1112Id = baseRecords.createRecord(DEFAULT_LIBRARY,
                                                  new RecordDto("file_1_1_1_2", pathToFolder111, "doc_v3"));
        } else if (option == 2) {
            String fileContentType = "doc_v3";
            String folderContentType = "folder_v1";
            String file1 = "file_1";
            String file2 = "file_2";
            String file3 = "file_3";
            String folder1 = "folder_1";
            String folder2 = "folder_2";
            String folder3 = "folder_3";
            String folder4 = "folder_4";
            String folder5 = "folder_5";
            String folder6 = "folder_6";
            String folder7 = "folder_7";
            String folder8 = "folder_8";
            String folder9 = "folder_9";
            String folder10 = "folder_10";

            addPermissionToLibraryForCurrentUser("VIEWER", "dl_default");

            Integer file1Id = baseRecords.createRecord(DEFAULT_LIBRARY, new RecordDto(file1, null, fileContentType));
            libraryCatalog.put(file1, file1Id);
            addPermissionToRecordForCurrentUser(file1Id, "OWNER");

            Integer file2Id = baseRecords.createRecord(DEFAULT_LIBRARY, new RecordDto(file2, null, fileContentType));
            libraryCatalog.put(file2, file2Id);

            Integer folder1Id = baseRecords.createRecord(DEFAULT_LIBRARY,
                                                         new RecordDto(folder1, null, folderContentType));
            libraryCatalog.put(folder1, folder1Id);

            Integer folder2Id = baseRecords.createRecord(DEFAULT_LIBRARY,
                                                         new RecordDto(folder2, null, folderContentType));
            libraryCatalog.put(folder2, folder2Id);

            Integer folder3Id = baseRecords.createRecord(DEFAULT_LIBRARY,
                                                         new RecordDto(folder3, null, folderContentType));
            libraryCatalog.put(folder3, folder3Id);
            addPermissionToRecordForCurrentUser(folder3Id, "VIEWER");

            String pathToFolder3 = String.format("/root/%d", folder3Id);
            Integer folder4Id = baseRecords.createRecord(DEFAULT_LIBRARY,
                                                         new RecordDto(folder4, pathToFolder3, folderContentType));
            libraryCatalog.put(folder4, folder4Id);

            String pathToFolder4 = String.format("/root/%d/%d", folder3Id, folder4Id);
            Integer folder5Id = baseRecords.createRecord(DEFAULT_LIBRARY,
                                                         new RecordDto(folder5, pathToFolder4, folderContentType));
            libraryCatalog.put(folder5, folder5Id);

            String pathToFolder5 = String.format("/root/%d/%d/%d", folder3Id, folder4Id, folder5Id);
            Integer folder6Id = baseRecords.createRecord(DEFAULT_LIBRARY,
                                                         new RecordDto(folder6, pathToFolder5, folderContentType));
            libraryCatalog.put(folder6, folder6Id);

            String pathToFolder2 = String.format("/root/%d", folder2Id);
            Integer folder7Id = baseRecords.createRecord(DEFAULT_LIBRARY,
                                                         new RecordDto(folder7, pathToFolder2, folderContentType));
            libraryCatalog.put(folder7, folder7Id);

            Integer folder8Id = baseRecords.createRecord(DEFAULT_LIBRARY,
                                                         new RecordDto(folder8, pathToFolder2, folderContentType));
            libraryCatalog.put(folder8, folder8Id);
            addPermissionToRecordForCurrentUser(folder8Id, "VIEWER");

            String pathToFolder8 = String.format("/root/%d/%d", folder2Id, folder8Id);
            Integer folder9Id = baseRecords.createRecord(DEFAULT_LIBRARY,
                                                         new RecordDto(folder9, pathToFolder8, folderContentType));
            libraryCatalog.put(folder9, folder9Id);

            Integer file3Id = baseRecords.createRecord(DEFAULT_LIBRARY,
                                                       new RecordDto(file3, pathToFolder8, fileContentType));
            libraryCatalog.put(file3, file3Id);

            String pathToFolder9 = String.format("/root/%d/%d/%d", folder2Id, folder8Id, folder9Id);
            Integer folder10Id = baseRecords.createRecord(DEFAULT_LIBRARY,
                                                          new RecordDto(folder10, pathToFolder9, folderContentType));
            libraryCatalog.put(folder10, folder10Id);
            addPermissionToRecordForCurrentUser(folder10Id, "OWNER");
        } else {
            System.out.println("Nothing to create. Not supported option: " + option);
        }
    }

    @When("Владелец организации устанавливает роль VIEWER для текущего пользователя, на каталог folder_1")
    public void addPermissionForCurrentUserForRootFolder() {
        authorizationBase.loginAsOwner();

        String urlToFolder = String.format("/%s/records/%d/roleAssignment", DEFAULT_LIBRARY, folder1Id);

        libraryBasePermissions.addPermission(urlToFolder, userId, "user", "VIEWER");

        currentPermissionId = super.extractId(response.getHeader("Location"));
    }

    @Then("Пользователь не видит файлов и папок в тестовой библиотеке")
    public void checkLibraryIsEmptyForCurrentUser() {
        authorizationBase.loginAsCurrentUser();

        String url = String.format("/%s/records", DEFAULT_LIBRARY);

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

        String urlToFile = String.format("/%s/records/%d/roleAssignment", DEFAULT_LIBRARY, file1112Id);

        libraryBasePermissions.addPermission(urlToFile, userId, "user", "VIEWER");

        currentPermissionId = super.extractId(response.getHeader("Location"));
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

        String url = String.format("/%s/roleAssignment", libraryName);

        libraryBasePermissions.addPermission(url, userId, "user", "VIEWER");
    }

    @When("Пользователь пытается удалить любое из правил для библиотеки: {string}")
    public void tryRemovePermission(String libraryName) {
        authorizationBase.loginAsCurrentUser();

        response = getBaseRequestWithCurrentCookie()
                .when().
                        delete(String.format("%s/roleAssignment/%d", libraryName, currentPermissionId));
    }

    @When("Пользователь удаляет текущее разрешение для библиотеки по-умолчанию")
    public void removeCurrentPermission() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        delete(String.format("%s/roleAssignment/%d", DEFAULT_LIBRARY, currentPermissionId));
    }

    @When("Пользователь запрашивает запись {string}")
    public void getRecord(String title) {
        authorizationBase.loginAsCurrentUser();

        String url = String.format("/%s/records/" + libraryCatalog.get(title), DEFAULT_LIBRARY);

        response = getBaseRequestWithCurrentCookie()
                .when().
                        log().all().
                        get(url);
    }

    @Then("Роль пользователя {string}")
    public void checkRecordRole(String role) {
        checkResponseValue("role", role);
    }

    @And("Сообщение об отсутствии прав на запись: {string} соответствует заданному формату")
    public void checkForbiddenMsg(String title) {
        Integer integer = libraryCatalog.get(title);

        super.checkErrorResponseMessage("Недостаточно прав для просмотра записи: " + integer);
    }

    @When("Текущий пользователь запрашивает библиотеки с фильтрацией {string}")
    public void getLibrariesByFilter(String filter) {
        super.getCurrentEntityByFilter(filter);
    }

    @When("Владелец организации добавляет разрешение для текущей записи в библиотеке по умолчанию")
    public void addPermissionForCurrentRecord() {
        authorizationBase.loginAsOwner();

        String urlToFolder = String.format("/%s/records/%d/roleAssignment", DEFAULT_LIBRARY, currentRecordId);

        libraryBasePermissions.addPermission(urlToFolder, userId, "user", "VIEWER");

        currentPermissionId = super.extractId(response.getHeader("Location"));
    }

    private void addPermissionToRecordForCurrentUser(Integer recordId, String role) {
        String urlToRecord = String.format("/%s/records/%d/roleAssignment", DEFAULT_LIBRARY, recordId);

        libraryBasePermissions.addPermission(urlToRecord, userId, "user", role);

        currentPermissionId = super.extractId(response.getHeader("Location"));
    }
}
