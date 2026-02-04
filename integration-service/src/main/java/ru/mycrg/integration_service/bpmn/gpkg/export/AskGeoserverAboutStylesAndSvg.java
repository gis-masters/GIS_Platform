package ru.mycrg.integration_service.bpmn.gpkg.export;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgStyle;
import ru.mycrg.data_service_contract.dto.gpkg.GpkgAppendingData;
import ru.mycrg.data_service_contract.queue.request.gpkg.ExportGpkgEvent;
import ru.mycrg.gis_service_contract.dto.LayerProjection;
import ru.mycrg.integration_service.bpmn.gpkg.GeoServerSpeaker;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgReportManager;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgProcessContext;

import java.util.List;
import java.util.stream.Collectors;

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

        ExportGpkgEvent event = (ExportGpkgEvent) delegateExecution.getVariable(EVENT_VAR_NAME);
        GpkgAppendingData gpkgData = event.getGpkgAppendingData();
        if (gpkgData == null) {
            log.debug("GpkgAppendingData пустая. Скорее всего тип выгрузки 'TABLES'.");
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "dontAskGeoserver");

            return;
        }

        List<LayerProjection> layers = gpkgData.getLayerProjections();
        String token = event.getToken();

        if (layers.isEmpty()) {
            log.debug("Добавлять в GPKG информацию о слоях не нужно!");
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "geoserverGiveNothing");

            return;
        }

        List<String> stylesNames = layers.stream()
                                         .map(LayerProjection::getStyleName)
                                         .collect(Collectors.toList());

        List<GpkgStyle> stylesAndSvgs = stylesNames
                .stream()
                .map(style -> geoServerSpeaker.getStylesAndSvg(style, token, event.getDbName()))
                .collect(Collectors.toList());

        log.debug("Всё прошло хорошо. У нас есть слои, стили и место где это объединить!");

        //Типа защита, типа от NPE
        GpkgAppendingData gpkgAppendingData = event.getGpkgAppendingData();
        if (gpkgAppendingData == null) {
            gpkgAppendingData = new GpkgAppendingData();
        }
        gpkgAppendingData.setStylesAndSvgs(stylesAndSvgs);
        event.setGpkgAppendingData(gpkgAppendingData);

        GpkgProcessContext rabbitDto = new GpkgProcessContext(event.getProcessId(),
                                                              event.getDbName(),
                                                              TASK_DONE);

        reportManager.createStylesReport(rabbitDto, event.getGpkgReport(), stylesAndSvgs);

        delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "geoserverGiveSome");
    }
}
