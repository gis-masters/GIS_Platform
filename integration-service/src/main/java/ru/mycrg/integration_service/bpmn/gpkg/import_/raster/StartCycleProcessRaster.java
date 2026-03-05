package ru.mycrg.integration_service.bpmn.gpkg.import_.raster;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgTile;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessReport;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.stream.Collectors;

import static ru.mycrg.integration_service.bpmn.CamundaVariables.asJava;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;
import static ru.mycrg.integration_service.bpmn.enums.GpkgImportProcessPermittedStatus.DONE_ALL_RASTERS;
import static ru.mycrg.integration_service.bpmn.enums.GpkgImportProcessPermittedStatus.ONE_MORE_RASTERS;

@Service("startCycleProcessRaster")
public class StartCycleProcessRaster implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(StartCycleProcessRaster.class);

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        int neededCyclesCount = (int) delegateExecution.getVariable(IMPORT_GPKG_NEEDED_CYCLES_COUNT_RASTER);
        int performedCyclesCount = (int) delegateExecution.getVariable(IMPORT_GPKG_PERFORMED_CYCLES_COUNT_RASTER);
        ImportGpkgEvent event = (ImportGpkgEvent) delegateExecution.getVariable(IMPORT_GPKG_EVENT);

        GpkgProcessReport importReport = (GpkgProcessReport) delegateExecution.getVariable(IMPORT_GPKG_EVENT_REPORT);

        List<GpkgTile> rasters = importReport.getPayload().getTiles();

        if (neededCyclesCount == 0 && performedCyclesCount == 0) {
            log.debug("Мы первый раз в шаге импорта растров. Нужно посчитать количество циклов");

            if (rasters.isEmpty()) {
                log.debug("В процессе №:{} распаковывать растры не нужно", event.getProcessId());
                delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, DONE_ALL_RASTERS.getValue());

                return;
            }

            List<List<GpkgTile>> filesBySameFields =
                    rasters.stream()
                           .collect(Collectors.collectingAndThen(
                                   Collectors.groupingBy(
                                           t -> Arrays.asList(t.getLibraryIdentifier(),
                                                              t.getDocumentId(),
                                                              t.getField()),
                                           LinkedHashMap::new,
                                           Collectors.toList()
                                   ),
                                   m -> new ArrayList<>(m.values())
                           ));

            delegateExecution.setVariable(IMPORT_GPKG_RASTERS_LIST, asJava(filesBySameFields));
            delegateExecution.setVariable(IMPORT_GPKG_CURRENT_RASTERS,
                                          asJava(filesBySameFields.get(performedCyclesCount)));

            delegateExecution.setVariable(IMPORT_GPKG_PERFORMED_CYCLES_COUNT_RASTER, 1);
            delegateExecution.setVariable(IMPORT_GPKG_NEEDED_CYCLES_COUNT_RASTER, filesBySameFields.size());

            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, ONE_MORE_RASTERS.getValue());
            delegateExecution.setVariable(IMPORT_GPKG_NEEDED_RASTER_PUBLISH_CYCLES_COUNT, 0);
            delegateExecution.setVariable(IMPORT_GPKG_PERFORMED_RASTER_PUBLISH_CYCLES_COUNT, 0);

            return;
        }

        if (performedCyclesCount >= neededCyclesCount) {
            log.debug("Все растры были успешно обработаны");
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, DONE_ALL_RASTERS.getValue());

            return;
        }
        List<List<GpkgTile>> allNeededWorkItems = (List<List<GpkgTile>>) delegateExecution
                .getVariable(IMPORT_GPKG_RASTERS_LIST);

        delegateExecution.setVariable(IMPORT_GPKG_CURRENT_RASTERS,
                                      asJava(allNeededWorkItems.get(performedCyclesCount)));

        delegateExecution.setVariable(IMPORT_GPKG_PERFORMED_CYCLES_COUNT_RASTER, performedCyclesCount + 1);

        delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, ONE_MORE_RASTERS.getValue());
        delegateExecution.setVariable(IMPORT_GPKG_NEEDED_RASTER_PUBLISH_CYCLES_COUNT, 0);
        delegateExecution.setVariable(IMPORT_GPKG_PERFORMED_RASTER_PUBLISH_CYCLES_COUNT, 0);
    }
}
