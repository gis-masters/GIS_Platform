package ru.mycrg.integration_service.bpmn.gpkg.export.raster;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgLayer;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessReport;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgTile;
import ru.mycrg.data_service_contract.queue.request.gpkg.ExportGpkgEvent;
import ru.mycrg.gis_service_contract.dto.LayerProjection;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgProcessContext;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgReportManager;
import ru.mycrg.integration_service.service.DataServiceSpeaker;

import java.util.*;
import java.util.function.BiPredicate;
import java.util.stream.Collectors;

import static ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus.ACTIVE;
import static ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus.ERROR;
import static ru.mycrg.common_contracts.generated.gis_service.LayerType.RASTER;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;
import static ru.mycrg.integration_service.bpmn.enums.GpkgImportProcessPermittedStatus.FEATURES;

@Service("askDocumentAvailability")
public class AskDocumentAvailability implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(AskDocumentAvailability.class);

    private final DataServiceSpeaker dataServiceSpeaker;
    private final GpkgReportManager reportManager;

    public AskDocumentAvailability(DataServiceSpeaker dataServiceSpeaker, GpkgReportManager reportManager) {
        this.dataServiceSpeaker = dataServiceSpeaker;
        this.reportManager = reportManager;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) {
        String workerType = (String) delegateExecution.getVariable(EXPORT_GPKG_WORKER_TYPE);
        if (FEATURES.getValue().equals(workerType)) {
            log.debug("Процесс запущен только для векторных таблиц => is FEATURES." +
                              " Завершаем процесс выгрузки растров!");

            return;
        }

        List<LayerProjection> rasterLayers = (List<LayerProjection>) delegateExecution
                .getVariable(EXPORT_GPKG_RASTERS_LIST);

        List<LayerProjection> fromLibraryLayers = filterBySourceType(rasterLayers, "document");
        List<LayerProjection> fromTableLayers = filterBySourceType(rasterLayers, "feature");

        ExportGpkgEvent event = (ExportGpkgEvent) delegateExecution.getVariable(EXPORT_GPKG_EVENT);
        GpkgProcessContext rabbitDto = new GpkgProcessContext(event.getProcessId(),
                                                              event.getDbName(),
                                                              TASK_DONE);

        String token = event.getToken();
        Set<String> unavailableLayerIds = new HashSet<>();
        unavailableLayerIds.addAll(
                checkDocumentAccessAndReport(token, fromLibraryLayers, rabbitDto, event.getGpkgReport()));
        unavailableLayerIds.addAll(checkTableAccessAndReport(token, fromTableLayers, rabbitDto, event.getGpkgReport()));

        // Убираем слои без прав доступа и продолжаем процесс, если остались валидные слои
        rasterLayers = rasterLayers.stream()
                                   .filter(l -> !unavailableLayerIds.contains(l.getResourceId()))
                                   .collect(Collectors.toList());

        if (rasterLayers.isEmpty()) {
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "allResourcesUnavailable");
        } else {
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "someResourcesAvailable");
        }
    }

    private Set<String> checkDocumentAccessAndReport(String token, List<LayerProjection> layers,
                                                     GpkgProcessContext rabbitDto, GpkgProcessReport gpkgReport) {
        return checkAccessAndReport(token,
                                    layers,
                                    rabbitDto,
                                    gpkgReport,
                                    (layer, tkn) -> {
                                        try {
                                            Map<String, Object> answer = dataServiceSpeaker
                                                    .getLibRecordById(tkn,
                                                                      layer.getSourceId(),
                                                                      layer.getSourceRecordId());

                                            return !answer.isEmpty();
                                        } catch (Exception e) {
                                            log.error(
                                                    "Ошибка проверки доступа к документу для слоя: {}",
                                                    layer.getTitle(), e);

                                            return false;
                                        }
                                    });
    }

    private Set<String> checkTableAccessAndReport(String token, List<LayerProjection> layers,
                                                  GpkgProcessContext rabbitDto, GpkgProcessReport gpkgReport) {
        return checkAccessAndReport(token,
                                    layers,
                                    rabbitDto,
                                    gpkgReport,
                                    (layer, tkn) -> dataServiceSpeaker
                                            .getTableAvailabilityByIdentifier(tkn,
                                                                              layer.getSourceId()));
    }

    /**
     * Проверяет доступность слоёв и формирует отчёты
     */
    private Set<String> checkAccessAndReport(String token,
                                             List<LayerProjection> layers,
                                             GpkgProcessContext rabbitDto,
                                             GpkgProcessReport gpkgReport,
                                             BiPredicate<LayerProjection, String> accessChecker) {
        if (layers.isEmpty()) {
            return new HashSet<>();
        }

        List<LayerProjection> goodLayers = new ArrayList<>();
        List<LayerProjection> badLayers = new ArrayList<>();

        layers.forEach(layer -> {
            if (accessChecker.test(layer, token)) {
                goodLayers.add(layer);
            } else {
                badLayers.add(layer);
            }
        });

        List<GpkgLayer> layerReports = new ArrayList<>();
        layerReports.addAll(buildLayerReportWithMsg(goodLayers, ACTIVE, null));
        layerReports.addAll(
                buildLayerReportWithMsg(badLayers, ERROR, "При экспорте указанного ресурса произошёл сбой"));

        reportManager.appendLayerReport(rabbitDto, gpkgReport, layerReports);

        List<GpkgTile> tileReports = buildActiveTileReports(goodLayers);
        reportManager.createTileReport(rabbitDto, gpkgReport, tileReports);

        return badLayers.stream().map(LayerProjection::getResourceId).collect(Collectors.toSet());
    }

    private List<LayerProjection> filterBySourceType(List<LayerProjection> layers, String sourceType) {
        return layers.stream()
                     .filter(l -> l.getSourceType().equals(sourceType))
                     .collect(Collectors.toList());
    }

    private List<GpkgLayer> buildLayerReportWithMsg(List<LayerProjection> layers,
                                                    GpkgProcessStatus status,
                                                    String msg) {
        return layers.stream()
                     .map(layer -> {
                         GpkgLayer report = new GpkgLayer(status,
                                                          layer.getTitle(),
                                                          layer.getStyleName(),
                                                          layer.getSourceId(),
                                                          layer.getDataset(),
                                                          RASTER);
                         if (msg != null) {
                             report.getMessages().add(msg);
                         }

                         return report;
                     })
                     .collect(Collectors.toList());
    }

    private List<GpkgTile> buildActiveTileReports(List<LayerProjection> layers) {
        return layers.stream()
                     .map(layer -> new GpkgTile(ACTIVE,
                                                layer.getTitle(),
                                                layer.getSourceId(),
                                                layer.getSourceRecordId(),
                                                layer.getNativeCRS(),
                                                layer.getResourceId()))
                     .collect(Collectors.toList());
    }
}
