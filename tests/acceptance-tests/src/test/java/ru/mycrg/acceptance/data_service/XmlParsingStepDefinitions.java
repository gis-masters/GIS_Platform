package ru.mycrg.acceptance.data_service;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.restassured.common.mapper.TypeRef;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.data_service.datasets.DatasetsStepsDefinitions;
import ru.mycrg.acceptance.data_service.dto.DatasetCreateDto;
import ru.mycrg.acceptance.data_service.dto.LibraryModel;
import ru.mycrg.acceptance.data_service.dto.TableCreateDto;
import ru.mycrg.acceptance.data_service.libraries.LibraryStepsDefinitions;
import ru.mycrg.acceptance.data_service.tables.TablesStepsDefinitions;
import ru.mycrg.acceptance.data_service.tasks.TaskStepDefinition;
import ru.mycrg.data_service_contract.dto.DatasetResourceQualifierDto;
import ru.mycrg.data_service_contract.dto.import_.kpt.ImportKptRequest;
import ru.mycrg.data_service_contract.dto.import_.kpt.KptImportValidationSettings;

import java.io.File;
import java.util.*;

import static org.junit.Assert.assertEquals;
import static ru.mycrg.acceptance.data_service.FilesStepDefinitions.currentFileId;
import static ru.mycrg.acceptance.data_service.datasets.DatasetsStepsDefinitions.currentDatasetDto;
import static ru.mycrg.acceptance.data_service.datasets.DatasetsStepsDefinitions.currentDatasetIdentifier;
import static ru.mycrg.acceptance.data_service.libraries.LibraryStepsDefinitions.currentDocumentId;
import static ru.mycrg.acceptance.data_service.libraries.LibraryStepsDefinitions.currentLibrary;
import static ru.mycrg.acceptance.data_service.tasks.TaskStepDefinition.currentTaskId;

public class XmlParsingStepDefinitions extends BaseStepsDefinitions {

    public static String fileName;
    public static String datasetId;
    public static String tableId;

    public static File file;

    private final DatasetsStepsDefinitions datasetsSteps = new DatasetsStepsDefinitions();
    private final TablesStepsDefinitions tablesSteps = new TablesStepsDefinitions();
    private final FilesStepDefinitions filesSteps = new FilesStepDefinitions();
    private final LibraryStepsDefinitions librariesSteps = new LibraryStepsDefinitions();
    private final TaskStepDefinition taskStepDefinition = new TaskStepDefinition();

    @Override
    public RequestSpecification getBaseRequest() {
        return super.getBaseRequest().basePath("/api/data");
    }

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie().basePath("/api/data");
    }

    @When("Пользователь делает запрос на импорт файла")
    public void importXml(DataTable dataTable) {
        fileName = dataTable.cell(0, 0);
        datasetId = dataTable.cell(0, 1);
        tableId = dataTable.cell(0, 2);

        file = TestFilesManager.getFile(fileName);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType("multipart/form-data").
                        multiPart("file", file).
                        multiPart("datasetId", datasetId).
                        multiPart("tableId", tableId)
                .when().
                        log().ifValidationFails().
                        post("/import/file");
    }

    @Given("Подготовлены данные для импорта КПТ")
    public void prepareImportKptData() {
        //Соль в том чтобы если данные уже созданы, то не пересоздавать их

        //Шаг 1. Создать набор данных
        String defaultDatasetTitle = "Набор данных теста импорта КПТ хэш 9267";
        if (!isDatasetExist(defaultDatasetTitle)) {
            currentDatasetDto = new DatasetCreateDto(defaultDatasetTitle);
            datasetsSteps.createDataset(currentDatasetDto);
        } else {
            currentDatasetIdentifier = response.jsonPath().getString("content[0].identifier");
        }

        //Шаг 2. Удалить все таблицы если они есть
        if (!isKptDatasetEmpty()) {
            List<Map<String, Object>> answer = response.jsonPath()
                                                       .getObject("content", new TypeRef<>() {
                                                       });

            List<String> tableIdentifiers = answer.stream()
                                                  .map(map -> String.valueOf(map.get("identifier")))
                                                  .toList();
            tableIdentifiers.forEach(tablesSteps::deleteTable);
        }

        //Шаг 3. Создать все таблицы KPT
        Set<String> schemaIds = new HashSet<>() {{
            add("borderwaterobj_polilyne_pro");
            add("zu_pro");
            add("oks_pro");
            add("oks_polyline_pro");
            add("borderwaterobj");
            add("kvartal_kpt");
            add("zouit_pro");
            add("oks_constructions_points");
            add("municipality_boundaries_egrn");
        }};

        schemaIds.forEach(schemaId -> tablesSteps.createTable(new TableCreateDto(schemaId,
                                                                                 schemaId,
                                                                                 schemaId,
                                                                                 "EPSG:3857",
                                                                                 schemaId)));

        //Шаг 4. Создать документ в библиотеке и прикрепить к ней файл
        filesSteps.createFile("90_00_000000.zip");

        currentLibrary = new LibraryModel("dl_data_kpt");

        String body = """
                {"title":"90_00_00000",
                "content_type_id":"Карточка"}
                """;
        librariesSteps.createDocumentAndWriteAsCurrent(body, currentLibrary.getTableName());

        String gsonBody = """
                {"title":"90_00_000000",
                "file":[{
                "id":"%s",
                "size": 4946,
                "title":"90_00_000000.zip"}]
                }
                """.formatted(String.valueOf(currentFileId));

        librariesSteps.updateDocument(currentDocumentId, gsonBody, currentLibrary.getTableName());

        //Шаг 5. Стартуем импорт
        ImportKptRequest importKptRequest = new ImportKptRequest();

        KptImportValidationSettings kpvs = new KptImportValidationSettings();
        kpvs.setValidateFreshness(true);
        kpvs.setValidateRecordsCount(true);
        importKptRequest.setValidationSettings(kpvs);

        List<DatasetResourceQualifierDto> tables = new ArrayList<>();
        schemaIds.forEach(schemaId -> {
            var drqd = new DatasetResourceQualifierDto();
            drqd.setDataset(currentDatasetIdentifier);
            drqd.setTable(schemaId);

            tables.add(drqd);
        });

        importKptRequest.setTables(tables);

        importKptRequest.setDocumentId((long) currentDocumentId);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(importKptRequest)).
                        contentType(ContentType.JSON)
                .when().log().all().
                       post("/import/kpt");

        currentTaskId = response.jsonPath().getInt("content.id");

        //Шаг 6. Дождаться момента когда задача будет успешно выполнена

        waitTillTaskIsDone(currentTaskId);
    }

    private void waitTillTaskIsDone(Integer currentTaskId) {
        int currentAttempt = 0;
        do {
            System.out.println("check task: " + currentTaskId + " attempt: " + currentAttempt);
            currentAttempt++;

            taskStepDefinition.getTaskByIdentifier(currentTaskId);

            if (response.statusCode() == org.apache.http.HttpStatus.SC_OK
                    && "DONE".equals(response.jsonPath().get("status"))) {
                return;
            }

            try {
                Thread.sleep(ru.mycrg.acceptance.data_service.ImportStepsDefinitions.RETRY_DELAY);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Waiting for task interrupted: " + currentTaskId, e);
            }
        } while (currentAttempt < ru.mycrg.acceptance.data_service.ImportStepsDefinitions.MAX_RETRY_ATTEMPT);

        throw new RuntimeException("Task not done: " + currentTaskId);
    }

    private boolean isDatasetExist(String datasetTitle) {
        datasetsSteps.getDatasetWithFilter(datasetTitle);

        return isTotalMoreThenZero();
    }

    private boolean isKptDatasetEmpty() {
        tablesSteps.getAllDatasetTables();

        return !isTotalMoreThenZero();
    }

    private static boolean isTotalMoreThenZero() {
        assertEquals(200, response.getStatusCode());
        int totalElements = response.jsonPath().getInt("page.totalElements");

        return totalElements > 0;
    }
}
