package ru.mycrg.acceptance.data_service.kpt_import;

import io.restassured.common.mapper.TypeRef;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.data_service.FilesStepDefinitions;
import ru.mycrg.acceptance.data_service.ImportStepsDefinitions;
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

import java.util.List;
import java.util.Map;

import static org.apache.http.HttpStatus.SC_OK;
import static org.junit.Assert.assertEquals;
import static ru.mycrg.acceptance.data_service.FilesStepDefinitions.currentFileId;
import static ru.mycrg.acceptance.data_service.datasets.DatasetsStepsDefinitions.currentDatasetDto;
import static ru.mycrg.acceptance.data_service.datasets.DatasetsStepsDefinitions.currentDatasetIdentifier;
import static ru.mycrg.acceptance.data_service.libraries.LibraryStepsDefinitions.currentDocumentId;
import static ru.mycrg.acceptance.data_service.libraries.LibraryStepsDefinitions.currentLibrary;
import static ru.mycrg.acceptance.data_service.tasks.TaskStepDefinition.currentTaskId;

public class ImportKptDataCreator extends BaseStepsDefinitions {

    private static final String DATASET_TITLE = "Набор данных теста импорта КПТ хэш 9267";
    private static final String KPT_FILE_NAME = "90_00_000000.zip";
    private static final String KPT_DOCUMENT_TITLE = "90_00_000000";
    private static final String KPT_LIBRARY_TABLE_NAME = "dl_data_kpt";
    private static final String KPT_TABLE_CRS = "EPSG:3857";
    private static final List<String> KPT_SCHEMA_IDS = List.of(
            "borderwaterobj_polilyne_pro",
            "zu_pro",
            "oks_pro",
            "oks_polyline_pro",
            "borderwaterobj",
            "kvartal_kpt",
            "zouit_pro",
            "natural_areas_pro",
            "ter_zone_pro",
            "oks_constructions_points",
            "municipality_boundaries_egrn"
    );

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

    public void prepareDataset() {
        if (isDatasetExist()) {
            currentDatasetIdentifier = response.jsonPath().getString("content[0].identifier");
            return;
        }

        currentDatasetDto = new DatasetCreateDto(DATASET_TITLE);
        datasetsSteps.createDataset(currentDatasetDto);
    }

    public void recreateTables() {
        deleteExistingTables();
        createKptTables();
    }

    public void prepareDocumentWithKptFile() {
        filesSteps.createFile(KPT_FILE_NAME);

        currentLibrary = new LibraryModel(KPT_LIBRARY_TABLE_NAME);
        librariesSteps.createDocumentAndWriteAsCurrent(kptDocumentCreateBody(), currentLibrary.getTableName());
        librariesSteps.updateDocument(currentDocumentId, kptDocumentUpdateBody(), currentLibrary.getTableName());
    }

    public void startImport() {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(importKptRequest())).
                        contentType(ContentType.JSON)
                .when().log().all().
                       post("/import/kpt");

        currentTaskId = response.jsonPath().getInt("content.id");
    }

    public void waitTillImportTaskIsDone() {
        int currentAttempt = 0;
        do {
            System.out.println("check task: " + currentTaskId + " attempt: " + currentAttempt);
            currentAttempt++;

            taskStepDefinition.getTaskByIdentifier(currentTaskId);

            if (response.statusCode() == SC_OK && "DONE".equals(response.jsonPath().get("status"))) {
                return;
            }

            try {
                Thread.sleep(5);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Waiting for task interrupted: " + currentTaskId, e);
            }
        } while (currentAttempt < ImportStepsDefinitions.MAX_RETRY_ATTEMPT);

        throw new RuntimeException("Task not done: " + currentTaskId);
    }

    private void deleteExistingTables() {
        if (isKptDatasetEmpty()) {
            return;
        }

        kptDatasetTableIdentifiers().forEach(tablesSteps::deleteTable);
    }

    private void createKptTables() {
        KPT_SCHEMA_IDS.forEach(schemaId -> tablesSteps.createTable(new TableCreateDto(schemaId,
                                                                                      schemaId,
                                                                                      schemaId,
                                                                                      KPT_TABLE_CRS,
                                                                                      schemaId)));
    }

    private ImportKptRequest importKptRequest() {
        ImportKptRequest importKptRequest = new ImportKptRequest();
        importKptRequest.setValidationSettings(kptImportValidationSettings());
        importKptRequest.setTables(importTables());
        importKptRequest.setDocumentId((long) currentDocumentId);

        return importKptRequest;
    }

    private KptImportValidationSettings kptImportValidationSettings() {
        KptImportValidationSettings validationSettings = new KptImportValidationSettings();
        validationSettings.setValidateFreshness(true);
        validationSettings.setValidateRecordsCount(true);

        return validationSettings;
    }

    private List<DatasetResourceQualifierDto> importTables() {
        return KPT_SCHEMA_IDS.stream()
                             .map(this::importTable)
                             .toList();
    }

    private DatasetResourceQualifierDto importTable(String schemaId) {
        DatasetResourceQualifierDto table = new DatasetResourceQualifierDto();
        table.setDataset(currentDatasetIdentifier);
        table.setTable(schemaId);

        return table;
    }

    private List<String> kptDatasetTableIdentifiers() {
        List<Map<String, Object>> tables = response.jsonPath()
                                                   .getObject("content", new TypeRef<>() {
                                                   });

        return tables.stream()
                     .map(table -> String.valueOf(table.get("identifier")))
                     .toList();
    }

    private String kptDocumentCreateBody() {
        return """
                {"title":"90_00_00000",
                "content_type_id":"Карточка"}
                """;
    }

    private String kptDocumentUpdateBody() {
        return """
                {"title":"%s",
                "file":[{
                "id":"%s",
                "size": 4946,
                "title":"%s"}]
                }
                """.formatted(KPT_DOCUMENT_TITLE, currentFileId, KPT_FILE_NAME);
    }

    private boolean isDatasetExist() {
        datasetsSteps.getDatasetWithFilter(ImportKptDataCreator.DATASET_TITLE);

        return isTotalMoreThenZero();
    }

    private boolean isKptDatasetEmpty() {
        tablesSteps.getAllDatasetTables();

        return !isTotalMoreThenZero();
    }

    private static boolean isTotalMoreThenZero() {
        assertEquals(SC_OK, response.getStatusCode());
        int totalElements = response.jsonPath().getInt("page.totalElements");

        return totalElements > 0;
    }
}
