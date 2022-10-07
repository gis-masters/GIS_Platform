package ru.mycrg.data_service.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dto.WsMessageDto;
import ru.mycrg.data_service.service.WsNotificationService;
import ru.mycrg.data_service.service.import_.model.WsImportModel;
import ru.mycrg.data_service.service.processes.ProcessService;
import ru.mycrg.data_service_contract.dto.ImportReport;
import ru.mycrg.data_service_contract.dto.ProcessModel;
import ru.mycrg.data_service_contract.queue.request.PlaceDxfFileEvent;
import ru.mycrg.data_service_contract.queue.response.DxfPlacedFailedEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import static ru.mycrg.common_utils.CrgGlobalProperties.join;
import static ru.mycrg.data_service.service.processes.FileType.DXF;
import static ru.mycrg.data_service.util.JsonConverter.toJsonNode;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.ERROR;
import static ru.mycrg.data_service_contract.enums.ProcessType.IMPORT;

@Service
public class DxfPlacedFailedEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(DxfPlacedFailedEventHandler.class);

    private final ProcessService processService;
    private final WsNotificationService wsNotificationService;

    public DxfPlacedFailedEventHandler(ProcessService processService,
                                       WsNotificationService wsNotificationService) {
        this.processService = processService;
        this.wsNotificationService = wsNotificationService;
    }

    @Override
    public String getEventType() {
        return "DxfPlacedFailedEvent";
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        try {
            DxfPlacedFailedEvent event = (DxfPlacedFailedEvent) mqEvent;
            PlaceDxfFileEvent requestEvent = event.getPlaceDxfFileEvent();

            wsNotificationService.send(
                    new WsMessageDto<>(join(IMPORT.name(), DXF.name()),
                                       new WsImportModel(requestEvent.getWsMsgId(), ERROR, new ImportReport(),
                                                         "ERROR")),
                    requestEvent.getWsUiId()
            );

            log.error("Выполненение процесса потерпело неудачу. Причина: {}", event.getReason());

            ProcessModel processModel = requestEvent.getProcessModel();
            processService.error(processModel.getDbName(), processModel.getId(), toJsonNode(event));
        } catch (Exception e) {
            log.error("Не удалось корректно обработать DxfPlacedFailedEvent. Причина: {}", e.getMessage());
        }
    }
}
