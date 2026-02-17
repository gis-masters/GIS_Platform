package ru.mycrg.integration_service.bpmn.gpkg.import_.raster;

import org.camunda.bpm.engine.RuntimeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.queue.response.ImportGpkgExtractRasterBackwardEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import static ru.mycrg.integration_service.bpmn.CamundaVariables.asJava;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EVENT_IMPORT_GPKG_BACKWARD_EXTRACTED_RASTERS_NAME;

@Service
public class ImportGpkgExtractRasterBackwardEventHandler implements IEventHandler {

    private static final Logger log = LoggerFactory.getLogger(ImportGpkgExtractRasterBackwardEventHandler.class);

    private final RuntimeService runtimeService;

    public ImportGpkgExtractRasterBackwardEventHandler(RuntimeService runtimeService) {
        this.runtimeService = runtimeService;
    }

    @Override
    public String getEventType() {
        return ImportGpkgExtractRasterBackwardEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        ImportGpkgExtractRasterBackwardEvent backwardEvent = (ImportGpkgExtractRasterBackwardEvent) mqEvent;
        String businessKey = backwardEvent.getBusinessKey();

        log.debug("Получен ImportGpkgExtractRasterBackwardEvent для businessKey: {}, status: {}",
                  businessKey, backwardEvent.getStatus());

        runtimeService.createMessageCorrelation("Mes_FromWrapperExtractRasters")
                      .processInstanceBusinessKey(businessKey)
                      .setVariable(EVENT_IMPORT_GPKG_BACKWARD_EXTRACTED_RASTERS_NAME, asJava(backwardEvent))
                      .correlateWithResult();
    }
}
