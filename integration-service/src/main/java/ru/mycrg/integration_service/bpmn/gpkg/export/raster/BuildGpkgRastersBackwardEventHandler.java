package ru.mycrg.integration_service.bpmn.gpkg.export.raster;

import org.camunda.bpm.engine.RuntimeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.dto.BuildGpkgRastersBackwardEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import static ru.mycrg.integration_service.bpmn.CamundaVariables.asJava;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EXPORT_GPKG_BACKWARD_RASTERS_EVENT;

@Service
public class BuildGpkgRastersBackwardEventHandler implements IEventHandler {

    private static final Logger log = LoggerFactory.getLogger(BuildGpkgRastersBackwardEventHandler.class);

    private final RuntimeService runtimeService;

    public BuildGpkgRastersBackwardEventHandler(RuntimeService runtimeService) {
        this.runtimeService = runtimeService;
    }

    @Override
    public String getEventType() {
        return BuildGpkgRastersBackwardEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        BuildGpkgRastersBackwardEvent event = (BuildGpkgRastersBackwardEvent) mqEvent;

        String businessKey = event.getEvent().getBusinessKey();

        log.debug("Получен BuildGpkgRastersBackwardEvent для businessKey: {}, status: {}", businessKey,
                  event.getStatus());

        runtimeService.createMessageCorrelation("Mes_FromWrapperAboutGpkgRasters")
                      .processInstanceBusinessKey(businessKey)
                      .setVariable(EXPORT_GPKG_BACKWARD_RASTERS_EVENT, asJava(event))
                      .correlateWithResult();
    }
}
