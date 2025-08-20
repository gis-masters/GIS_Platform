package ru.mycrg.data_service.queue.handlers;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dto.ProcessModel;
import ru.mycrg.data_service.dto.WsMessageDto;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.service.processes.ProcessService;
import ru.mycrg.data_service.service.WsNotificationService;
import ru.mycrg.data_service_contract.dto.import_.ImportMqResponse;
import ru.mycrg.data_service_contract.queue.response.ImportResponseEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import static ru.mycrg.data_service.util.JsonConverter.mapper;
import static ru.mycrg.data_service_contract.enums.ProcessType.IMPORT;

@Service
public class ImportHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(ImportHandler.class);

    private final ProcessService processService;
    private final WsNotificationService wsNotificationService;

    public ImportHandler(WsNotificationService wsNotificationService,
                         ProcessService processService) {
        this.wsNotificationService = wsNotificationService;
        this.processService = processService;
    }

    @Override
    public String getEventType() {
        return ImportResponseEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        final ImportResponseEvent event = (ImportResponseEvent) mqEvent;
        if (event.getProcessId() == null) {
            log.warn("Return invalid mqResponse");
        }

        Process process = processService.getById(event.getProcessId(), event.getDbName());
        log.info("catch import response event: {} / {}", event.getId(), event.getStatus());
        switch (event.getStatus()) {
            case TASK_ERROR:
            case TASK_DONE:
                addSubStep(process, event);
                break;
            case ERROR:
                processService.error(event.getDbName(), process);
                break;
            case DONE:
                processService.complete(event.getDbName(), process);
                break;
            default:
                log.warn("Not supported process status. {}", process);
        }

        JsonNode extraInfo = process.getExtra();
        String wsUiId = "null";
        if (extraInfo != null) {
            wsUiId = extraInfo.asText();
        }

        wsNotificationService.send(new WsMessageDto<>(IMPORT.name(), event), wsUiId);
    }

    private void addSubStep(Process process, ImportResponseEvent event) {
        try {
            ProcessModel subProcess = new ProcessModel();
            if (!event.getPayload().equals("")) {
                ImportMqResponse rPayload = mapper.convertValue(event.getPayload(), ImportMqResponse.class);
                subProcess = new ProcessModel(rPayload.getTargetLayer(), event.getStatus(), event.getError());
            } else if (event.getDescription() != null) {
                subProcess = new ProcessModel(event.getStatus(), event.getError());
            } else {
                log.warn("Task for processId: {} not have any description/payload?", process.getId());
            }

            processService.addTask(process, subProcess);
        } catch (Exception e) {
            log.error("Failed add subStep to process / Error: {}", e.getMessage());
        }
    }
}
