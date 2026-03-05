package ru.mycrg.integration_service.bpmn.gpkg.import_.raster;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgTile;

import java.util.List;
import java.util.stream.Collectors;

import static ru.mycrg.integration_service.bpmn.CamundaVariables.asJava;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;
import static ru.mycrg.integration_service.bpmn.enums.GpkgImportProcessPermittedStatus.EXTRACT_RASTER_BOTH_WAYS;
import static ru.mycrg.integration_service.bpmn.enums.GpkgImportProcessPermittedStatus.EXTRACT_RASTER_WRAPPER_ONLY;

@Service("extractRastersManager")
public class ExtractRastersManager implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(ExtractRastersManager.class);

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        List<GpkgTile> filesBySameFields = (List<GpkgTile>) delegateExecution.getVariable(IMPORT_GPKG_CURRENT_RASTERS);

        List<GpkgTile> extractWithGdal = filesBySameFields.stream()
                                                          .filter(tile -> tile.getGpkgMediaReference() == null)
                                                          .collect(Collectors.toList());

        List<GpkgTile> extractByDataService = filesBySameFields
                .stream().filter(tile -> tile.getGpkgMediaReference() != null).collect(Collectors.toList());

        boolean hasGdalRasters = !extractWithGdal.isEmpty();
        boolean hasDataServiceRasters = !extractByDataService.isEmpty();

        if (hasGdalRasters && hasDataServiceRasters) {
            log.debug("Обнаружены растры обоих типов: с GDAL и через DataService");
            delegateExecution.setVariable(IMPORT_GPKG_GDAL_RASTERS_LIST, asJava(extractWithGdal));
            //в будущем засетить растры для data-service
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, EXTRACT_RASTER_BOTH_WAYS.getValue());
        } else if (hasGdalRasters) {
            log.debug("Растры без связных файлов будут отдельно обработаны GDAL");
            delegateExecution.setVariable(IMPORT_GPKG_GDAL_RASTERS_LIST, asJava(extractWithGdal));
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, EXTRACT_RASTER_WRAPPER_ONLY.getValue());
        } else if (hasDataServiceRasters) {
            log.debug("Функционал по внесению данных без gdal конвертации запланирован. Но не будет реализован в этой" +
                              " задаче. Camunda процесс написан чуть наперёд. Всем удачи в будущем!!!");
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, EXTRACT_RASTER_WRAPPER_ONLY.getValue());
        }
    }
}

