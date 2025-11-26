package ru.mycrg.integration_service.queue.handlers.gpkg;

import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.variable.VariableMap;
import org.camunda.bpm.engine.variable.Variables;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.gpkg.GpkgExportDetailsModel;
import ru.mycrg.data_service_contract.dto.PatchProcess;
import ru.mycrg.common_contracts.generated.gpkg.ExportGpkgPayload;
import ru.mycrg.common_contracts.generated.gpkg.GpkgExportType;
import ru.mycrg.data_service_contract.queue.request.UpdateProcessEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ExportGpkgEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.ERROR;
import static ru.mycrg.integration_service.bpmn.CamundaVariables.asJava;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;
import static ru.mycrg.integration_service.bpmn.enums.BpmnProcessKey.GPKG_EXPORT_PROCESS;

@Service
public class ExportGpkgEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(ExportGpkgEventHandler.class);

    private final RuntimeService bpmnRuntimeService;
    private final IMessageBusProducer messageBus;

    public ExportGpkgEventHandler(RuntimeService bpmnRuntimeService,
                                  IMessageBusProducer messageBus) {
        this.bpmnRuntimeService = bpmnRuntimeService;
        this.messageBus = messageBus;
    }

    @Override
    public String getEventType() {
        return ExportGpkgEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent messageBusEvent) {
        log.debug("Старт процесса экспорта GPKG!");

        ExportGpkgEvent event = null;
        String businessKey = UUID.randomUUID().toString();
        try {
            event = (ExportGpkgEvent) messageBusEvent;
            ExportGpkgPayload exportGpkgPayload = event.getPayload();

            if (exportGpkgPayload.getType() != GpkgExportType.PROJECT
                    && exportGpkgPayload.getType() != GpkgExportType.LAYER
                    && exportGpkgPayload.getType() != GpkgExportType.TABLE) {
                log.debug("Запрашиваемый тип объекта из payload: {}", exportGpkgPayload.getType());

                String msg = "Невозможно успешно завершить экспорт GPKG. " +
                        "Причина: Невозможно экспортировать запрошенный тип объектов!";

                messageBus.produce(
                        new UpdateProcessEvent(event.getProcessId(),
                                               businessKey,
                                               event.getDbName(),
                                               new PatchProcess(ERROR, createPatchBody(msg))));

                return;
            }

            VariableMap variables = Variables.createVariables()
                                             .putValue(EVENT_VAR_NAME, asJava(event))
                                             .putValue(EVENT_SUB_PAYLOAD_NAME, asJava(exportGpkgPayload))

                                             .putValue(TOKEN_VAR_NAME, event.getToken())
                                             .putValue(DB_NAME, event.getDbName())
                                             .putValue(PROCESS_ID_VAR_NAME, event.getProcessId())

                                             .putValue(ITERATION_COUNTER_VAR_NAME, 0)
                                             .putValue(BUSINESS_KEY_VAR_NAME, businessKey);

            bpmnRuntimeService.startProcessInstanceByKey(GPKG_EXPORT_PROCESS.getValue(),
                                                         businessKey,
                                                         variables);
        } catch (Exception e) {
            String msg = String.format("Не удалось стартовать процесс экспорта gpkg. Причина: %s", e.getMessage());
            log.debug(msg, e);

            messageBus.produce(
                    new UpdateProcessEvent(event.getProcessId(),
                                           businessKey,
                                           event.getDbName(),
                                           new PatchProcess(ERROR, createPatchBody(msg))));
        }
    }

    private static GpkgExportDetailsModel createPatchBody(String msg) {
        List<String> message = new ArrayList<>();
        message.add(msg);

        return new GpkgExportDetailsModel(message);
    }
}
