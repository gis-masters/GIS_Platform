package ru.mycrg.integration_service.bpmn.gpkg.export.vector;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.export.ExportGpkgPayload;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgStyle;
import ru.mycrg.data_service_contract.dto.gpkg.GpkgAppendingData;
import ru.mycrg.data_service_contract.queue.request.gpkg.ExportGpkgEvent;
import ru.mycrg.gis_service_contract.dto.LayerProjection;
import ru.mycrg.integration_service.bpmn.gpkg.GeoServerSpeaker;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgProcessContext;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgReportManager;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import static ru.mycrg.common_contracts.generated.data_service.gpkg.export.GpkgExportType.TABLE;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("askGeoserverAboutStylesAndSvg")
public class AskGeoserverAboutStylesAndSvg implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(AskGeoserverAboutStylesAndSvg.class);

    private final GeoServerSpeaker geoServerSpeaker;
    private final GpkgReportManager reportManager;

    public AskGeoserverAboutStylesAndSvg(GeoServerSpeaker geoServerSpeaker,
                                         GpkgReportManager reportManager) {
        this.geoServerSpeaker = geoServerSpeaker;
        this.reportManager = reportManager;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.debug("Класс '{}' начал работу.", AskGeoserverAboutStylesAndSvg.class.getSimpleName());

        ExportGpkgPayload subPayload = (ExportGpkgPayload) delegateExecution.getVariable(EXPORT_GPKG_SUB_PAYLOAD);
        if (subPayload.getType() == TABLE) {
            log.debug("Тип выгрузки 'TABLES' - опрашивать geoserver не нужно");

            return;
        }

        GpkgAppendingData appendingData = (GpkgAppendingData) delegateExecution
                .getVariable(EXPORT_GPKG_APPENDING_CRG_DATA);
        List<LayerProjection> layers = appendingData.getLayerProjections();

        if (layers.isEmpty()) {
            log.debug("Добавлять в GPKG информацию о слоях не нужно!");
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "geoserverDontReturnInfo");

            return;
        }

        Set<String> stylesNames = layers.stream()
                                        .filter(Objects::nonNull)
                                        .map(LayerProjection::getStyleName)
                                        .collect(Collectors.toSet());

        ExportGpkgEvent event = (ExportGpkgEvent) delegateExecution.getVariable(EXPORT_GPKG_EVENT);

        List<GpkgStyle> stylesAndSvgs = stylesNames
                .stream()
                .filter(Objects::nonNull)
                .map(style -> geoServerSpeaker.getStylesAndSvg(style, event.getToken(), event.getDbName()))
                .collect(Collectors.toList());

        log.debug("Всё прошло хорошо. У нас есть слои, стили и место где это объединить!");

        if (stylesAndSvgs.isEmpty()) {
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "geoserverDontReturnInfo");
        }

        appendingData.setStylesAndSvgs(stylesAndSvgs);

        GpkgProcessContext rabbitDto = new GpkgProcessContext(event.getProcessId(),
                                                              event.getDbName(),
                                                              TASK_DONE);

        reportManager.createStylesReport(rabbitDto, event.getGpkgReport(), stylesAndSvgs);

        delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "geoserverGiveSome");
    }
}
