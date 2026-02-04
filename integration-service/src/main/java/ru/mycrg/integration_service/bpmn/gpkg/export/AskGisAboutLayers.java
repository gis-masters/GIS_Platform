package ru.mycrg.integration_service.bpmn.gpkg.export;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.Request;
import okhttp3.Response;
import org.camunda.bpm.engine.delegate.BpmnError;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.export.ExportGpkgPayload;
import ru.mycrg.data_service_contract.dto.ExportResourceModel;
import ru.mycrg.data_service_contract.dto.gpkg.GpkgAppendingData;
import ru.mycrg.data_service_contract.queue.request.gpkg.ExportGpkgEvent;
import ru.mycrg.gis_service_contract.dto.LayerProjection;
import ru.mycrg.integration_service.bpmn.BaseHttpService;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgProcessContext;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgReportManager;

import java.io.IOException;
import java.net.URL;
import java.util.List;
import java.util.stream.Collectors;

import static ru.mycrg.common_contracts.generated.data_service.gpkg.export.GpkgExportType.LAYER;
import static ru.mycrg.common_contracts.generated.data_service.gpkg.export.GpkgExportType.TABLE;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.integration_service.bpmn.BaseHttpService.httpClient;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;
import static ru.mycrg.integration_service.bpmn.VariableUtil.getVariable;

@Service("askGisAboutLayers")
public class AskGisAboutLayers implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(AskGisAboutLayers.class);

    private final BaseHttpService baseHttpService;
    private final ObjectMapper objectMapper;
    private final GpkgReportManager reportManager;

    int currentIteration;

    public AskGisAboutLayers(BaseHttpService baseHttpService,
                             ObjectMapper objectMapper,
                             GpkgReportManager reportManager) {
        this.baseHttpService = baseHttpService;
        this.objectMapper = objectMapper;
        this.reportManager = reportManager;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        currentIteration = (int) getVariable(delegateExecution, ITERATION_COUNTER_VAR_NAME, getClass().getName());
        if (currentIteration >= 4) {
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "allLayersUnavailable");

            return;
        }
        log.debug("Класс '{}' начал работу.", AskGisAboutLayers.class.getSimpleName());
        ExportGpkgPayload subPayload = (ExportGpkgPayload) delegateExecution.getVariable(EVENT_SUB_PAYLOAD_NAME);

        ExportGpkgEvent event = (ExportGpkgEvent) delegateExecution.getVariable(EVENT_VAR_NAME);

        //Шаг 1. Выходим из класса если ему не с чем работать.
        if (subPayload.getType() != LAYER) {
            log.debug("У нас не просили слои. Пропускаем шаг!");

            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "someLayersAvailable");

            return;
        }

        // Безопасное преобразование payload в List<Long>
        List<Long> layersId = ((List<?>) subPayload
                .getPayload()).stream()
                              .map(id -> id instanceof Integer ? ((Integer) id).longValue() : (Long) id)
                              .collect(Collectors.toList());

        if (layersId.isEmpty()) {
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "allLayersUnavailable");

            return;
        }

        log.debug("Были запрошены слои с id: {}", layersId);

        String token = delegateExecution.getVariable(TOKEN_VAR_NAME).toString();

        //Шаг 2. Собираем лист запрошенных объектов
        List<LayerProjection> layers = getLayersById(delegateExecution, token, layersId);

        GpkgProcessContext rabbitDto = new GpkgProcessContext(event.getProcessId(),
                                                              event.getDbName(),
                                                              TASK_DONE);
        reportManager.createLayerReport(rabbitDto, event.getGpkgReport(), layers);

        if (!layers.isEmpty()) {
            //Шаг 3. Формируем объект для следующего шага
            collectNewObjectForNextStep(rabbitDto, layers, subPayload, event, layersId);

            delegateExecution.setVariable(ITERATION_COUNTER_VAR_NAME, 0);
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "someLayersAvailable");
        } else {
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "allLayersUnavailable");
        }
    }

    private List<LayerProjection> getLayersById(DelegateExecution delegateExecution,
                                                String token,
                                                List<Long> layersId) {
        try {
            String layerIdsParam = layersId.stream()
                                           .map(String::valueOf)
                                           .collect(Collectors.joining(","));

            URL gisServiceUrl = baseHttpService.getGisServiceUrl();
            URL getLayersList = new URL(gisServiceUrl, "/layers/?layerIds=" + layerIdsParam);

            Request req = new Request.Builder()
                    .addHeader("Authorization", "Bearer " + token)
                    .addHeader("Content-Type", "application/json")
                    .url(getLayersList)
                    .get()
                    .build();

            try (Response response = httpClient.newCall(req).execute()) {
                if (response.isSuccessful()) {
                    String responseBody = response.body() != null ? response.body().string() : null;
                    log.debug("Получен ответ от GIS сервиса: {}", responseBody);

                    // Парсим JSON ответ напрямую через ObjectMapper
                    JsonNode rootNode = objectMapper.readTree(responseBody);

                    JsonNode contentNode = rootNode.has("content") ? rootNode.get("content") : rootNode;

                    // Если contentNode - это массив, парсим его как список LayerProjection
                    if (contentNode.isArray()) {
                        List<LayerProjection> layers = objectMapper.readValue(contentNode.toString(),
                                                                              new TypeReference<List<LayerProjection>>() {
                                                                              });

                        return layers != null ? layers : List.of();
                    }
                } else {
                    int statusCode = response.code();
                    log.warn("GIS сервис вернул неуспешный статус: {} для запроса слоев с ID: {}", statusCode,
                             layersId);

                    // Временные ошибки - можно повторить
                    if (statusCode == 503 || statusCode == 502 || statusCode == 504 || statusCode == 429) {
                        delegateExecution.setVariable(ITERATION_COUNTER_VAR_NAME, currentIteration++);

                        throw new BpmnError("responseTimeOut");
                    }
                }
                return List.of();
            }
        } catch (IOException e) {
            log.error("Ошибка ввода-вывода при запросе слоев с ID {}: {}", layersId, e.getMessage(), e);
            delegateExecution.setVariable(ITERATION_COUNTER_VAR_NAME, currentIteration++);

            throw new BpmnError("responseTimeOut");
        } catch (Exception e) {
            log.error("Ошибка парсинга ответа при запросе слоев с ID {}: {}", layersId, e.getMessage(), e);

            return List.of();
        }
    }

    private void collectNewObjectForNextStep(GpkgProcessContext rabbitDto,
                                             List<LayerProjection> layers,
                                             ExportGpkgPayload subPayload,
                                             ExportGpkgEvent event,
                                             List<Long> layersId) {
        List<ExportResourceModel> exportedResources = layers
                .stream()
                .map(layer -> new ExportResourceModel(layer.getDataset(), layer.getResourceId()))
                .distinct()
                .collect(Collectors.toList());

        subPayload.setType(TABLE);
        subPayload.setPayload(exportedResources);
        event.setPayload(subPayload);

        //Пока что мы тут первые -> мы можем себе это позволить.
        //При появлении проектов нужно будет брать сущность.
        event.setGpkgAppendingData(new GpkgAppendingData(layers));

        String msg = "Слоёв было запрошено: " + layersId.size() + ".";

        if (layersId.size() > layers.size()) {
            List<Long> absentIds = layers.stream()
                                         .map(LayerProjection::getId)
                                         .collect(Collectors.collectingAndThen(
                                                 Collectors.toSet(),
                                                 idSet -> layersId
                                                         .stream()
                                                         .filter(id -> !idSet.contains(id))
                                                         .collect(Collectors.toList())));

            msg = msg + " ID слоёв, которые не будут выгружены: " + absentIds + ".";
        }

        reportManager.updateReportWithMessage(rabbitDto, event.getGpkgReport(), msg);
    }
}
