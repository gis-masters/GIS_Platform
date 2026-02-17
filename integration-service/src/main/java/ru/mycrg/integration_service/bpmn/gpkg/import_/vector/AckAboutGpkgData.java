package ru.mycrg.integration_service.bpmn.gpkg.import_.vector;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.contents.GpkgContentsFeatures;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessReport;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgAckInfoEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgProcessContext;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgReportManager;
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

        ImportGpkgEvent event = (ImportGpkgEvent) delegateExecution.getVariable(IMPORT_GPKG_EVENT);
        GpkgProcessContext rabbitDto = new GpkgProcessContext(event.getProcessId(),
                                                              event.getDbName(),
                                                              TASK_DONE);

        GpkgContentsFeatures currentTable = (GpkgContentsFeatures) delegateExecution
                .getVariable(IMPORT_GPKG_CURRENT_VECTOR_TABLE);
        String currentTableOldName = currentTable.getTableName();

        GpkgProcessReport importReport = (GpkgProcessReport) delegateExecution.getVariable(
                IMPORT_GPKG_EVENT_REPORT);

        reportManager.createTableReport(rabbitDto,
                                        importReport,
                                        event.getTargetDatasetIdentifier(),
                                        currentTableOldName);

        String schemaName = (String) delegateExecution.getVariable(IMPORT_GPKG_EXTRACTED_SCHEMA_NAME);
        String businessKey = delegateExecution.getProcessBusinessKey();
        messageBus.produce(new ImportGpkgAckInfoEvent(businessKey,
                                                      event.getDbName(),
                                                      event.getFileId(),
                                                      schemaName,
                                                      currentTableOldName));
    }
}
