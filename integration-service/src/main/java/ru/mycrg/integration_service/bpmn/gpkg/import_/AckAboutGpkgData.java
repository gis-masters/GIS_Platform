package ru.mycrg.integration_service.bpmn.gpkg.import_;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessReport;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgPayloadData;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgTablesData;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgAckInfoEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgReportManager;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgProcessContext;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("ackAboutGpkgData")
public class AckAboutGpkgData implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(AckAboutGpkgData.class);

    private final IMessageBusProducer messageBus;
    private final GpkgReportManager reportManager;

    public AckAboutGpkgData(IMessageBusProducer messageBus, GpkgReportManager reportManager) {
        this.messageBus = messageBus;
        this.reportManager = reportManager;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.debug("Класс {} начал работать.", AckAboutGpkgData.class.getSimpleName());

        GpkgProcessReport importReport = (GpkgProcessReport) delegateExecution.getVariable(
                EVENT_IMPORT_GPKG_REPORT_NAME);

        ImportGpkgEvent event = (ImportGpkgEvent) delegateExecution.getVariable(EVENT_VAR_NAME);
        String schemaName = (String) delegateExecution.getVariable(EXTRACTED_SCHEMA_NAME);
        GpkgTablesData currentTable = (GpkgTablesData) delegateExecution.getVariable(ENTITY_ID_VAR_NAME);
        String businessKey = (String) delegateExecution.getVariable(BUSINESS_KEY_VAR_NAME);

        String currentTableOldName = currentTable.getTableGpkgIdentifier();

        GpkgProcessContext rabbitDto = new GpkgProcessContext(event.getProcessId(),
                                                              event.getDbName(),
                                                              TASK_DONE);

        reportManager.createTableReport(rabbitDto,
                                        importReport,
                                        event.getTargetDatasetIdentifier(),
                                        currentTableOldName);

        messageBus.produce(new ImportGpkgAckInfoEvent(businessKey,
                                                      event.getDbName(),
                                                      event.getFileId(),
                                                      schemaName,
                                                      currentTableOldName));
    }
}
