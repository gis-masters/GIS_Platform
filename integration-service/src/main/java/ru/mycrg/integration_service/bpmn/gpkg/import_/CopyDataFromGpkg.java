package ru.mycrg.integration_service.bpmn.gpkg.import_;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.GpkgTablesData;
import ru.mycrg.data_service_contract.dto.ResourceQualifierDto;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgCopyDataEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("copyDataFromGpkg")
public class CopyDataFromGpkg implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(CopyDataFromGpkg.class);

    private final IMessageBusProducer messageBus;

    public CopyDataFromGpkg(IMessageBusProducer messageBus) {
        this.messageBus = messageBus;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.debug("Класс {} начал работать.", CopyDataFromGpkg.class.getSimpleName());

        ImportGpkgEvent event = (ImportGpkgEvent) delegateExecution.getVariable(EVENT_VAR_NAME);

        String businessKey = (String) delegateExecution.getVariable(BUSINESS_KEY_VAR_NAME);
        GpkgTablesData currentTable = (GpkgTablesData) delegateExecution.getVariable(ENTITY_ID_VAR_NAME);
        String schema = (String) delegateExecution.getVariable(EXTRACTED_SCHEMA_NAME);

        messageBus.produce(
                new ImportGpkgCopyDataEvent(businessKey,
                                            event.getDbName(),
                                            event.getCreator(),
                                            new ResourceQualifierDto(schema, currentTable.getTableGpkgIdentifier()),
                                            new ResourceQualifierDto(event.getTargetDatasetIdentifier(),
                                                                     currentTable.getTableNewIdentifier())
                ));
    }
}
