package ru.mycrg.gisog_service_contract;

import ru.mycrg.gisog_service_contract.dto.Document;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.List;
import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.GISOGD_PUBLICATION_QUEUE;

public class PublishToGisogdRfEvent extends DefaultMessageBusRequestEvent {

    private Long orgId;
    private Long taskId;

    private Document parent;
    private List<Document> children;

    public PublishToGisogdRfEvent() {
        // Required
    }

    public PublishToGisogdRfEvent(Long orgId,
                                  Long taskId,
                                  Document parent,
                                  List<Document> children) {
        super(UUID.randomUUID(), GISOGD_PUBLICATION_QUEUE);

        this.taskId = taskId;
        this.orgId = orgId;

        this.parent = parent;
        this.children = children;
    }

    public Long getOrgId() {
        return orgId;
    }

    public void setOrgId(Long orgId) {
        this.orgId = orgId;
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

    @Override
    public String toString() {
        return "{" +
                "\"orgId\":" + (orgId == null ? "null" : "\"" + orgId + "\"") + ", " +
                "\"taskId\":" + (taskId == null ? "null" : "\"" + taskId + "\"") + ", " +
                "\"parent\":" + (parent == null ? "null" : parent) + ", " +
                "\"children\":" + (children == null ? "null" : children) +
                "}";
    }
}
