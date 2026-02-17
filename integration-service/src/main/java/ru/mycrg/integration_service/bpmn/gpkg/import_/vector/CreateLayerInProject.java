package ru.mycrg.integration_service.bpmn.gpkg.import_.vector;

import okhttp3.MediaType;
import okhttp3.Request;
import okhttp3.RequestBody;
import org.camunda.bpm.engine.delegate.BpmnError;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgLayer;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessReport;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgAckInfoBackwardEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.gis_service_contract.dto.LayerProjection;
import ru.mycrg.http_client.JsonConverter;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;
import ru.mycrg.integration_service.bpmn.BaseHttpService;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgProcessContext;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgReportManager;

import java.util.List;

import static ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus.*;
import static ru.mycrg.common_contracts.generated.gis_service.LayerType.VECTOR;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.integration_service.bpmn.BaseHttpService.crgHttpClient;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("createLayerInProject")
public class CreateLayerInProject implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(CreateLayerInProject.class);

    private final BaseHttpService baseHttpService;
    private final GpkgReportManager reportManager;

    public CreateLayerInProject(BaseHttpService baseHttpService,
                                GpkgReportManager reportManager) {
        this.baseHttpService = baseHttpService;
        this.reportManager = reportManager;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.debug("Класс {} начал работу", CreateLayerInProject.class.getSimpleName());
        int currentIteration = (int) delegateExecution.getVariable(IMPORT_GPKG_COUNT_HTTP_ERRORS);
        if (currentIteration >= 4) {
            log.warn("Превышено максимальное количество попыток создания слоя ({})", currentIteration);

            return;
        }

        ImportGpkgEvent event = (ImportGpkgEvent) delegateExecution.getVariable(IMPORT_GPKG_EVENT);
        long projectId = event.getProjectId();
        GpkgProcessContext rabbitDto = new GpkgProcessContext(projectId,
                                                              event.getDbName(),
                                                              TASK_DONE);

        GpkgProcessReport importReport = (GpkgProcessReport) delegateExecution.getVariable(
                IMPORT_GPKG_EVENT_REPORT);

        ImportGpkgAckInfoBackwardEvent backward = (ImportGpkgAckInfoBackwardEvent)
                delegateExecution.getVariable(IMPORT_GPKG_BACKWARD_EXTRACTED_DATA);

        //Создать слои
        List<LayerProjection> layerForCreate = backward.getLayerProjections();

        long layerGroupId = (long) delegateExecution.getVariable(IMPORT_GPKG_CREATED_LAYER_GROUP_ID);
        String createdTableName = (String) delegateExecution.getVariable(IMPORT_GPKG_CREATED_TABLE_NAME);
        for (LayerProjection layerProjection: layerForCreate) {
            GpkgLayer curLayer = new GpkgLayer();
            curLayer.setStatus(ACTIVE);
            curLayer.setType(VECTOR);
            curLayer.setTitle(layerProjection.getTitle());
            curLayer.setStyleName(layerProjection.getStyleName());

            layerProjection.setParentId(layerGroupId);
            layerProjection.setProjectId(projectId);

            layerProjection.setDataset(event.getTargetDatasetIdentifier());
            layerProjection.setDataStoreName("scratch_database_" + event.getDbName().replace("database_", ""));
            layerProjection.setResourceId(createdTableName);

            createLayer(event.getToken(), projectId, layerProjection, curLayer, delegateExecution, currentIteration);

            reportManager.createLayerReport(rabbitDto, importReport, curLayer);
        }

        // Сбрасываем счетчик итераций при успешном выполнении
        delegateExecution.setVariable(IMPORT_GPKG_COUNT_HTTP_ERRORS, 0);
    }

    private void createLayer(String token,
                             long projectId,
                             LayerProjection layerForCreate,
                             GpkgLayer curLayer,
                             DelegateExecution delegateExecution,
                             int currentIteration) {
        String layerPublishUrl = baseHttpService.getGisServiceUrl() + "/projects/" + projectId + "/layers";

        RequestBody requestBody = RequestBody.create(
                MediaType.parse("application/json"),
                JsonConverter.toJson(layerForCreate)
        );

        Request request = new Request.Builder()
                .url(layerPublishUrl)
                .post(requestBody)
                .addHeader("Content-Type", "application/json")
                .addHeader("Authorization", "Bearer " + token)
                .build();

        try {
            ResponseModel<String> response = crgHttpClient.handleRequestAsString(request);
            if (response.isSuccessful()) {
                log.debug("Слой успешно создан: код={}", response.getCode());
                curLayer.setStatus(COMPLETED);
            } else {
                curLayer.setStatus(ERROR);
                int statusCode = response.getCode();
                String msg = String.format("При создании слоя в проекте, gis-service вернул статус %d", statusCode);
                curLayer.getMessages().add(msg);

                log.warn(msg);

                // Временные ошибки - повторяем
                if (statusCode == 503 || statusCode == 502 || statusCode == 504 || statusCode == 429) {
                    delegateExecution.setVariable(IMPORT_GPKG_COUNT_HTTP_ERRORS, currentIteration + 1);

                    throw new BpmnError("responseTimeOut");
                }
            }
        } catch (HttpClientException e) {
            curLayer.setStatus(ERROR);
            log.error("Ошибка при создании слоя: {}", e.getMessage(), e);
            delegateExecution.setVariable(IMPORT_GPKG_COUNT_HTTP_ERRORS, currentIteration + 1);

            throw new BpmnError("responseTimeOut");
        } catch (Exception e) {
            curLayer.setStatus(ERROR);
            log.error("Неожиданная ошибка при создании слоя: {}", e.getMessage(), e);
            delegateExecution.setVariable(IMPORT_GPKG_COUNT_HTTP_ERRORS, currentIteration + 1);

            throw new BpmnError("responseTimeOut");
        }
    }
}
