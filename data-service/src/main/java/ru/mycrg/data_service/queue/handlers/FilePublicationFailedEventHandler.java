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
import ru.mycrg.data_service_contract.dto.publication.BaseWsProcess;
import ru.mycrg.data_service_contract.enums.FileType;
import ru.mycrg.data_service_contract.queue.request.FilePublicationEvent;
import ru.mycrg.data_service_contract.queue.response.FilePublicationFailedEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import static ru.mycrg.common_utils.CrgGlobalProperties.join;
import static ru.mycrg.data_service.util.JsonConverter.toJsonNode;
import static ru.mycrg.data_service_contract.enums.FileType.DXF;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.ERROR;
import static ru.mycrg.data_service_contract.enums.ProcessType.IMPORT;

@Service
public class FilePublicationFailedEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(FilePublicationFailedEventHandler.class);

    private final ProcessService processService;
    private final WsNotificationService wsNotificationService;

    public FilePublicationFailedEventHandler(ProcessService processService,
                                             WsNotificationService wsNotificationService) {
        this.processService = processService;
        this.wsNotificationService = wsNotificationService;
    }

    @Override
    public String getEventType() {
        return FilePublicationFailedEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        try {
            FilePublicationFailedEvent event = (FilePublicationFailedEvent) mqEvent;
            FilePublicationEvent initialEvent = event.getFilePublicationEvent();
            FileType type = initialEvent.getType();
            BaseWsProcess baseWsProcess = initialEvent.getBaseWsProcess();

            wsNotificationService.send(
                    new WsMessageDto<>(
                            join(IMPORT.name(), DXF.name()),
                            new WsImportModel(baseWsProcess.getWsMsgId(), ERROR, new ImportReport(), "ERROR")),
                    baseWsProcess.getWsUiId()
            );

            log.error("Выполнение публикации файла: '{}' потерпело неудачу. Причина: {}", type, event.getReason());

            ProcessModel processModel = baseWsProcess.getProcessModel();
            processService.error(processModel.getDbName(), processModel.getId(), toJsonNode(event));
        } catch (Exception e) {
            log.error("Не удалось корректно обработать FilePublicationFailedEvent. Причина: {}", e.getMessage());
        }
    }
}
