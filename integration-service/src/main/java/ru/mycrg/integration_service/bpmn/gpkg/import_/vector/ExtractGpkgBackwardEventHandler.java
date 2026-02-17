package ru.mycrg.integration_service.bpmn.gpkg.import_.vector;

import org.camunda.bpm.engine.RuntimeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.data_service_contract.queue.response.ExtractGpkgBackwardEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.DONE;
import static ru.mycrg.integration_service.bpmn.CamundaVariables.asJava;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;
import static ru.mycrg.integration_service.bpmn.enums.GpkgImportProcessPermittedStatus.GDAL_IMPORT_VECTOR_DONE;
import static ru.mycrg.integration_service.bpmn.enums.GpkgImportProcessPermittedStatus.GDAL_IMPORT_VECTOR_FAILED;

@Service
public class ExtractGpkgBackwardEventHandler implements IEventHandler {

    private static final Logger log = LoggerFactory.getLogger(ExtractGpkgBackwardEventHandler.class);

    private final RuntimeService runtimeService;

    public ExtractGpkgBackwardEventHandler(RuntimeService runtimeService) {
        this.runtimeService = runtimeService;
    }

    @Override
    public String getEventType() {
        return ExtractGpkgBackwardEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        ExtractGpkgBackwardEvent event = (ExtractGpkgBackwardEvent) mqEvent;
        ProcessStatus status = event.getStatus();
        String businessKey = event.getBusinessKey();

        log.debug("Получен ExtractGpkgBackwardEvent для businessKey: {}, status: {}",
                  businessKey, status);

        if (status == DONE) {
            runtimeService.createMessageCorrelation("Mes_FromWrapperAboutExtractGpkg")
                          .processInstanceBusinessKey(businessKey)
                          .setVariable(IMPORT_GPKG_EXTRACTED_SCHEMA_NAME, event.getCreatedSchemaName())
                          .setVariable(IMPORT_GPKG_FAIL_REASON, asJava(event.getErrorReport()))
                          .setVariable(CHECK_STATUS_VAR_NAME, GDAL_IMPORT_VECTOR_DONE.getValue())
                          .correlateWithResult();
        } else {
            runtimeService.createMessageCorrelation("Mes_FromWrapperAboutExtractGpkg")
                          .processInstanceBusinessKey(businessKey)
                          .setVariable(IMPORT_GPKG_FAIL_REASON, asJava(event.getErrorDescription()))
                          .setVariable(CHECK_STATUS_VAR_NAME, GDAL_IMPORT_VECTOR_FAILED.getValue())
                          .correlateWithResult();
        }
    }
}
