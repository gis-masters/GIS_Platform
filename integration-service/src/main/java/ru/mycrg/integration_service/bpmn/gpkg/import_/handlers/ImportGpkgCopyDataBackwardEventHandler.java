package ru.mycrg.integration_service.bpmn.gpkg.import_.handlers;

import org.camunda.bpm.engine.RuntimeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgCopyDataBackwardEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import static ru.mycrg.integration_service.bpmn.CamundaVariables.asJava;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.FAIL_REASON;

@Service
public class ImportGpkgCopyDataBackwardEventHandler implements IEventHandler {

    private static final Logger log = LoggerFactory.getLogger(ImportGpkgCopyDataBackwardEventHandler.class);

    private final RuntimeService runtimeService;

    public ImportGpkgCopyDataBackwardEventHandler(RuntimeService runtimeService) {
        this.runtimeService = runtimeService;
    }

    @Override
    public String getEventType() {
        return ImportGpkgCopyDataBackwardEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        ImportGpkgCopyDataBackwardEvent backward = (ImportGpkgCopyDataBackwardEvent) mqEvent;
        ProcessStatus status = backward.getStatus();
        String businessKey = backward.getBusinessKey();

        log.debug("Получен ImportGpkgCopyDataBackwardEvent для businessKey: {}, status: {}",
                  businessKey, status);

        //По Camunda процессу мы в любом случае идём дальше. Следующие классы сами разберутся если нужно.
        runtimeService.createMessageCorrelation("Mes_FromDataCopyFromGpkg")
                      .processInstanceBusinessKey(businessKey)
                      .setVariable(FAIL_REASON, asJava(backward))
                      .correlateWithResult();
    }
}