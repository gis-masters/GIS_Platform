package ru.mycrg.gisog_service_contract;

import ru.mycrg.gisog_service_contract.dto.Document;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.List;
import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.DATA_TO_GISOGD_QUEUE;

public class PublishToGisogdRfEvent extends DefaultMessageBusRequestEvent {

    private Long taskId;

    private Document parent;
    private List<Document> children;

    public PublishToGisogdRfEvent(Long taskId,
                                  Document parent,
                                  List<Document> children) {
        super(UUID.randomUUID(), DATA_TO_GISOGD_QUEUE);

        this.taskId = taskId;

        this.parent = parent;
        this.children = children;
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

    public List<Document> getChildren() {
        return children;
    }

    public void setChildren(List<Document> children) {
        this.children = children;
    }
}
