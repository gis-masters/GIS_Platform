package ru.mycrg.integration_service.bpmn.gpkg.import_;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.GpkgImportReport;
import ru.mycrg.common_contracts.generated.data_service.gpkg.GpkgImportedTable;
import ru.mycrg.common_contracts.generated.data_service.gpkg.GpkgPayloadData;
import ru.mycrg.common_contracts.generated.data_service.gpkg.GpkgTablesData;
import ru.mycrg.data_service_contract.dto.PatchProcess;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgAckInfoEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.data_service_contract.queue.request.UpdateProcessEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.List;

import static ru.mycrg.common_contracts.generated.data_service.gpkg.GpkgProcessStatus.ACTIVE;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

/**
 * Класс для импорта GPKG. (Пятый в цепочке)
 *
 * <h3>Репорт на этом этапе:</h3>
 * <ul>
 *   <li>Количество и состав таблиц которые внутри gpkg</li>
 *   <li>Есть описание сущности "Проект"</li>
 *   <li>С каждым тиком цикла будет прибавляться информация о таблицах, слоях, стилях</li>
 * </ul>
 */

@Service("ackAboutGpkgData")
public class AckAboutGpkgData implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(AckAboutGpkgData.class);

    private final IMessageBusProducer messageBus;

    public AckAboutGpkgData(IMessageBusProducer messageBus) {
        this.messageBus = messageBus;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.debug("Класс {} начал работать.", AckAboutGpkgData.class.getSimpleName());

        GpkgImportReport importReport = (GpkgImportReport) delegateExecution.getVariable(
                EVENT_IMPORT_GPKG_REPORT_NAME);
        log.debug("Отслеживание json импорт репорта: {}", importReport);

        ImportGpkgEvent event = (ImportGpkgEvent) delegateExecution.getVariable(EVENT_VAR_NAME);
        String schemaName = (String) delegateExecution.getVariable(EXTRACTED_SCHEMA_NAME);
        GpkgTablesData currentTable = (GpkgTablesData) delegateExecution.getVariable(ENTITY_ID_VAR_NAME);
        String businessKey = (String) delegateExecution.getVariable(BUSINESS_KEY_VAR_NAME);

        String currentTableOldName = currentTable.getTableGpkgIdentifier();

        //Наполним репорт
        GpkgPayloadData reportPayload = importReport.getPayload();
        List<GpkgImportedTable> tables = reportPayload.getTables();
        GpkgImportedTable table = new GpkgImportedTable();
        table.setStatus(ACTIVE);
        table.setDataset(event.getTargetDatasetIdentifier());
        table.setOldTableIdentifier(currentTableOldName);
        tables.add(table);
        reportPayload.setTables(tables);
        importReport.setPayload(reportPayload);

        PatchProcess newDetails = new PatchProcess(TASK_DONE, importReport);
        messageBus.produce(new UpdateProcessEvent(event.getProcessId(),
                                                  businessKey,
                                                  event.getDbName(),
                                                  newDetails));

        messageBus.produce(new ImportGpkgAckInfoEvent(businessKey,
                                                      event.getDbName(),
                                                      schemaName,
                                                      currentTableOldName));
    }
}
