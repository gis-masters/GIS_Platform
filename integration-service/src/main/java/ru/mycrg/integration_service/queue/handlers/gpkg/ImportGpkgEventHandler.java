package ru.mycrg.integration_service.queue.handlers.gpkg;

import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.variable.VariableMap;
import org.camunda.bpm.engine.variable.Variables;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.contents.GpkgContentsBaseDto;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessReport;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgClearTemplatesEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgProcessContext;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgReportManager;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

import static ru.mycrg.common_contracts.enums.GpkgContentsDataType.FEATURES;
import static ru.mycrg.common_contracts.enums.GpkgContentsDataType.TILES;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.ERROR;
import static ru.mycrg.integration_service.bpmn.CamundaVariables.asJava;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;
import static ru.mycrg.integration_service.bpmn.enums.BpmnProcessKey.GPKG_IMPORT_PROCESS;
import static ru.mycrg.integration_service.bpmn.enums.GpkgImportProcessPermittedStatus.DEFAULT;

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
        try {
            GpkgProcessReport importReport = event.getGpkgProcessReport();

            List<GpkgContentsBaseDto> dataToImport = importReport.getPayload().getGpkgContents();
            String workerType = getWorkerType(dataToImport);

            VariableMap variables = Variables.createVariables()
                                             .putValue(IMPORT_GPKG_COUNT_HTTP_ERRORS, 0)

                                             .putValue(IMPORT_GPKG_EVENT, asJava(event))
                                             .putValue(IMPORT_GPKG_EVENT_REPORT, asJava(importReport))

                                             .putValue(CHECK_STATUS_VAR_NAME, DEFAULT.getValue())

                                             .putValue(IMPORT_GPKG_NEEDED_CYCLES_COUNT_RASTER, 0)
                                             .putValue(IMPORT_GPKG_PERFORMED_CYCLES_COUNT_RASTER, 0)

                                             .putValue(IMPORT_GPKG_WORKER_TYPE, workerType);

            String businessKey = String.valueOf(UUID.randomUUID());
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

    /**
     * Было создано два Call Activity для отдельной (возможно многопоточной) работы с растрами и векторами. Чтобы не
     * запускать кубик который нам может не понадобиться -> фильтруем объекты. Можно было бы внутри каждого кубика
     * делать "быстрый выход если не с чем работать", но текущее место кажется корректным.
     */
    private String getWorkerType(List<GpkgContentsBaseDto> dataToImport) {
        boolean hasRaster = dataToImport.stream()
                                        .map(GpkgContentsBaseDto::getDataType)
                                        .filter(Objects::nonNull)
                                        .anyMatch(dataType -> TILES == dataType);

        boolean hasVector = dataToImport.stream()
                                        .map(GpkgContentsBaseDto::getDataType)
                                        .filter(Objects::nonNull)
                                        .anyMatch(dataType -> FEATURES == dataType);

        return hasRaster && !hasVector ? TILES.getDataTypeAsString() :
                hasVector && !hasRaster ? FEATURES.getDataTypeAsString() :
                        FEATURES.getDataTypeAsString() + "And" + TILES.getDataTypeAsString();
    }
}
