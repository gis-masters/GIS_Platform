package ru.mycrg.integration_service.bpmn.gpkg.import_.vector;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.contents.GpkgContentsFeatures;
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

        //Обе переменные будут меняться на каждом прохождении цикла создания векторных таблиц и слоёв
        GpkgContentsFeatures currentTable = (GpkgContentsFeatures) delegateExecution
                .getVariable(IMPORT_GPKG_CURRENT_VECTOR_TABLE);
        String createdTableName = (String) delegateExecution.getVariable(IMPORT_GPKG_CREATED_TABLE_NAME);

        //По-умолчанию gdal достаёт всё в 1 схему. Она постоянна в пределах цикла создания таблиц и слоёв
        String schema = (String) delegateExecution.getVariable(IMPORT_GPKG_EXTRACTED_SCHEMA_NAME);

        ImportGpkgEvent event = (ImportGpkgEvent) delegateExecution.getVariable(IMPORT_GPKG_EVENT);
        String businessKey = delegateExecution.getProcessBusinessKey();

        messageBus.produce(
                new ImportGpkgCopyDataEvent(businessKey,
                                            event.getDbName(),
                                            event.getCreatorLogin(),
                                            new ResourceQualifierDto(schema, currentTable.getTableName()),
                                            new ResourceQualifierDto(event.getTargetDatasetIdentifier(),
                                                                     createdTableName)
                ));
    }
}
