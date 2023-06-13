package ru.mycrg.acceptance.data_service.processes;

import io.cucumber.java.en.When;
import io.restassured.specification.RequestSpecification;
import ru.mycrg.acceptance.BaseStepsDefinitions;
import ru.mycrg.acceptance.auth_service.AuthorizationBase;

import java.io.File;
import java.time.LocalTime;

import static io.restassured.http.ContentType.JSON;
import static java.lang.Thread.sleep;
import static ru.mycrg.acceptance.auth_service.OrganizationStepsDefinitions.MAX_RETRY_ATTEMPT;
import static ru.mycrg.acceptance.data_service.FilesStepDefinitions.currentFileId;
import static ru.mycrg.acceptance.data_service.datasets.DatasetsStepsDefinitions.currentDatasetIdentifier;
import static ru.mycrg.acceptance.data_service.tables.TablesStepsDefinitions.anotherTableName;
import static ru.mycrg.acceptance.gis_service.ProjectStepsDefinitions.projectId;

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

    @When("пользователь публикует GML")
    public void tryPlacementGmlAsProcess() {
        GmlPlacementModel gmlPlacementModel = new GmlPlacementModel();
        gmlPlacementModel.setFileId(currentFileId);
        gmlPlacementModel.setWsUiId("Fiat lux");
        gmlPlacementModel.setProjectId(Long.valueOf(projectId));

        ProcessableModel processableModel = new ProcessableModel();
        processableModel.setType("IMPORT");
        processableModel.setPayload(gmlPlacementModel);

        initProcess(processableModel);

        currentProcessId = extractId(response.jsonPath().get("_links.self.href"));
    }

    @When("Пользователь публикует DXF")
    public void tryPlacementDxfAsProcess() {
        DxfPlacementModel dxfPlacementModel = new DxfPlacementModel();
        dxfPlacementModel.setFileId(currentFileId);
        dxfPlacementModel.setWsUiId("Fiat lux");
        dxfPlacementModel.setProjectId(Long.valueOf(projectId));

        placeFile(dxfPlacementModel);
    }

    @When("Пользователь импортирует геометрию из shape файла в существующий слой")
    public void tryImportGeometryShapeAsProcessAsUser() {
        authorizationBase.loginAsCurrentUser();

        GeometryShapePlacementModel shapePlacementModel = new GeometryShapePlacementModel();
        shapePlacementModel.setDatasetId(currentDatasetIdentifier);
        shapePlacementModel.setTableName(anotherTableName);
        shapePlacementModel.setFileType("GEOMETRY_FROM_SHAPE");

        placeGeometryFromShape(shapePlacementModel, "transplogisticobj_point.zip");
    }

    @When("Администратор импортирует геометрию из shape файла в существующий слой")
    public void tryImportGeometryShapeAsProcessAsAdmin() {
        authorizationBase.loginAsOwner();

        GeometryShapePlacementModel shapePlacementModel = new GeometryShapePlacementModel();
        shapePlacementModel.setDatasetId(currentDatasetIdentifier);
        shapePlacementModel.setTableName(anotherTableName);
        shapePlacementModel.setFileType("GEOMETRY_FROM_SHAPE");

        placeGeometryFromShape(shapePlacementModel, "z_5_functionalzone.zip");
    }
    @When("администратор импортирует геометрию из shape файла, имеющую \"EPSG:7829\" в существующий слой")
    public void tryImportGeometryShapeWithEPSG_7829AsProcessAsAdmin() {
        authorizationBase.loginAsOwner();

        GeometryShapePlacementModel shapePlacementModel = new GeometryShapePlacementModel();
        shapePlacementModel.setDatasetId(currentDatasetIdentifier);
        shapePlacementModel.setTableName(anotherTableName);
        shapePlacementModel.setFileType("GEOMETRY_FROM_SHAPE");

        placeGeometryFromShape(shapePlacementModel, "z_5_functionalzone.zip");
    }

    @When("процесс завершается успешно")
    public void waitUntilCurrentProcessIsDone() {
        waitUntilProcessCompleteWithStatus(currentProcessId, "DONE");
    }

    @When("Процесс завершается с ошибкой")
    public void waitUntilCurrentProcessIsCompleteWithError() {
        waitUntilProcessCompleteWithStatus(currentProcessId, "ERROR");
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

        currentProcessId = extractId(response.jsonPath().get("_links.self.href"));
    }

    private void placeGeometryFromShape(GeometryShapePlacementModel shapePlacementModel, String filename) {
        ProcessableModel processableModel = new ProcessableModel();
        processableModel.setType("IMPORT_GEOMETRY");
        processableModel.setPayload(shapePlacementModel);

        initProcessWithFile(processableModel, filename);

        currentProcessId = extractId(response.jsonPath().get("_links.self.href"));
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

    private void initProcess(ProcessableModel payload) {
        response = getBaseRequestWithCurrentCookie()
                .given().
                        contentType(JSON).
                        body(gson.toJson(payload))
                .when().
                        post();
    }

    private void initProcessWithFile(ProcessableModel processableModel, String fileName) {
        File file = new File("src/test/resources/ru/mycrg/acceptance/resources/" + fileName);
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
}
