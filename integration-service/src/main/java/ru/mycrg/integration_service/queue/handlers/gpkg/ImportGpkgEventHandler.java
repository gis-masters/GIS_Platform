package ru.mycrg.integration_service.queue.handlers.gpkg;

import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.variable.VariableMap;
import org.camunda.bpm.engine.variable.Variables;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgPayloadData;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessReport;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgClearTemplatesEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgProcessContext;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgReportManager;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import java.util.UUID;

import static ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgTableType.VECTOR_DATA_TABLE;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.ERROR;
import static ru.mycrg.integration_service.bpmn.CamundaVariables.asJava;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;
import static ru.mycrg.integration_service.bpmn.enums.BpmnProcessKey.GPKG_IMPORT_PROCESS;

@Service
public class ImportGpkgEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(ImportGpkgEventHandler.class);

    private final RuntimeService bpmnRuntimeService;
    private final IMessageBusProducer messageBus;
    private final GpkgReportManager reportManager;

    public ImportGpkgEventHandler(RuntimeService bpmnRuntimeService,
                                  IMessageBusProducer messageBus,
                                  GpkgReportManager reportManager) {
        this.bpmnRuntimeService = bpmnRuntimeService;
        this.messageBus = messageBus;
        this.reportManager = reportManager;
    }

    @Override
    public String getEventType() {
        return ImportGpkgEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent messageBusEvent) {
        log.debug("Старт процесса импорта GPKG!");
        ImportGpkgEvent event = (ImportGpkgEvent) messageBusEvent;

        GpkgProcessReport importReport = event.getGpkgProcessReport();

        GpkgPayloadData subPayload = importReport.getPayload();

        String businessKey = UUID.randomUUID().toString();

        long neededCyclesCount = subPayload.getTablesInGpkg().stream()
                                           .filter(table -> table.getType() == VECTOR_DATA_TABLE)
                                           .count();

        try {
            VariableMap variables = Variables.createVariables()
                                             .putValue(EVENT_VAR_NAME, asJava(event))
                                             .putValue(EVENT_IMPORT_GPKG_REPORT_NAME, asJava(importReport))

                                             .putValue(NEEDED_CYCLES_COUNT_VAR_NAME, neededCyclesCount)
                                             .putValue(PERFORMED_CYCLES_COUNT_VAR_NAME, 0)
                                             .putValue(ITERATION_COUNTER_VAR_NAME, 0)
                                             .putValue(FILES_CYCLES_COUNT_VAR_NAME, 0)
                                             .putValue(FILES_CYCLES_COUNT_DONE_VAR_NAME, 0)
                                             .putValue(BUSINESS_KEY_VAR_NAME, businessKey);

            bpmnRuntimeService.startProcessInstanceByKey(GPKG_IMPORT_PROCESS.getValue(),
                                                         businessKey,
                                                         variables);
        } catch (Exception e) {
            String msg = String.format("Процесс импорта gpkg остановлен. Причина: %s", e.getMessage());
            log.debug(msg, e);

            messageBus.produce(new ImportGpkgClearTemplatesEvent(event.getDbName(),
                                                                 "empty",
                                                                 event.getFileId()));

            GpkgProcessContext processContext = new GpkgProcessContext(event.getProcessId(),
                                                                       event.getDbName(),
                                                                       ERROR);

            reportManager.finalizeReport(processContext, msg);
        }
    }
}
