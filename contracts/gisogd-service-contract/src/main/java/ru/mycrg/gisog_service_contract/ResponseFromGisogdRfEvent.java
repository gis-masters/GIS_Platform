package ru.mycrg.gisog_service_contract;

import ru.mycrg.gisog_service_contract.dto.Document;
import ru.mycrg.gisog_service_contract.dto.Status;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusResponseEvent;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import java.util.Map;

import static ru.mycrg.messagebus_contract.MessageBusProperties.GISOGD_PUBLICATION_RESPONSE_QUEUE;

public class ResponseFromGisogdRfEvent extends DefaultMessageBusResponseEvent {

    private Long orgId;
    private Long taskId;
    private Document parent;

    private Status status;
    private Map<String, String> content;

    public ResponseFromGisogdRfEvent() {
        // Required
    }

    public ResponseFromGisogdRfEvent(IMessageBusEvent event) {
        super(event, GISOGD_PUBLICATION_RESPONSE_QUEUE);
    }

    public ResponseFromGisogdRfEvent(PublishToGisogdRfEvent event,
                                     Status status,
                                     Map<String, String> content) {
        super(event, GISOGD_PUBLICATION_RESPONSE_QUEUE);

        this.orgId = event.getOrgId();
        this.taskId = event.getTaskId();
        this.parent = event.getParent();
        this.status = status;
        this.content = content;
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

    @Override
    public String toString() {
        return "{" +
                "\"orgId\":" + (orgId == null ? "null" : "\"" + orgId + "\"") + ", " +
                "\"taskId\":" + (taskId == null ? "null" : "\"" + taskId + "\"") + ", " +
                "\"parent\":" + (parent == null ? "null" : parent) + ", " +
                "\"status\":" + (status == null ? "null" : status) + ", " +
                "\"content\":" + (content == null ? "null" : "\"" + content + "\"") +
                "}";
    }
}
