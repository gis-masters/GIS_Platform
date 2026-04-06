package ru.mycrg.data_service.queue.handlers;

 
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.service.processes.ProcessService;
import ru.mycrg.data_service_contract.dto.PatchProcess;
import ru.mycrg.data_service_contract.queue.request.UpdateProcessEvent;
import ru.mycrg.http_client.JsonConverter;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;
import tools.jackson.databind.JsonNode;

@Service
public class PatchProcessHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(PatchProcessHandler.class);

    private final ProcessService processService;

    public PatchProcessHandler(ProcessService processService) {
        this.processService = processService;
    }

    @Override
    public String getEventType() {
        return UpdateProcessEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        UpdateProcessEvent event = (UpdateProcessEvent) mqEvent;
        PatchProcess patchProcess = event.getPayload();

        JsonNode detailsAsJsonNode = JsonConverter.toJsonNode(patchProcess.getDetails());
        processService.updateProcess(event.getProcessId(),
                                     patchProcess.getStatus(),
                                     event.getDbName(),
                                     detailsAsJsonNode);
    }
}
