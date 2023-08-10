package ru.mycrg.gisog_service_contract;

import ru.mycrg.gisog_service_contract.dto.Document;
import ru.mycrg.gisog_service_contract.dto.Status;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import java.util.Map;

import static ru.mycrg.messagebus_contract.MessageBusProperties.GISOGD_TO_DATA_QUEUE;

public class ResponseFromGisogdRfEvent extends DefaultMessageBusRequestEvent {

    private Long taskId;

    private Document parent;
    private Status status;
    private Map<String, String> content;

    public ResponseFromGisogdRfEvent(IMessageBusEvent event) {
        super(event.getId(), GISOGD_TO_DATA_QUEUE);
    }

    public ResponseFromGisogdRfEvent(IMessageBusEvent event,
                                     Long taskId,
                                     Document parent,
                                     Status status,
                                     Map<String, String> content) {
        super(event.getId(), GISOGD_TO_DATA_QUEUE);

        this.taskId = taskId;
        this.parent = parent;
        this.status = status;
        this.content = content;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public Document getParent() {
        return parent;
    }

    public void setParent(Document parent) {
        this.parent = parent;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Map<String, String> getContent() {
        return content;
    }

    public void setContent(Map<String, String> content) {
        this.content = content;
    }
}
