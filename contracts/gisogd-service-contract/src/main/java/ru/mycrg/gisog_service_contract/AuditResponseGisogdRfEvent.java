package ru.mycrg.gisog_service_contract;

import ru.mycrg.gisog_service_contract.dto.Document;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusResponseEvent;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import java.util.Map;

import static ru.mycrg.messagebus_contract.MessageBusProperties.GISOGD_AUDIT_RESPONSE_QUEUE;

public class AuditResponseGisogdRfEvent extends DefaultMessageBusResponseEvent {

    private Long orgId;
    private Document parent;
    private Map<String, String> content;

    public AuditResponseGisogdRfEvent() {
        // Required
    }

    public AuditResponseGisogdRfEvent(IMessageBusEvent event) {
        super(event, GISOGD_AUDIT_RESPONSE_QUEUE);
    }

    public AuditResponseGisogdRfEvent(AuditGisogdRfEvent event,
                                      Map<String, String> content) {
        super(event, GISOGD_AUDIT_RESPONSE_QUEUE);

        this.orgId = event.getOrgId();
        this.parent = event.getParent();
        this.content = content;
    }

    public Long getOrgId() {
        return orgId;
    }

    public void setOrgId(Long orgId) {
        this.orgId = orgId;
    }

    public Document getParent() {
        return parent;
    }

    public void setParent(Document parent) {
        this.parent = parent;
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
                "\"parent\":" + (parent == null ? "null" : parent) + ", " +
                "\"content\":" + (content == null ? "null" : "\"" + content + "\"") +
                "}";
    }
}
