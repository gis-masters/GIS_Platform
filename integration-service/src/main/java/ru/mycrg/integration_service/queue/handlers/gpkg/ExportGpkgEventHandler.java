package ru.mycrg.integration_service.queue.handlers.gpkg;

import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.variable.VariableMap;
import org.camunda.bpm.engine.variable.Variables;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.export.ExportGpkgPayload;
import ru.mycrg.common_contracts.generated.data_service.gpkg.export.GpkgExportType;
import ru.mycrg.data_service_contract.queue.request.gpkg.ExportGpkgEvent;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgProcessContext;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgReportManager;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import java.util.UUID;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.ERROR;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.PENDING;
import static ru.mycrg.integration_service.bpmn.CamundaVariables.asJava;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;
import static ru.mycrg.integration_service.bpmn.enums.BpmnProcessKey.GPKG_EXPORT_PROCESS;

@Service
public class ExportGpkgEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(ExportGpkgEventHandler.class);

    private final RuntimeService bpmnRuntimeService;
    private final GpkgReportManager reportManager;

    public ExportGpkgEventHandler(RuntimeService bpmnRuntimeService,
                                  GpkgReportManager reportManager) {
        this.bpmnRuntimeService = bpmnRuntimeService;
        this.reportManager = reportManager;
    }

    @Override
    public String getEventType() {
        return ExportGpkgEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent messageBusEvent) {
        log.debug("Старт процесса экспорта GPKG!");

        String businessKey = UUID.randomUUID().toString();

        ExportGpkgEvent event = (ExportGpkgEvent) messageBusEvent;
        GpkgProcessContext rabbitDto = new GpkgProcessContext(event.getProcessId(),
                                                              event.getDbName(),
                                                              ERROR);

        try {
            ExportGpkgPayload exportGpkgPayload = event.getPayload();

            if (exportGpkgPayload.getType() != GpkgExportType.PROJECT
                    && exportGpkgPayload.getType() != GpkgExportType.LAYER
                    && exportGpkgPayload.getType() != GpkgExportType.TABLE) {
                log.debug("Запрашиваемый тип объекта из payload: {}", exportGpkgPayload.getType());

                String msg = "Невозможно успешно завершить экспорт GPKG. " +
                        "Причина: Невозможно экспортировать запрошенный тип объектов!";

                reportManager.finalizeReport(rabbitDto, msg);

                return;
            }

            rabbitDto.setProcessStatus(PENDING);
            reportManager.createReport(rabbitDto, event);

            VariableMap variables = Variables.createVariables()
                                             .putValue(EXPORT_GPKG_COUNT_HTTP_ERRORS, 0)

                                             .putValue(EXPORT_GPKG_EVENT, asJava(event))
                                             .putValue(EXPORT_GPKG_SUB_PAYLOAD, asJava(exportGpkgPayload));

            bpmnRuntimeService.startProcessInstanceByKey(GPKG_EXPORT_PROCESS.getValue(),
                                                         businessKey,
                                                         variables);
        } catch (Exception e) {
            String msg = String.format("Не удалось стартовать процесс экспорта gpkg. Причина: %s", e.getMessage());
            log.debug(msg, e);

            reportManager.finalizeReport(rabbitDto, msg);
        }
    }
}
