package ru.mycrg.data_service.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dto.TaskModel;
import ru.mycrg.data_service.dto.WsMessageDto;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.service.ProcessService;
import ru.mycrg.data_service.service.WsNotificationService;
import ru.mycrg.data_service_contract.queue.response.ExportResponseEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import static ru.mycrg.data_service_contract.enums.ProcessType.EXPORT;

@Service
public class ExportHandler implements IEventHandler {

    private static final Logger log = LoggerFactory.getLogger(ExportHandler.class);

    private final ProcessService processService;
    private final WsNotificationService wsNotificationService;

    public ExportHandler(WsNotificationService wsNotificationService,
                         ProcessService processService) {
        this.wsNotificationService = wsNotificationService;
        this.processService = processService;
    }

    @Override
    public String getEventType() {
        return "ExportResponseEvent";
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        final ExportResponseEvent event = (ExportResponseEvent) mqEvent;
        if (event.getProcessId() == null) {
            log.warn("Return invalid response");
        }

        Process process = processService.getById(event.getProcessId(), event.getDbName());
        switch (event.getStatus()) {
            case PENDING:
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

        wsNotificationService.send(new WsMessageDto<>(EXPORT, event), processService.getWsUiId(process));
    }

    private void addSubStep(Process process, ExportResponseEvent responseEvent) {
        try {
            if (responseEvent.getPayload() == null) {
                return;
            }

            TaskModel subProcess = new TaskModel(
                    responseEvent.getPayload().toString(),
                    responseEvent.getStatus(),
                    responseEvent.getError());

            processService.addTask(process, subProcess);
        } catch (Exception e) {
            log.error("Failed add subStep to process / Error: {}", e.getMessage());
        }
    }
}
