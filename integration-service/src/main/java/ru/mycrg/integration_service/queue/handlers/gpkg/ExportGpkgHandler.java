package ru.mycrg.integration_service.queue.handlers.gpkg;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.variable.VariableMap;
import org.camunda.bpm.engine.variable.Variables;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.gpkg.GkpgExportDetailsModel;
import ru.mycrg.common_contracts.generated.gpkg.MessageFromExport;
import ru.mycrg.data_service_contract.dto.ExportRequestModel;
import ru.mycrg.data_service_contract.dto.PatchProcess;
import ru.mycrg.data_service_contract.dto.gpkg.GpkgExportTypes;
import ru.mycrg.data_service_contract.dto.gpkg.GpkgPayload;
import ru.mycrg.data_service_contract.queue.request.gpkg.ExportGpkgEvent;
import ru.mycrg.data_service_contract.queue.request.UpdateProcessEvent;
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
public class ExportGpkgHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(ExportGpkgHandler.class);

    private final RuntimeService bpmnRuntimeService;
    private final ObjectMapper objectMapper;
    private final IMessageBusProducer messageBus;

    public ExportGpkgHandler(RuntimeService bpmnRuntimeService,
                             ObjectMapper objectMapper,
                             IMessageBusProducer messageBus) {
        this.bpmnRuntimeService = bpmnRuntimeService;
        this.objectMapper = objectMapper;
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
        ExportRequestModel eventPayload;
        String businessKey = UUID.randomUUID().toString();
        try {
            event = (ExportGpkgEvent) messageBusEvent;
            eventPayload = objectMapper.convertValue(event.getPayload(), ExportRequestModel.class);
            GpkgPayload gpkgPayload = objectMapper.convertValue(eventPayload.getPayload(), GpkgPayload.class);

            if (gpkgPayload.getType() != GpkgExportTypes.PROJECT
                    && gpkgPayload.getType() != GpkgExportTypes.LAYER
                    && gpkgPayload.getType() != GpkgExportTypes.TABLE) {
                log.debug("Запрашиваемый тип объекта из payload: {}", gpkgPayload.getType());

                String msg = "Невозможно успешно завершить экспорт GPKG. " +
                        "Причина: Невозможно экспортировать запрошенный тип объектов!";

                PatchProcess newDetails = new PatchProcess(ERROR, createPatchBody(msg));
                messageBus.produce(new UpdateProcessEvent(event.getProcessId(),
                                                          businessKey,
                                                          event.getDbName(),
                                                          newDetails));

                return;
            }

            VariableMap variables = Variables.createVariables()
                                             .putValue(EVENT_VAR_NAME, asJava(event))
                                             .putValue(EVENT_SUB_PAYLOAD_NAME, asJava(gpkgPayload))

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

            PatchProcess newDetails = new PatchProcess(ERROR, createPatchBody(msg));
            messageBus.produce(new UpdateProcessEvent(event.getProcessId(),
                                                      businessKey,
                                                      event.getDbName(),
                                                      newDetails));
        }
    }

    private static GkpgExportDetailsModel createPatchBody(String msg) {
        List<MessageFromExport> message = new ArrayList<>();
        message.add(new MessageFromExport(msg));

        return new GkpgExportDetailsModel(message);
    }
}
