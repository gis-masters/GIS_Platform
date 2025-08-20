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
import static org.hamcrest.core.IsNull.notNullValue;
import static org.junit.Assert.assertEquals;
import static ru.mycrg.acceptance.auth_service.UserGroupStepsDefinitions.usersGroupId;
import static ru.mycrg.acceptance.auth_service.UserStepsDefinitions.userId;
import static ru.mycrg.acceptance.data_service.libraries.LibraryBasePermissions.currentPermissionId;
import static ru.mycrg.acceptance.data_service.libraries.LibraryBasePermissions.makeLibraryPermissionUrl;
import static ru.mycrg.acceptance.data_service.libraries.LibraryStepsDefinitions.*;

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

    @When("Владелец организации делает запрос на выборку библиотек")
    public void ownerGetAllLibraries() {
        authorizationBase.loginAsOwner();

        response = getBaseRequestWithCurrentCookie()
                .when().
                        get();
    }

    @When("Текущий пользователь делает запрос на выборку библиотек")
    public void getAllLibrariesAsCurrentUser() {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get();
    }

    @When("Пользователь делает запрос на выборку библиотеки {string}")
    public void getLibrary(String libraryName) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + libraryName);
    }

    @When("Пользователь делает запрос на выборку не существующей библиотеки {string}")
    public void getNotExistLibrary(String libraryKey) {
        String libraryName = generateString(libraryKey);

        getLibrary(libraryName);
    }

    @When("Пользователь делает запрос на получение текущей библиотеки")
    public void getCurrentLibrary() {
        getLibrary(currentLibrary.getTableName());
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

    @Then("Созданная библиотека содержит схему в поле: {string}")
    public void shouldReturnSchema(String fieldName) {
        response.then()
                .body(fieldName, notNullValue());
    }

    @And("Сервер передаёт Location созданного правила библиотеки: {string}")
    public void shouldReturnCorrectLibraryPermissionLocation(String libraryName) {
        Integer permissionId = extractId(response);

        assertThat(response.getHeader("Location"),
                   equalTo(makeLibraryPermissionUrl(libraryName, permissionId)));
    }

    @Given("Владелец организации устанавливает роль {string} для текущего пользователя, для библиотеки: {string}")
    public void addPermissionToLibraryForCurrentUser(String role, String libraryName) {
        authorizationBase.loginAsOwner();

        setRoleForCurrentUserToLibrary(libraryName, role);
        int statusCode = response.statusCode();
        if (statusCode == 201) {
            currentPermissionId = super.extractId(response);
        } else if (statusCode == 409) {
            System.out.println("Роль: " + role + " уже установлена для: " + libraryName);
        } else {
            String msg = String.format("Роль: %s уже установлена для: %s", role, libraryName);

            throw new IllegalStateException(msg);
        }
    }

    @Given("Владелец организации текущему пользователю, для текущей библиотеки, устанавливает роль {string}")
    public void addPermissionToLibraryForCurrentUser2(String role) {
        authorizationBase.loginAsOwner();

        setRoleForCurrentUserToLibrary(currentLibrary.getTableName(), role);
        int statusCode = response.statusCode();
        if (statusCode == 201) {
            currentPermissionId = super.extractId(response);
        } else if (statusCode == 409) {
            System.out.println("Роль: " + role + " уже установлена для: " + currentLibrary.getTableName());
        } else {
            String msg = String.format("Роль: %s уже установлена для: %s", role, currentLibrary.getTableName());

            throw new IllegalStateException(msg);
        }
    }

    @Given("для пользователя {string} установлена роль {string}, для каталога {int} в библиотеке {string}")
    public void setRoleForUserForFolderIdForLibrary(String userName, String role, int folderId, String library) {
        String urlToFile = String.format("/%s/records/%d/roleAssignment", library, folderId);

        libraryBasePermissions.addPermission(urlToFile, getUserIdByName(userName), "user", role);
    }

    @Given("для пользователя {string} установлена роль {string}, для библиотеки: {string}")
    public void setPermissionToLibraryForUser(String userName, String role, String libraryName) {
        int userId = getUserIdByName(userName);
        setRoleForUserToLibrary(userId, libraryName, role);

        int statusCode = response.statusCode();
        if (statusCode == 201) {
            currentPermissionId = super.extractId(response);
        } else if (statusCode == 409) {
            System.out.println("Роль: " + role + " уже установлена для: " + libraryName);
        } else {
            String msg = String.format("Пользователю: %d Не удалось установить роль: %s для: %s => %d",
                                       userId, role, libraryName, statusCode);

            throw new IllegalStateException(msg);
        }
    }

    @Given("Текущему пользователю установлена роль {string}, для библиотеки: {string}")
    public void setPermissionToLibraryForCurrentUser(String role, String libraryName) {
        authorizationBase.loginAsOwner();

        setRoleForCurrentUserToLibrary(libraryName, role);

        int statusCode = response.statusCode();
        if (statusCode == 201) {
            currentPermissionId = super.extractId(response);
        } else if (statusCode == 409) {
            System.out.println("Роль: " + role + " уже установлена для: " + libraryName);
        } else {
            String msg = String.format("Роль: %s уже установлена для: %s", role, libraryName);

            throw new IllegalStateException(msg);
        }
    }

    @Given("Владелец организации устанавливает роль {string} для текущей группы, для библиотеки: {string}")
    public void addPermissionToLibraryForCurrentGroup(String role, String libraryName) {
        authorizationBase.loginAsOwner();

        setRoleForCurrentGroupToLibrary(libraryName, role);
    }

    /**
     * Визуальное представление структуры каталогов и фалов представлены в файле {@code prepearedLibraryStructures}
     * который расположен тут: {@code ru/mycrg/acceptance/data_service/libraries/prepearedLibraryStructures}
     */
    @Given("Владельцем организации, в тестовой библиотеке создана следующая структура каталогов: Вариант {int}")
    public void createSomeCatalogsAndFiles(int option) {
        authorizationBase.loginAsOwner();

        String library = DEFAULT_LIBRARY;

        if (option == 1) {
            // Root folder: folder_1
            folder1Id = baseRecords.createRecordWithCheck(library, new RecordDto("folder_1"));

            // In folder_1
            String pathToFolder1 = "/root/" + folder1Id;
            folder11Id = baseRecords.createRecordWithCheck(library, new RecordDto("folder_1_1", pathToFolder1));
            baseRecords.createRecordWithCheck(library, new RecordDto("folder_1_2", pathToFolder1));
            baseRecords.createRecordWithCheck(library, new RecordDto("file_1_1", pathToFolder1, "doc_v3"));
            baseRecords.createRecordWithCheck(library, new RecordDto("file_1_2", pathToFolder1, "doc_v3"));
            baseRecords.createRecordWithCheck(library, new RecordDto("file_1_3", pathToFolder1, "doc_v3"));

            // In folder_1_1
            String pathToFolder11 = String.format("/root/%d/%d", folder1Id, folder11Id);
            folder111Id = baseRecords.createRecordWithCheck(library,
                                                            new RecordDto("folder_1_1_1", pathToFolder11));
            baseRecords.createRecordWithCheck(library, new RecordDto("folder_1_1_2", pathToFolder11));
            baseRecords.createRecordWithCheck(library, new RecordDto("file_1_1_1", pathToFolder11, "doc_v3"));

            // In folder_1_1_1
            String pathToFolder111 = String.format("/root/%d/%d/%d", folder1Id, folder11Id, folder111Id);
            baseRecords.createRecordWithCheck(library, new RecordDto("folder_1_1_1_1", pathToFolder111));
            baseRecords.createRecordWithCheck(library, new RecordDto("folder_1_1_1_2", pathToFolder111));
            baseRecords.createRecordWithCheck(library, new RecordDto("folder_1_1_1_3", pathToFolder111));
            baseRecords.createRecordWithCheck(library,
                                              new RecordDto("file_1_1_1_1", pathToFolder111, "doc_v3"));
            file1112Id = baseRecords.createRecordWithCheck(library,
                                                           new RecordDto("file_1_1_1_2", pathToFolder111, "doc_v3"));
        } else if (option == 2) {
            String fileContentType = "doc_v3";
            String folderContentType = "folder_v1";
            String file1 = "file_1";
            String file2 = "file_2";
            String file3 = "file_3";
            String file4 = "file_4";
            String file5 = "file_5";
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
            String folder11 = "folder_11";
            String folder12 = "folder_12";

            addPermissionToLibraryForCurrentUser("CONTRIBUTOR", library);

            Integer file1Id = baseRecords.createRecordWithCheck(library,
                                                                new RecordDto(file1, null, fileContentType));
            libraryCatalog.put(file1, file1Id);
            addPermissionToRecordForCurrentUser(file1Id, "OWNER");

            Integer file2Id = baseRecords.createRecordWithCheck(library,
                                                                new RecordDto(file2, null, fileContentType));
            libraryCatalog.put(file2, file2Id);

            Integer folder1Id = baseRecords.createRecordWithCheck(library,
                                                                  new RecordDto(folder1, null, folderContentType));
            libraryCatalog.put(folder1, folder1Id);

            Integer folder2Id = baseRecords.createRecordWithCheck(library,
                                                                  new RecordDto(folder2, null, folderContentType));
            libraryCatalog.put(folder2, folder2Id);

            Integer folder3Id = baseRecords.createRecordWithCheck(library,
                                                                  new RecordDto(folder3, null, folderContentType));
            libraryCatalog.put(folder3, folder3Id);
            addPermissionToRecordForCurrentUser(folder3Id, "VIEWER");

            String pathToFolder3 = String.format("/root/%d", folder3Id);
            Integer folder4Id = baseRecords.createRecordWithCheck(library,
                                                                  new RecordDto(folder4, pathToFolder3,
                                                                                folderContentType));
            libraryCatalog.put(folder4, folder4Id);

            String pathToFolder4 = String.format("/root/%d/%d", folder3Id, folder4Id);
            Integer folder5Id = baseRecords.createRecordWithCheck(library,
                                                                  new RecordDto(folder5, pathToFolder4,
                                                                                folderContentType));
            libraryCatalog.put(folder5, folder5Id);

            String pathToFolder5 = String.format("/root/%d/%d/%d", folder3Id, folder4Id, folder5Id);
            Integer folder6Id = baseRecords.createRecordWithCheck(library,
                                                                  new RecordDto(folder6, pathToFolder5,
                                                                                folderContentType));
            libraryCatalog.put(folder6, folder6Id);

            String pathToFolder2 = String.format("/root/%d", folder2Id);
            Integer folder7Id = baseRecords.createRecordWithCheck(library,
                                                                  new RecordDto(folder7, pathToFolder2,
                                                                                folderContentType));
            libraryCatalog.put(folder7, folder7Id);

            Integer folder8Id = baseRecords.createRecordWithCheck(library,
                                                                  new RecordDto(folder8, pathToFolder2,
                                                                                folderContentType));
            libraryCatalog.put(folder8, folder8Id);
            addPermissionToRecordForCurrentUser(folder8Id, "VIEWER");

            String pathToFolder8 = String.format("/root/%d/%d", folder2Id, folder8Id);
            Integer folder9Id = baseRecords.createRecordWithCheck(library,
                                                                  new RecordDto(folder9, pathToFolder8,
                                                                                folderContentType));
            libraryCatalog.put(folder9, folder9Id);

            Integer file3Id = baseRecords.createRecordWithCheck(library,
                                                                new RecordDto(file3, pathToFolder8, fileContentType));
            libraryCatalog.put(file3, file3Id);

            String pathToFolder9 = String.format("/root/%d/%d/%d", folder2Id, folder8Id, folder9Id);
            Integer folder10Id = baseRecords.createRecordWithCheck(library,
                                                                   new RecordDto(folder10, pathToFolder9,
                                                                                 folderContentType));
            libraryCatalog.put(folder10, folder10Id);
            addPermissionToRecordForCurrentUser(folder10Id, "OWNER");

            String pathToFolder10 = String.format("/root/%d/%d/%d/%d", folder2Id, folder8Id, folder9Id, folder10Id);
            Integer folder11Id = baseRecords.createRecordWithCheck(library,
                                                                   new RecordDto(folder11, pathToFolder10,
                                                                                 folderContentType));
            libraryCatalog.put(folder11, folder11Id);

            Integer file4Id = baseRecords.createRecordWithCheck(library,
                                                                new RecordDto(file4, pathToFolder10, fileContentType));
            libraryCatalog.put(file4, file4Id);

            String pathToFolder11 = String.format("/root/%d/%d/%d/%d/%d",
                                                  folder2Id, folder8Id, folder9Id, folder10Id, folder11Id);
            Integer file5Id = baseRecords.createRecordWithCheck(library,
                                                                new RecordDto(file5, pathToFolder11, fileContentType));
            libraryCatalog.put(file5, file5Id);

            Integer folder12Id = baseRecords.createRecordWithCheck(library,
                                                                   new RecordDto(folder12, null, folderContentType));
            libraryCatalog.put(folder12, folder12Id);
            addPermissionToRecordForCurrentUser(folder12Id, "OWNER");
        } else if (option == 3) {
            // Root folder: folder_1
            folder1Id = baseRecords.createRecordWithCheck(library, new RecordDto("folder_v3_1"));

            // In folder_1
            String pathToFolder1 = "/root/" + folder1Id;
            baseRecords.createRecordWithCheck(library, new RecordDto("folder_v3_1_1", pathToFolder1));
            baseRecords.createRecordWithCheck(library, new RecordDto("folder_v3_1_2", pathToFolder1));
            baseRecords.createRecordWithCheck(library, new RecordDto("folder_v3_1_3", pathToFolder1));
            baseRecords.createRecordWithCheck(library, new RecordDto("folder_v3_1_4", pathToFolder1));
            baseRecords.createRecordWithCheck(library, new RecordDto("folder_v3_1_5", pathToFolder1));
            baseRecords.createRecordWithCheck(library, new RecordDto("folder_v3_1_6", pathToFolder1));
            baseRecords.createRecordWithCheck(library, new RecordDto("folder_v3_1_7", pathToFolder1));
            baseRecords.createRecordWithCheck(library, new RecordDto("folder_v3_1_8", pathToFolder1));
            baseRecords.createRecordWithCheck(library, new RecordDto("folder_v3_1_9", pathToFolder1));

            // Root folder: folder_2
            Integer folder2Id = baseRecords.createRecordWithCheck(library, new RecordDto("folder_v3_2"));

            // In folder_2
            String pathToFolder2 = "/root/" + folder2Id;
            baseRecords.createRecordWithCheck(library,
                                              new RecordDto("file_2_1", pathToFolder2, "doc_v3"));
        } else if (option == 4) {
            String folder1Title = "Folder 1";
            String folder2Title = "Folder 2";

            addPermissionToLibraryForCurrentUser("VIEWER", library);

            Integer folder1Id = baseRecords.createRecordWithCheck(library, new RecordDto(folder1Title));
            libraryCatalog.put(folder1Title, folder1Id);
            addPermissionToRecordForCurrentUser(folder1Id, "OWNER");

            Integer folder2Id = baseRecords.createRecordWithCheck(library, new RecordDto(folder2Title));
            libraryCatalog.put(folder2Title, folder2Id);
            addPermissionToRecordForCurrentUser(folder2Id, "OWNER");
        } else {
            System.out.println("Nothing to create. Not supported option: " + option);
        }
    }

    @When("Владелец организации устанавливает роль VIEWER для текущего пользователя, на каталог folder_1")
    public void addPermissionForCurrentUserForRootFolder() {
        authorizationBase.loginAsOwner();

        String urlToFolder = String.format("/%s/records/%d/roleAssignment", DEFAULT_LIBRARY, folder1Id);

        libraryBasePermissions.addPermission(urlToFolder, userId, "user", "VIEWER");

        currentPermissionId = super.extractId(response);
    }

    @When("Текущему пользователю установлена роль {string}, для файла file_1_1_1_2")
    public void setRoleForCurrentUserForFile1112(String role) {
        authorizationBase.loginAsOwner();

        String urlToFile = String.format("/%s/records/%d/roleAssignment", DEFAULT_LIBRARY, file1112Id);
        libraryBasePermissions.addPermission(urlToFile, userId, "user", role);
    }

    @When("Текущему пользователю установлена роль {string}, для каталога folder_1")
    public void setRoleForCurrentUserForFolder1(String role) {
        authorizationBase.loginAsOwner();

        String urlToFile = String.format("/%s/records/%d/roleAssignment", DEFAULT_LIBRARY, folder1Id);
        libraryBasePermissions.addPermission(urlToFile, userId, "user", role);
    }

    @When("Текущему пользователю установлена роль {string}, для каталога {int} в библиотеке {string}")
    public void setRoleForCurrentUserForFolderIdForLibrary(String role, int folderId, String library) {
        authorizationBase.loginAsOwner();

        String urlToFile = String.format("/%s/records/%d/roleAssignment", library, folderId);
        libraryBasePermissions.addPermission(urlToFile, userId, "user", role);
    }

    @When("Текущему пользователю установлена роль {string}, для каталога folder_1_1")
    public void setRoleForCurrentUserForFolder11(String role) {
        authorizationBase.loginAsOwner();

        String urlToFile = String.format("/%s/records/%d/roleAssignment", DEFAULT_LIBRARY, folder11Id);
        libraryBasePermissions.addPermission(urlToFile, userId, "user", role);
    }

    @When("Текущему пользователю установлена роль {string}, для текущей записи")
    public void setRoleForCurrentUserForCurrentDocument(String role) {
        authorizationBase.loginAsOwner();

        String urlToFile = String.format("/%s/records/%d/roleAssignment", DEFAULT_LIBRARY, currentDocumentId);
        libraryBasePermissions.addPermission(urlToFile, userId, "user", role);
    }

    @When("Текущему пользователю установлена роль {string}, для текущей папки")
    public void setRoleForCurrentUserForCurrentFolder(String role) {
        authorizationBase.loginAsOwner();

        String urlToFile = String.format("/%s/records/%d/roleAssignment", DEFAULT_LIBRARY, currentFolderId);
        libraryBasePermissions.addPermission(urlToFile, userId, "user", role);
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

    @Then("пользователь пытается создать новый каталог в каталоге folder_1")
    public void tryCreateNewFolderInFolder1() {
        authorizationBase.loginAsCurrentUser();

        String pathToFolder1 = "/root/" + folder1Id;
        baseRecords.createRecord(DEFAULT_LIBRARY, new RecordDto("someNewFolder", pathToFolder1));
    }

    @Then("пользователь пытается создать новый каталог в каталоге folder_1_1_1")
    public void tryCreateNewFolderInFolder111() {
        authorizationBase.loginAsCurrentUser();

        String pathToFolder1 = "/root/" + folder111Id;
        baseRecords.createRecord(DEFAULT_LIBRARY, new RecordDto("someNewFolder", pathToFolder1));
    }

    @Then("пользователь пытается редактировать каталог folder_1_1")
    public void tryEditFolder11() {
        authorizationBase.loginAsCurrentUser();

        baseRecords.updateRecord(DEFAULT_LIBRARY, folder11Id, new RecordDto("new title for folder_1_1"));
    }

    @Then("пользователь пытается удалить каталог folder_1_1")
    public void tryDeleteFolder11() {
        authorizationBase.loginAsCurrentUser();

        baseRecords.deleteRecordFromDefaultLibrary(folder11Id, DEFAULT_LIBRARY);
    }

    @Then("пользователь пытается создать новый каталог в тестовой библиотеке")
    public void createNewFolderInDefaultLibrary() {
        authorizationBase.loginAsCurrentUser();

        baseRecords.createRecord(DEFAULT_LIBRARY, new RecordDto("someNewFolder"));
    }

    @Then("пользователь пытается редактировать каталог folder_1, расположенный в корне библиотеки: {string}")
    public void tryEditFolder1(String library) {
        authorizationBase.loginAsCurrentUser();

        baseRecords.updateRecord(library, folder1Id, new RecordDto("new title for Folder1"));
    }

    @Then("пользователь пытается удалить каталог folder_1, расположенный в корне библиотеки: {string}")
    public void tryRemoveFolder1FromDefaultLibrary(String libraryName) {
        authorizationBase.loginAsCurrentUser();

        baseRecords.deleteRecordFromDefaultLibrary(folder1Id, libraryName);
    }

    @When("Владелец организации устанавливает роль VIEWER для текущего пользователя, на файл file_1_1_1_2")
    public void addPermissionForCurrentUserForFile1112() {
        authorizationBase.loginAsOwner();

        String urlToFile = String.format("/%s/records/%d/roleAssignment", DEFAULT_LIBRARY, file1112Id);

        libraryBasePermissions.addPermission(urlToFile, userId, "user", "VIEWER");

        currentPermissionId = super.extractId(response);
    }

    @Then("Пользователю становятся доступна только цепочка каталогов: folder_1->folder_1_1->folder_1_1_1, ведущая к файлу")
    public void checkFoldersAllowedForCurrentUser() {
        authorizationBase.loginAsCurrentUser();

        // На самом верхнем уровне доступна одна папка: folder_1
        getBaseRequestWithCurrentCookie()
                .when().get(String.format("/%s/records", DEFAULT_LIBRARY))
                .then().body("content.content.id", IsCollectionWithSize.hasSize(1));

        // В папке: folder_1 доступна одна папка: folder_1_1
        getBaseRequestWithCurrentCookie()
                .when().get(String.format("/%s/records?parent=%d", DEFAULT_LIBRARY, folder1Id))
                .then().body("content.content.id", IsCollectionWithSize.hasSize(1));

        // В папке: folder_1_1 доступна одна папка: folder_1_1_1
        getBaseRequestWithCurrentCookie()
                .when().get(String.format("/%s/records?parent=%d", DEFAULT_LIBRARY, folder11Id))
                .then().body("content.content.id", IsCollectionWithSize.hasSize(1));

        // В папке: folder_1_1_1 доступна один файл: file_1_1_1_2
        getBaseRequestWithCurrentCookie()
                .when().get(String.format("/%s/records?parent=%d", DEFAULT_LIBRARY, folder111Id))
                .then().body("content.content.id", IsCollectionWithSize.hasSize(1));
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

        String urlToFolder = String.format("/%s/records/%d/roleAssignment", DEFAULT_LIBRARY, currentDocumentId);

        libraryBasePermissions.addPermission(urlToFolder, userId, "user", "VIEWER");

        currentPermissionId = super.extractId(response);
    }

    private void addPermissionToRecordForCurrentUser(Integer recordId, String role) {
        String urlToRecord = String.format("/%s/records/%d/roleAssignment", DEFAULT_LIBRARY, recordId);

        libraryBasePermissions.addPermission(urlToRecord, userId, "user", role);

        currentPermissionId = super.extractId(response);
    }

    private void setRoleForCurrentUserToLibrary(String libraryName, String role) {
        String url = String.format("/%s/roleAssignment", libraryName);

        libraryBasePermissions.addPermission(url, userId, "user", role);
    }

    private void setRoleForUserToLibrary(Integer userId, String libraryName, String role) {
        String url = String.format("/%s/roleAssignment", libraryName);

        libraryBasePermissions.addPermission(url, userId, "user", role);
    }

    private void setRoleForCurrentGroupToLibrary(String libraryName, String role) {
        String url = String.format("/%s/roleAssignment", libraryName);

        libraryBasePermissions.addPermission(url, usersGroupId, "group", role);

        currentPermissionId = super.extractId(response);
    }
}
