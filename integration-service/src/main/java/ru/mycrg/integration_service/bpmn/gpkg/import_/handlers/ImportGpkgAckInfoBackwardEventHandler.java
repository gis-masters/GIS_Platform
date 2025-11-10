package ru.mycrg.integration_service.bpmn.gpkg.import_.handlers;

import org.camunda.bpm.engine.RuntimeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgAckInfoBackwardEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import static ru.mycrg.integration_service.bpmn.CamundaVariables.asJava;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EVENT_IMPORT_GPKG_BACKWARD_DATA_NAME;

@Service
public class ImportGpkgAckInfoBackwardEventHandler implements IEventHandler {

    private static final Logger log = LoggerFactory.getLogger(ImportGpkgAckInfoBackwardEventHandler.class);

    private final RuntimeService runtimeService;

    public ImportGpkgAckInfoBackwardEventHandler(RuntimeService runtimeService) {
        this.runtimeService = runtimeService;
    }

    @Override
    public String getEventType() {
        return ImportGpkgAckInfoBackwardEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        ImportGpkgAckInfoBackwardEvent backward = (ImportGpkgAckInfoBackwardEvent) mqEvent;
        ProcessStatus status = backward.getStatus();
        String businessKey = backward.getBusinessKey();

        log.debug("Получен ImportGpkgAckInfoBackwardEvent для businessKey: {}, status: {}",
                  businessKey, status);
        log.debug("Проверка backward: {}", backward);

        //По Camunda процессу мы в любом случае идём дальше. Следующие классы сами разберутся если нужно.
        runtimeService.createMessageCorrelation("Mes_FromDataAckInfoFromGpkg")
                      .processInstanceBusinessKey(businessKey)
                      .setVariable(EVENT_IMPORT_GPKG_BACKWARD_DATA_NAME, asJava(backward))
                      .correlateWithResult();
    }
}
