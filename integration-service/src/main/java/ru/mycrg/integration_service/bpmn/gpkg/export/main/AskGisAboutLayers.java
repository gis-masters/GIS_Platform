package ru.mycrg.integration_service.bpmn.gpkg.export.main;

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
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.net.URL;
import java.util.List;
import java.util.stream.Collectors;

import static ru.mycrg.common_contracts.generated.data_service.gpkg.export.GpkgExportType.LAYER;
import static ru.mycrg.common_contracts.generated.data_service.gpkg.export.GpkgExportType.TABLE;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.integration_service.bpmn.BaseHttpService.httpClient;
import static ru.mycrg.integration_service.bpmn.CamundaVariables.asJava;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;
import static ru.mycrg.integration_service.bpmn.enums.GpkgImportProcessPermittedStatus.*;

@Service("askGisAboutLayers")
public class AskGisAboutLayers implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(AskGisAboutLayers.class);

    private final BaseHttpService baseHttpService;
    private final ObjectMapper objectMapper;
    private final GpkgReportManager reportManager;

    public AskGisAboutLayers(BaseHttpService baseHttpService,
                             ObjectMapper objectMapper,
                             GpkgReportManager reportManager) {
        this.baseHttpService = baseHttpService;
        this.objectMapper = objectMapper;
        this.reportManager = reportManager;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        int currentIteration = (int) delegateExecution.getVariable(EXPORT_GPKG_COUNT_HTTP_ERRORS);
        if (currentIteration >= 4) {
            delegateExecution.setVariable(EXPORT_GPKG_WORKER_TYPE, "allLayersUnavailable");

            return;
        }
        log.debug("Класс '{}' начал работу.", AskGisAboutLayers.class.getSimpleName());
        ExportGpkgPayload subPayload = (ExportGpkgPayload) delegateExecution.getVariable(EXPORT_GPKG_SUB_PAYLOAD);

        ExportGpkgEvent event = (ExportGpkgEvent) delegateExecution.getVariable(EXPORT_GPKG_EVENT);

        /*
        Шаг 1. Проверяем может ли этот класс выполнять свою работу
        Класс может работать только если у нас LAYER, при TABLE переопределяем тип, чтобы попасть на следующего
        делегата. Иначе мы как-то на шагах ранее пропустили тип с которым не умеем работать.
        */
        if (subPayload.getType() == TABLE) {
            log.debug("У нас не просили слои. Пропускаем шаг!");

            delegateExecution.setVariable(EXPORT_GPKG_WORKER_TYPE, FEATURES.getValue());

            return;
        } else if (subPayload.getType() != LAYER) {
            throw new BpmnError("notCorrectGpkgImportType");
        }

        // Безопасное преобразование payload в List<Long>
        List<Long> layersId = ((List<?>) subPayload
                .getPayload()).stream()
                              .map(id -> id instanceof Integer ? ((Integer) id).longValue() : (Long) id)
                              .collect(Collectors.toList());

        if (layersId.isEmpty()) {
            delegateExecution.setVariable(EXPORT_GPKG_WORKER_TYPE, "allLayersUnavailable");

            return;
        }

        log.debug("Были запрошены слои с id: {}", layersId);

        String token = event.getToken();

        //Шаг 2. Собираем лист запрошенных объектов
        List<LayerProjection> layers = getLayersById(currentIteration, delegateExecution, token, layersId);

        GpkgProcessContext rabbitDto = new GpkgProcessContext(event.getProcessId(),
                                                              event.getDbName(),
                                                              TASK_DONE);
        reportManager.createLayerReport(rabbitDto, event.getGpkgReport(), layers);

        if (!layers.isEmpty()) {
            //Шаг 3. Формируем объект для следующего шага
            defineWorkerAndSetupData(delegateExecution, layers);

            makeReport(rabbitDto, event, layersId, layers);

            GpkgAppendingData gpkgData = new GpkgAppendingData(layers);
            delegateExecution.setVariable(EXPORT_GPKG_APPENDING_CRG_DATA, asJava(gpkgData));

            delegateExecution.setVariable(EXPORT_GPKG_COUNT_HTTP_ERRORS, 0);
        } else {
            delegateExecution.setVariable(EXPORT_GPKG_WORKER_TYPE, "allLayersUnavailable");
        }
    }

    private List<LayerProjection> getLayersById(int currentIteration,
                                                DelegateExecution delegateExecution,
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
                                                                              new TypeReference<>() {
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
            delegateExecution.setVariable(ITERATION_COUNTER_VAR_NAME, currentIteration + 1);

            throw new BpmnError("responseTimeOut");
        } catch (Exception e) {
            log.error("Ошибка парсинга ответа при запросе слоев с ID {}: {}", layersId, e.getMessage(), e);

            return List.of();
        }
    }

    //TODO: Наполнить растры исключительно нужными данными
    private void defineWorkerAndSetupData(DelegateExecution delegateExecution, List<LayerProjection> layers) {
        log.debug("Пытаемся определить тип обработчика для Экспорта слоёв в gpkg.");

        List<LayerProjection> rasterLayers = layers.stream()
                                                   .filter(layer -> layer.getType().equals("raster"))
                                                   .collect(Collectors.toList());
        delegateExecution.setVariable(EXPORT_GPKG_RASTERS_LIST, asJava(rasterLayers));

        List<ExportResourceModel> vectorTables = layers
                .stream()
                .filter(layer -> layer.getType().equals("vector"))
                .map(layer -> new ExportResourceModel(layer.getDataset(), layer.getResourceId()))
                .distinct()
                .collect(Collectors.toList());
        delegateExecution.setVariable(EXPORT_GPKG_VECTOR_LIST, asJava(vectorTables));

        if (!rasterLayers.isEmpty() && !vectorTables.isEmpty()) {
            delegateExecution.setVariable(EXPORT_GPKG_WORKER_TYPE, FEATURES_AND_TILES.getValue());
        } else if (!rasterLayers.isEmpty()) {
            delegateExecution.setVariable(EXPORT_GPKG_WORKER_TYPE, TILES.getValue());
        } else if (!vectorTables.isEmpty()) {
            delegateExecution.setVariable(EXPORT_GPKG_WORKER_TYPE, FEATURES.getValue());
        } else {
            throw new BpmnError("canNotDefineWorker");
        }
    }

    private void makeReport(GpkgProcessContext rabbitDto,
                            ExportGpkgEvent event,
                            List<Long> layersId,
                            List<LayerProjection> layers) {
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
