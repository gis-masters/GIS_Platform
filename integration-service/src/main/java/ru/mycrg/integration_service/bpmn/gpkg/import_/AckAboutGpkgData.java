package ru.mycrg.integration_service.bpmn.gpkg.import_;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgImportReport;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgPayloadData;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgTablesData;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgAckInfoEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.integration_service.bpmn.gpkg.GpkgImportReportManager;
import ru.mycrg.integration_service.bpmn.gpkg.ReportSendConfigDto;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

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
    private final GpkgImportReportManager reportManager;

    public AckAboutGpkgData(IMessageBusProducer messageBus, GpkgImportReportManager reportManager) {
        this.messageBus = messageBus;
        this.reportManager = reportManager;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.debug("Класс {} начал работать.", AckAboutGpkgData.class.getSimpleName());

        GpkgImportReport importReport = (GpkgImportReport) delegateExecution.getVariable(
                EVENT_IMPORT_GPKG_REPORT_NAME);

        ImportGpkgEvent event = (ImportGpkgEvent) delegateExecution.getVariable(EVENT_VAR_NAME);
        String schemaName = (String) delegateExecution.getVariable(EXTRACTED_SCHEMA_NAME);
        GpkgTablesData currentTable = (GpkgTablesData) delegateExecution.getVariable(ENTITY_ID_VAR_NAME);
        String businessKey = (String) delegateExecution.getVariable(BUSINESS_KEY_VAR_NAME);

        String currentTableOldName = currentTable.getTableGpkgIdentifier();

        //Наполним репорт
        GpkgPayloadData payload = importReport.getPayload();

        ReportSendConfigDto rabbitDto = new ReportSendConfigDto(event.getProcessId(),
                                                                event.getDbName(),
                                                                businessKey,
                                                                TASK_DONE);

        reportManager.createTableReport(rabbitDto,
                                        payload,
                                        event.getTargetDatasetIdentifier(),
                                        currentTableOldName);

        messageBus.produce(new ImportGpkgAckInfoEvent(businessKey,
                                                      event.getDbName(),
                                                      event.getFileId(),
                                                      schemaName,
                                                      currentTableOldName));
    }
}
