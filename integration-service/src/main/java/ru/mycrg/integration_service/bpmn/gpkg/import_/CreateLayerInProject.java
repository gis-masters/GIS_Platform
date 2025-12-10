package ru.mycrg.integration_service.bpmn.gpkg.import_;

import okhttp3.MediaType;
import okhttp3.Request;
import okhttp3.RequestBody;
import org.camunda.bpm.engine.delegate.BpmnError;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgImportReport;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgImportedLayer;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgPayloadData;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgTablesData;
import ru.mycrg.data_service_contract.dto.PatchProcess;
import ru.mycrg.data_service_contract.queue.request.UpdateProcessEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgAckInfoBackwardEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.gis_service_contract.dto.LayerProjection;
import ru.mycrg.http_client.JsonConverter;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;
import ru.mycrg.integration_service.bpmn.BaseHttpService;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.List;

import static ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus.ACTIVE;
import static ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus.COMPLETED;
import static ru.mycrg.common_contracts.generated.gis_service.LayerType.VECTOR;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.integration_service.bpmn.BaseHttpService.crgHttpClient;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;
import static ru.mycrg.integration_service.bpmn.VariableUtil.getVariable;

/**
 * Класс для импорта GPKG. (Восьмой в цепочке)
 *
 * <h3>Репорт на этом этапе:</h3>
 * <ul>
 *   <li>Количество и состав таблиц которые внутри gpkg</li>
 *   <li>Есть описание сущности "Проект"</li>
 *   <li>С каждым тиком цикла будет прибавляться информация о таблицах, слоях, стилях</li>
 * </ul>
 */

@Service("createLayerInProject")
public class CreateLayerInProject implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(CreateLayerInProject.class);

    private final BaseHttpService baseHttpService;
    private final IMessageBusProducer messageBus;

    public CreateLayerInProject(BaseHttpService baseHttpService, IMessageBusProducer messageBus) {
        this.baseHttpService = baseHttpService;
        this.messageBus = messageBus;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        int currentIteration = (int) getVariable(delegateExecution, ITERATION_COUNTER_VAR_NAME, getClass().getName());
        if (currentIteration >= 4) {
            log.warn("Превышено максимальное количество попыток создания слоя ({})", currentIteration);
        }

        log.debug("Класс {} начал работу", CreateLayerInProject.class.getSimpleName());

        long layerGroupId = (long) delegateExecution.getVariable(CREATED_LAYER_GROUP_ID);

        ImportGpkgEvent event = (ImportGpkgEvent) delegateExecution.getVariable(EVENT_VAR_NAME);

        long projectId = event.getProjectId();

        GpkgImportReport importReport = (GpkgImportReport) delegateExecution.getVariable(
                EVENT_IMPORT_GPKG_REPORT_NAME);
        GpkgPayloadData prevImportPayload = importReport.getPayload();
        List<GpkgImportedLayer> prevLayers = prevImportPayload.getLayers();

        GpkgTablesData currentTable = (GpkgTablesData) delegateExecution.getVariable(ENTITY_ID_VAR_NAME);
        ImportGpkgAckInfoBackwardEvent backward = (ImportGpkgAckInfoBackwardEvent)
                delegateExecution.getVariable(EVENT_IMPORT_GPKG_BACKWARD_DATA_NAME);

        //Создать слои
        List<LayerProjection> layerForCreate = backward.getLayerProjections();

        for (LayerProjection layerProjection: layerForCreate) {
            GpkgImportedLayer curLayer = new GpkgImportedLayer();
            curLayer.setStatus(ACTIVE);
            curLayer.setType(VECTOR);
            curLayer.setTitle(layerProjection.getTitle());
            curLayer.setStyleName(layerProjection.getStyleName());

            layerProjection.setParentId(layerGroupId);
            layerProjection.setProjectId(projectId);

            layerProjection.setDataset(event.getTargetDatasetIdentifier());
            layerProjection.setDataStoreName("scratch_database_" + event.getDbName().replace("database_", ""));
            layerProjection.setResourceId(currentTable.getTableNewIdentifier());

            createLayer(event.getToken(), projectId, layerProjection, curLayer, delegateExecution,
                        currentIteration);

            prevLayers.add(curLayer);
        }

        prevImportPayload.setLayers(prevLayers);
        // Потом прыгнуть на следующий шаг передав репорт (автоматом прыгнем)
        importReport.setPayload(prevImportPayload);

        String businessKey = (String) delegateExecution.getVariable(BUSINESS_KEY_VAR_NAME);
        PatchProcess newDetails = new PatchProcess(TASK_DONE, importReport);

        messageBus.produce(new UpdateProcessEvent(event.getProcessId(),
                                                  businessKey,
                                                  event.getDbName(),
                                                  newDetails));

        // Сбрасываем счетчик итераций при успешном выполнении
        delegateExecution.setVariable(ITERATION_COUNTER_VAR_NAME, 0);
    }

    private void createLayer(String token,
                             long projectId,
                             LayerProjection layerForCreate,
                             GpkgImportedLayer curLayer,
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
                int statusCode = response.getCode();
                log.warn("GIS сервис вернул неуспешный статус: {} для создания слоя", statusCode);

                // Временные ошибки - повторяем
                if (statusCode == 503 || statusCode == 502 || statusCode == 504 || statusCode == 429) {
                    delegateExecution.setVariable(ITERATION_COUNTER_VAR_NAME, currentIteration + 1);

                    throw new BpmnError("responseTimeOut");
                }
                // Остальные ошибки - не критичны, продолжаем
            }
        } catch (HttpClientException e) {
            log.error("Ошибка при создании слоя: {}", e.getMessage(), e);
            delegateExecution.setVariable(ITERATION_COUNTER_VAR_NAME, currentIteration + 1);

            throw new BpmnError("responseTimeOut");
        } catch (Exception e) {
            log.error("Неожиданная ошибка при создании слоя: {}", e.getMessage(), e);
            delegateExecution.setVariable(ITERATION_COUNTER_VAR_NAME, currentIteration + 1);

            throw new BpmnError("responseTimeOut");
        }
    }
}
