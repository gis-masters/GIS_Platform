package ru.mycrg.integration_service.bpmn.gpkg.import_.media;

import org.camunda.bpm.engine.RuntimeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgCreateFilesBackwardEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import static ru.mycrg.integration_service.bpmn.CamundaVariables.asJava;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EVENT_IMPORT_GPKG_BACKWARD_FILE_CREATE;

@Service
public class ImportGpkgCreateFilesBackwardEventHandler implements IEventHandler {

    private static final Logger log = LoggerFactory.getLogger(ImportGpkgCreateFilesBackwardEventHandler.class);

    private final RuntimeService runtimeService;

    public ImportGpkgCreateFilesBackwardEventHandler(RuntimeService runtimeService) {
        this.runtimeService = runtimeService;
    }

    @Override
    public String getEventType() {
        return ImportGpkgCreateFilesBackwardEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        ImportGpkgCreateFilesBackwardEvent backward = (ImportGpkgCreateFilesBackwardEvent) mqEvent;
        ProcessStatus status = backward.getStatus();
        String businessKey = backward.getBusinessKey();

        log.debug("Получен ImportGpkgCopyDataBackwardEvent для businessKey: {}, status: {}",
                  businessKey, status);

        //По Camunda процессу мы в любом случае идём дальше. Следующие классы сами разберутся если нужно.
        runtimeService.createMessageCorrelation("Mes_FromDataCreateFilesGpkg")
                      .processInstanceBusinessKey(businessKey)
                      .setVariable(EVENT_IMPORT_GPKG_BACKWARD_FILE_CREATE, asJava(backward))
                      .correlateWithResult();
    }
}
