package ru.mycrg.integration_service.bpmn.gpkg.export.raster;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.dto.gpkg.GpkgAppendingData;
import ru.mycrg.data_service_contract.queue.request.gpkg.ExportGpkgEvent;
import ru.mycrg.gis_service_contract.dto.LayerProjection;
import ru.mycrg.integration_service.bpmn.gpkg.GeoServerSpeaker;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgProcessContext;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgReportManager;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static ru.mycrg.common_utils.CrgGlobalProperties.getLayerNameFromComplexName;
import static ru.mycrg.common_utils.CrgGlobalProperties.getScratchWorkspaceName;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.geoserver_client.services.coverages.Coverages.COVERAGES;
import static ru.mycrg.geoserver_client.services.coverages.Coverages.COVERAGE_STORES;
import static ru.mycrg.integration_service.bpmn.CamundaVariables.asJava;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("askGeoserverRasterLayersPath")
public class AskGeoserverRasterLayersPath implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(AskGeoserverRasterLayersPath.class);

    private final GeoServerSpeaker geoServerSpeaker;
    private final GpkgReportManager reportManager;

    public AskGeoserverRasterLayersPath(GeoServerSpeaker geoServerSpeaker, GpkgReportManager reportManager) {
        this.geoServerSpeaker = geoServerSpeaker;
        this.reportManager = reportManager;
    }

    /**
     * Получает пути к файлам на машине из слоя GeoServer.
     * <p>
     * Для каждого слоя получает информацию через REST API GeoServer, извлекает имя coverage store и определяет
     * физический путь к файлу на диске.
     * <ol>
     *     <li>GET на {@code /workspaces/<workspace>/layers/<layer>}</li>
     *     <li>Достаём coverage store name из layer resource href</li>
     *     <li>GET на {@code /workspaces/<workspace>/coveragestores/<coveragestore>}</li>
     *     <li>Достаём URL - который по сути path</li>
     * </ol>
     */
    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        List<LayerProjection> rasterLayers = (List<LayerProjection>) delegateExecution
                .getVariable(EXPORT_GPKG_RASTERS_LIST);

        Map<String, String> resourceAndPath = new HashMap<>();

        ExportGpkgEvent event = (ExportGpkgEvent) delegateExecution.getVariable(EXPORT_GPKG_EVENT);
        String token = event.getToken();
        String dbName = event.getDbName();

        for (LayerProjection layer: rasterLayers) {
            getLayerNameFromComplexName(layer.getComplexName())
                    .flatMap(geoLayerName -> geoServerSpeaker.getLayer(
                            token,
                            getScratchWorkspaceName(dbName),
                            geoLayerName
                    ))
                    .map(geoLayer ->
                                 geoLayer.getResource().getHref()
                                         .split(COVERAGES)[0]
                                         .split(COVERAGE_STORES)[1])
                    .flatMap(coverageStore -> geoServerSpeaker.getCoverageStore(
                            token,
                            getScratchWorkspaceName(dbName),
                            coverageStore
                    ))
                    .ifPresentOrElse(
                            store -> resourceAndPath.put(layer.getResourceId(), store.getUrl()),
                            () -> log.warn("Не смогли найти слой или coverage store для {}", layer.getResourceId())
                    );
        }

        if (resourceAndPath.isEmpty()) {
            log.warn("Не получилось достать путь к файлу ни на один растровый слой!");
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "allFilePathsBroken");
        } else {
            delegateExecution.setVariable(EXPORT_GPKG_RESOURCE_AND_PATH, asJava(resourceAndPath));
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "haveSomeFilePaths");

            GpkgAppendingData appendingData = (GpkgAppendingData) delegateExecution
                    .getVariable(EXPORT_GPKG_APPENDING_CRG_DATA);
            appendingData.setLayerProjections(rasterLayers);
            appendingData.setResourceAndPath(resourceAndPath);
        }

        //Tile Report создали на шаге AskDocumentAvailability, тут донесём результаты
        GpkgProcessContext rabbitDto = new GpkgProcessContext(event.getProcessId(),
                                                              dbName,
                                                              TASK_DONE);

        reportManager.updateTileReportWithResources(rabbitDto, event.getGpkgReport(), resourceAndPath);
    }
}
