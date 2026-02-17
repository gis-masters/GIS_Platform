package ru.mycrg.integration_service.bpmn.gpkg.import_.raster;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.GpkgTile;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.messagebus_contract.events.integration_wrapper.ImportGpkgExtractRasterEvent;

import java.util.List;
import java.util.stream.Collectors;

import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.IMPORT_GPKG_EVENT;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.IMPORT_GPKG_GDAL_RASTERS_LIST;

@Service("wrapperExtractor")
public class WrapperExtractor implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(WrapperExtractor.class);

    private final IMessageBusProducer messageBus;

    public WrapperExtractor(IMessageBusProducer messageBus) {
        this.messageBus = messageBus;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        ImportGpkgEvent event = (ImportGpkgEvent) delegateExecution.getVariable(IMPORT_GPKG_EVENT);
        String businessKey = delegateExecution.getProcessBusinessKey();
        List<GpkgTile> workData = (List<GpkgTile>) delegateExecution.getVariable(IMPORT_GPKG_GDAL_RASTERS_LIST);
        List<String> tilesNames = workData.stream().map(GpkgTile::getGpkgLayerTableName).collect(Collectors.toList());

        messageBus.produce(new ImportGpkgExtractRasterEvent(businessKey,
                                                            event.getDbName(),
                                                            event.getFileId(),
                                                            event.getToken(),
                                                            tilesNames));

        log.debug("Поставили ивент создания растров в geo-wrapper");
    }
}
