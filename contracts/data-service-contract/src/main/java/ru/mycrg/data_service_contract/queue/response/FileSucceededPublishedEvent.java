package ru.mycrg.data_service_contract.queue.response;

import ru.mycrg.data_service_contract.queue.request.FilePublicationEvent;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusResponseEvent;

import java.io.Serializable;

import static ru.mycrg.messagebus_contract.MessageBusProperties.INTEGRATION_TO_DATA_QUEUE;

public class FileSucceededPublishedEvent extends DefaultMessageBusResponseEvent implements Serializable {

    private FilePublicationEvent filePublicationEvent;

    public FileSucceededPublishedEvent() {
        super();
    }

    public FileSucceededPublishedEvent(FilePublicationEvent filePublicationEvent) {
        super(filePublicationEvent, INTEGRATION_TO_DATA_QUEUE);

        this.filePublicationEvent = filePublicationEvent;
    }

    public FilePublicationEvent getFilePublicationEvent() {
        return filePublicationEvent;
    }

    public void setFilePublicationEvent(FilePublicationEvent filePublicationEvent) {
        this.filePublicationEvent = filePublicationEvent;
    }

    @Override
    public String toString() {
        return "{" +
                "\"filePublicationEvent\":" + (filePublicationEvent == null ? "null" : filePublicationEvent) +
                "}";
    }
}
