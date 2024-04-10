package ru.mycrg.data_service_contract.queue.response;

import ru.mycrg.data_service_contract.queue.request.FilePublicationEvent;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusResponseEvent;

import static ru.mycrg.messagebus_contract.MessageBusProperties.INTEGRATION_TO_DATA_QUEUE;

public class FilePublicationFailedEvent extends DefaultMessageBusResponseEvent {

    private String reason;
    private FilePublicationEvent filePublicationEvent;

    public FilePublicationFailedEvent() {
        super();
    }

    public FilePublicationFailedEvent(FilePublicationEvent filePublicationEvent, String reason) {
        super(filePublicationEvent, INTEGRATION_TO_DATA_QUEUE);

        this.reason = reason;
        this.filePublicationEvent = filePublicationEvent;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public FilePublicationEvent getFilePublicationEvent() {
        return filePublicationEvent;
    }

    public void setPlaceDxfFileEvent(FilePublicationEvent filePublicationEvent) {
        this.filePublicationEvent = filePublicationEvent;
    }
}
