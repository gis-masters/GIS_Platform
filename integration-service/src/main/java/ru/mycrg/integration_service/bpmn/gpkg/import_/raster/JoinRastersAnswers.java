package ru.mycrg.integration_service.bpmn.gpkg.import_.raster;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.GpkgTile;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessReport;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.data_service_contract.queue.response.ImportGpkgExtractRasterBackwardEvent;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgProcessContext;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgReportManager;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus.ERROR;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.integration_service.bpmn.CamundaVariables.asJava;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("joinRastersAnswers")
public class JoinRastersAnswers implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(JoinRastersAnswers.class);

    private final GpkgReportManager reportManager;

    public JoinRastersAnswers(GpkgReportManager reportManager) {
        this.reportManager = reportManager;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.debug("Класс {} начал работать.", JoinRastersAnswers.class.getSimpleName());

        String status = (String) delegateExecution.getVariable(CHECK_STATUS_VAR_NAME);

        List<GpkgTile> resultRasters = new ArrayList<>();

        switch (status) {
            case "wrapperOnly":
            case "wrapperAndData":
                ImportGpkgExtractRasterBackwardEvent geoWrapperAns = (ImportGpkgExtractRasterBackwardEvent)
                        delegateExecution.getVariable(EVENT_IMPORT_GPKG_BACKWARD_EXTRACTED_RASTERS_NAME);

                List<GpkgTile> beforeGdal = (List<GpkgTile>) delegateExecution
                        .getVariable(IMPORT_GPKG_GDAL_RASTERS_LIST);

                Map<String, GpkgTile> afterGdal = geoWrapperAns.getTiles();

                beforeGdal.forEach(before -> {
                    GpkgTile after = afterGdal.get(before.getGpkgLayerTableName());
                    if (after != null) {
                        GpkgProcessStatus extractStatus = after.getStatus();
                        if (extractStatus == ERROR) {
                            before.getMessages().addAll(after.getMessages());
                        } else {
                            before.setTitle(after.getTitle());
                        }
                        before.setStatus(after.getStatus());
                    }
                });

                swapTilesReport(delegateExecution, beforeGdal);

                List<GpkgTile> successfulGdalRasters = beforeGdal.stream()
                                                                 .filter(tile -> tile.getStatus() != ERROR)
                                                                 .collect(Collectors.toList());

                resultRasters.addAll(successfulGdalRasters);

                if ("wrapperAndData".equals(status)) {
                    log.debug("Обработка растров из DataService будет добавлена в будущем");
                }
                break;

            case "dataService":
                log.warn("Функционал не реализован!!!");

                break;
        }

        delegateExecution.setVariable(IMPORT_GPKG_GDAL_RASTERS_LIST, asJava(resultRasters));
        //В репорт пойдут все объекты, но таскать дальше по процессу ерроры бесполезно. Тут и фильтранём
        //Нужно подобным образом обработать если мы не выгружали объекты gdal, а как бы просто копировали их
    }

    private void swapTilesReport(DelegateExecution delegateExecution, List<GpkgTile> beforeGdal) {
        ImportGpkgEvent event = (ImportGpkgEvent) delegateExecution.getVariable(IMPORT_GPKG_EVENT);
        GpkgProcessContext rabbitDto = new GpkgProcessContext(event.getProcessId(),
                                                              event.getDbName(),
                                                              TASK_DONE);

        GpkgProcessReport importReport = (GpkgProcessReport) delegateExecution.getVariable(IMPORT_GPKG_EVENT_REPORT);

        reportManager.updateGdalTilesReport(rabbitDto, importReport, beforeGdal);
    }
}
