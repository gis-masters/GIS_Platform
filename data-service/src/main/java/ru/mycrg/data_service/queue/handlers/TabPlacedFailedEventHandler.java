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
import ru.mycrg.data_service_contract.queue.request.PlaceTabFileEvent;
import ru.mycrg.data_service_contract.queue.response.TabPlacedFailedEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import static ru.mycrg.common_utils.CrgGlobalProperties.join;
import static ru.mycrg.data_service.service.processes.FileType.TAB;
import static ru.mycrg.data_service.util.JsonConverter.toJsonNode;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.ERROR;
import static ru.mycrg.data_service_contract.enums.ProcessType.IMPORT;

@Service
public class TabPlacedFailedEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(TabPlacedFailedEventHandler.class);

    private final ProcessService processService;
    private final WsNotificationService wsNotificationService;

    public TabPlacedFailedEventHandler(ProcessService processService,
                                       WsNotificationService wsNotificationService) {
        this.processService = processService;
        this.wsNotificationService = wsNotificationService;
    }

    @Override
    public String getEventType() {
        return TabPlacedFailedEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        try {
            TabPlacedFailedEvent event = (TabPlacedFailedEvent) mqEvent;
            PlaceTabFileEvent requestEvent = event.getPlaceTabFileEvent();

            wsNotificationService.send(
                    new WsMessageDto<>(join(IMPORT.name(), TAB.name()),
                                       new WsImportModel(requestEvent.getWsMsgId(), ERROR, new ImportReport(),
                                                         "ERROR")),
                    requestEvent.getWsUiId()
            );

            log.error("Выполнение процесса потерпело неудачу. Причина: {}", event.getReason());

            ProcessModel processModel = requestEvent.getProcessModel();
            processService.error(processModel.getDbName(), processModel.getId(), toJsonNode(event));
        } catch (Exception e) {
            log.error("Не удалось корректно обработать TabPlacedFailedEvent. Причина: {}", e.getMessage());
        }
    }
}
