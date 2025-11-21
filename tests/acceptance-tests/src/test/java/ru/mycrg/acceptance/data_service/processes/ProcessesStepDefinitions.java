package ru.mycrg.acceptance.data_service.processes;

import io.cucumber.java.en.And;
import io.cucumber.java.en.When;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.auth_service.AuthorizationBase;
import ru.mycrg.acceptance.data_service.TestFilesManager;
import ru.mycrg.acceptance.data_service.dto.FileDescriptionModel;
import ru.mycrg.common_contracts.generated.gpkg.GkpgExportDetailsModel;
import ru.mycrg.data_service_contract.dto.ExportRequestModel;
import ru.mycrg.data_service_contract.dto.ExportResourceModel;
import ru.mycrg.data_service_contract.dto.gpkg.GpkgPayload;
import ru.mycrg.data_service_contract.enums.ProcessType;

import java.io.File;
import java.time.LocalTime;
import java.util.*;
import java.util.regex.Pattern;

import static io.restassured.http.ContentType.JSON;
import static java.lang.Thread.sleep;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static ru.mycrg.acceptance.auth_service.OrganizationStepsDefinitions.MAX_RETRY_ATTEMPT;
import static ru.mycrg.acceptance.data_service.FilesStepDefinitions.*;
import static ru.mycrg.acceptance.data_service.datasets.DatasetsStepsDefinitions.currentDatasetIdentifier;
import static ru.mycrg.acceptance.data_service.tables.TablesStepsDefinitions.anotherTableName;
import static ru.mycrg.acceptance.data_service.tables.TablesStepsDefinitions.currentTableName;
import static ru.mycrg.acceptance.gis_service.ProjectStepsDefinitions.projectId;
import static ru.mycrg.data_service_contract.dto.gpkg.GpkgExportTypes.*;

public class ProcessesStepDefinitions extends BaseStepsDefinitions {

    public static Integer currentProcessId;
    private final AuthorizationBase authorizationBase = new AuthorizationBase();

    @Override
    public RequestSpecification getBaseRequest() {
        return super.getBaseRequest().basePath("/api/data/processes");
    }

    @Override
    public RequestSpecification getBaseRequestWithCurrentCookie() {
        return super.getBaseRequestWithCurrentCookie().basePath("/api/data/processes");
    }

    @When("пользователь публикует текущий GML")
    public void tryPlacementGmlAsProcess() {
        GmlPlacementModel gmlPlacementModel = new GmlPlacementModel();
        gmlPlacementModel.setFileId(currentFileId);
        gmlPlacementModel.setWsUiId("Fiat lux");
        gmlPlacementModel.setProjectId(Long.valueOf(projectId));

        ProcessableModel processableModel = new ProcessableModel();
        processableModel.setType("IMPORT");
        processableModel.setPayload(gmlPlacementModel);

        initProcess(processableModel);

        currentProcessId = extractId((String) response.jsonPath().get("_links.self.href"));
    }

    @When("пользователь экспортирует GML")
    public void exportGml() {
        String dataset = response.jsonPath().get("details.datasetIdentifier");
        String table = response.jsonPath().getString("details.importLayerReports[0].tableIdentifier");
        String wsUiId = generateString("STRING_6");

        String body = String.format("{\"wsUiId\":\"%s\"," +
                                            "\"format\":\"GML\"," +
                                            "\"resources\":[{\"dataset\":\"%s\",\"table\":\"%s\"}]," +
                                            "\"docSchema\":\"Doc.20201010000\"," +
                                            "\"epsg\":\"EPSG:3857\"," +
                                            "\"invertedCoordinates\":false}",
                                    wsUiId, dataset, table);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(body).
                        contentType(JSON).
                        basePath("")
                .when().
                        log().ifValidationFails().
                        post("/api/data/export");

        currentProcessId = response.jsonPath().get("id");
    }

    @And("размер полученного файла равен {int}")
    public void sizeOfFile(int size) {
        getCurrentProcess();
        String path = response.jsonPath().get("details");
        String fileName = path.substring(path.lastIndexOf('/') + 1);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        basePath("")
                .when().
                        log().ifValidationFails().
                        get("/api/data/export/" + fileName);

        assertEquals(size, response.asByteArray().length);
    }

    @And("размер полученного gpkg {int}")
    public void sizeOfGpkgFile(int size) {
        getCurrentProcess();
        GkpgExportDetailsModel details = response.jsonPath().getObject("details", GkpgExportDetailsModel.class);
        String fileName = details.getPathToGpkgFile();
        fileName = fileName.substring(fileName.lastIndexOf('/') + 1);

        response = getBaseRequestWithCurrentCookie()
                .given().
                        basePath("")
                .when().
                        log().ifValidationFails().
                        get("/api/data/export/" + fileName);

        assertEquals(size, response.asByteArray().length);
    }

    @When("Пользователь публикует файл {string}")
    public void tryPlacementFile(String fileName) {
        placeFileInCurrentProject(getFileByTitle(fileName).getId());
    }

    @When("Файл {string} опубликован в текущем проекте")
    public void tryPlacementFileInCurrentProject(String fileName) {
        placeFileInCurrentProject(getFileByTitle(fileName).getId());
    }

    @When("Пользователь импортирует геометрию из shape файла в существующий слой {string}")
    public void tryImportShapeAsProcessAsUser(String filename) {
        authorizationBase.loginAsCurrentUser();

        GeometryShapePlacementModel shapePlacementModel = new GeometryShapePlacementModel();
        shapePlacementModel.setDatasetId(currentDatasetIdentifier);
        shapePlacementModel.setTableName(anotherTableName);
        shapePlacementModel.setFileType("SHP");

        placeGeometryFromShape(shapePlacementModel, filename);
    }

    @When("Владелец импортирует shape файл {string} в существующий слой")
    public void tryImportShapeAsProcessAsOwner(String filename) {
        authorizationBase.loginAsOwner();

        GeometryShapePlacementModel shapePlacementModel = new GeometryShapePlacementModel();
        shapePlacementModel.setDatasetId(currentDatasetIdentifier);
        shapePlacementModel.setTableName(currentTableName);
        shapePlacementModel.setFileType("SHP");

        placeGeometryFromShape(shapePlacementModel, filename);
    }

    @When("Владелец импортирует скаченный файл в существующий слой")
    public void tryImportContextFileShapeAsProcessAsOwner() {
        authorizationBase.loginAsOwner();

        GeometryShapePlacementModel shapePlacementModel = new GeometryShapePlacementModel();
        shapePlacementModel.setDatasetId(currentDatasetIdentifier);
        shapePlacementModel.setTableName(currentTableName);
        shapePlacementModel.setFileType("SHP");

        ProcessableModel processableModel = new ProcessableModel();
        processableModel.setType("IMPORT_GEOMETRY");
        processableModel.setPayload(shapePlacementModel);

        initProcessWithFile(processableModel, contextFileName);

        currentProcessId = extractId((String) response.jsonPath().get("_links.self.href"));
    }

    @When("администратор импортирует геометрию из shape файла, имеющую \"EPSG:7829\" в существующий слой")
    public void tryImportGeometryShapeWithEPSG_7829AsProcessAsAdmin() {
        authorizationBase.loginAsOwner();

        GeometryShapePlacementModel shapePlacementModel = new GeometryShapePlacementModel();
        shapePlacementModel.setDatasetId(currentDatasetIdentifier);
        shapePlacementModel.setTableName(anotherTableName);
        shapePlacementModel.setFileType("SHP");

        placeGeometryFromShape(shapePlacementModel, "z_5_functionalzone.zip");
    }

    @When("процесс завершается успешно")
    public void waitUntilCurrentProcessIsDone() {
        waitUntilProcessCompleteWithStatus(currentProcessId, "DONE");
    }

    @When("процесс завершается с ошибками")
    public void waitUntilCurrentProcessIsDoneWithWarnings() {
        waitUntilProcessCompleteWithStatus(currentProcessId, "DONE_WITH_WARNINGS");
    }

    @When("процесс завершается с ошибкой")
    public void waitUntilCurrentProcessIsCompleteWithError() {
        waitUntilProcessCompleteWithStatus(currentProcessId, "ERROR");
    }

    // TODO: Нахрена его еще раз опрашивать если мы и так только что его бомбили запросами и ждали изменения статуса?
    //  Да еще и ждем секунду?
    @When("пользователь опрашивает процесс")
    public void gineMeThisProcess() throws InterruptedException {
        sleep(1000);
        getCurrentProcess();
    }

    @When("в ответе содержится фраза {string}")
    public void checkProcessAnswer(String pattern) {
        System.out.println(pattern);
        String responseText = response.prettyPrint();

        // Проверяем, содержит ли паттерн регулярные выражения
        if (pattern.contains("\\d+") || pattern.contains(".*") || pattern.contains("\\w+")) {
            // Используем регулярные выражения
            Pattern regex = Pattern.compile(pattern);
            assertTrue("Response does not match pattern: " + pattern,
                       regex.matcher(responseText).find());
        } else {
            // Используем простой поиск подстроки как раньше
            assertTrue("Response does not contain: " + pattern,
                       responseText.contains(pattern));
        }
    }

    @When("Текущий пользователь экспортирует текущий проект в GeoPackage")
    public void exportProjectInGeoPackage() {
        ExportRequestModel exportProcessModel = new ExportRequestModel();

        GpkgPayload payload = new GpkgPayload();

        Long projectId = response.jsonPath().getLong("id");
        List<Long> layerIds = new ArrayList<>();
        layerIds.add(projectId);

        payload.setType(PROJECT);
        payload.setPayload(layerIds);

        exportProcessModel.setFormat("GPKG");
        exportProcessModel.setPayload(payload);

        executeExportRequest(exportProcessModel);
    }

    @When("Текущий пользователь экспортирует текущий слой в GeoPackage")
    public void exportLayerInGeoPackage() {
        int currentLayerId = Collections.max(layerPool.keySet());

        List<Long> layerIds = new ArrayList<>();
        layerIds.add((long) currentLayerId);

        GpkgPayload payload = new GpkgPayload();
        payload.setType(LAYER);
        payload.setPayload(layerIds);

        ExportRequestModel exportProcessModel = new ExportRequestModel();
        exportProcessModel.setFormat("GPKG");
        exportProcessModel.setPayload(payload);

        executeExportRequest(exportProcessModel);
    }

    @When("Текущий пользователь экспортирует текущую таблицу в GeoPackage")
    public void exportTableInGeoPackage() {
        ExportRequestModel exportProcessModel = new ExportRequestModel();

        GpkgPayload payload = new GpkgPayload();

        List<ExportResourceModel> exportResourceModels = new ArrayList<>();
        exportResourceModels.add(new ExportResourceModel(currentDatasetIdentifier, currentTableName));

        payload.setType(TABLE);
        payload.setPayload(exportResourceModels);

        exportProcessModel.setFormat("GPKG");
        exportProcessModel.setPayload(payload);

        executeExportRequest(exportProcessModel);
    }

    @When("Текущий пользователь экспортирует последние два слоя в GeoPackage")
    public void exportLastTwoLayersInGeoPackage() {
        List<Long> layerIds = new ArrayList<>();
        int currentLayerId = Collections.max(layerPool.keySet());

        layerIds.add((long) currentLayerId);
        layerIds.add((long) currentLayerId - 1);

        GpkgPayload payload = new GpkgPayload();
        payload.setType(LAYER);
        payload.setPayload(layerIds);

        ExportRequestModel exportProcessModel = new ExportRequestModel();
        exportProcessModel.setFormat("GPKG");
        exportProcessModel.setPayload(payload);

        executeExportRequest(exportProcessModel);
    }

    @When("Текущий пользователь экспортирует несуществующие слои в GeoPackage")
    public void exportGhostLayersInGeoPackage() {
        List<Long> layerIds = new ArrayList<>();
        layerIds.add(100_000_000L);

        GpkgPayload payload = new GpkgPayload();
        payload.setType(LAYER);
        payload.setPayload(layerIds);

        ExportRequestModel exportProcessModel = new ExportRequestModel();
        exportProcessModel.setFormat("GPKG");
        exportProcessModel.setPayload(payload);

        executeExportRequest(exportProcessModel);
    }

    @When("Текущий пользователь импортирует несуществующий GeoPackage в текущий проект")
    public void importNonExistentGeoPackageInCurrentProject() {
        ProcessableModel processableModel = new ProcessableModel();
        processableModel.setType(String.valueOf(ProcessType.IMPORT));
        Map<String, Object> payload = new HashMap<>();
        payload.put("fileId", UUID.randomUUID().toString());
        payload.put("filePath", "/trasher");
        payload.put("projectId", projectId);
        processableModel.setPayload(payload);

        initProcess(processableModel);

        if (response.getStatusCode() != 400 && response.getStatusCode() != 500) {
            currentProcessId = extractId((String) response.jsonPath().get("_links.self.href"));
        }
    }

    @When("Текущий пользователь импортирует GeoPackage в текущий проект")
    public void importGeoPackageInCurrentProject() {
        FileDescriptionModel fdm = currentFiles.get(currentFiles.size() - 1);
        UUID fileId = fdm.getId();

        ProcessableModel processableModel = new ProcessableModel();
        processableModel.setType(String.valueOf(ProcessType.IMPORT));
        Map<String, Object> payload = new HashMap<>();
        payload.put("fileId", String.valueOf(fileId));
        payload.put("filePath", "need/only/toDataset/name.gpkg");
        payload.put("projectId", projectId);
        processableModel.setPayload(payload);

        initProcess(processableModel);

        if (response.getStatusCode() != 400 && response.getStatusCode() != 500) {
            currentProcessId = extractId((String) response.jsonPath().get("_links.self.href"));
        }
    }

    public void waitUntilProcessCompleteWithStatus(Integer processId, String status) {
        try {
            int currentAttempt = 0;
            do {
                currentAttempt++;
                System.out.printf("Time: '%s' Attempt: '%d'. Check process with id: '%d' is %s %n",
                                  LocalTime.now(), currentAttempt, processId, status);

                getProcess(processId);

                if (status.equals(response.jsonPath().get("status"))) {
                    return;
                }

                sleep(1000);
            } while (currentAttempt < MAX_RETRY_ATTEMPT);

            throw new RuntimeException("Process not DONE after " + MAX_RETRY_ATTEMPT + " attempts !");
        } catch (InterruptedException e) {
            throw new RuntimeException("Process not DONE: " + e.getMessage());
        }
    }

    private void placeFile(DxfPlacementModel dxfPlacementModel) {
        ProcessableModel processableModel = new ProcessableModel();
        processableModel.setType("IMPORT");
        processableModel.setPayload(dxfPlacementModel);

        initProcess(processableModel);

        currentProcessId = extractId((String) response.jsonPath().get("_links.self.href"));
    }

    private void placeGeometryFromShape(GeometryShapePlacementModel shapePlacementModel, String filename) {
        ProcessableModel processableModel = new ProcessableModel();
        processableModel.setType("IMPORT_GEOMETRY");
        processableModel.setPayload(shapePlacementModel);

        initProcessWithFile(processableModel, filename);

        currentProcessId = extractId((String) response.jsonPath().get("_links.self.href"));
    }

    private void getProcess(Integer processId) {
        response = getBaseRequestWithCurrentCookie()
                .when().
                        get("/" + processId);
    }

    public void getCurrentProcess() {
        if (currentProcessId == null) {
            throw new IllegalStateException("Идентификатор текущего процесса не задан");
        }

        getProcess(currentProcessId);
    }

    public static FileDescriptionModel getFileByTitle(String title) {
        return currentFiles
                .stream()
                .filter(file -> file.getTitle().equalsIgnoreCase(title))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Среди текущих файлов не найден искомый: " + title));
    }

    private void initProcess(ProcessableModel payload) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(JSON).
                        body(gson.toJson(payload))
                .when().
                        post();
    }

    private void initProcessWithFile(ProcessableModel processableModel, String fileName) {
        File file = TestFilesManager.getFile(fileName);
        if (!file.exists()) {
            throw new IllegalStateException("Not exist test resource: " + fileName);
        }

        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType("multipart/form-data").
                        multiPart("file", file).
                        multiPart("processModelJson", gson.toJson(processableModel))
                .when().
                        post("/file");
    }

    private void placeFileInCurrentProject(UUID fileId) {
        DxfPlacementModel placementModel = new DxfPlacementModel();
        placementModel.setWsUiId("Fiat lux");
        placementModel.setProjectId(Long.valueOf(projectId));
        placementModel.setFileId(fileId);

        placeFile(placementModel);
    }

    private void executeExportRequest(ExportRequestModel exportProcessModel) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        body(gson.toJson(exportProcessModel)).
                        contentType(JSON).
                        basePath("")
                .when().
                        log().ifValidationFails().
                        post("/api/data/export/");

        currentProcessId = response.jsonPath().get("id");
    }
}
