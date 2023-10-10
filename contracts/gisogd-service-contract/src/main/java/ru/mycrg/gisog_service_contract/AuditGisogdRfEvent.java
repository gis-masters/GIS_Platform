package ru.mycrg.gisog_service_contract;

import ru.mycrg.gisog_service_contract.dto.Document;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.GISOGD_AUDIT_QUEUE;

public class AuditGisogdRfEvent extends DefaultMessageBusRequestEvent {

    private Long orgId;
    private Document parent;

    public AuditGisogdRfEvent() {
        // Required
    }

    public AuditGisogdRfEvent(Long orgId, Document parent) {
        super(UUID.randomUUID(), GISOGD_AUDIT_QUEUE);

        this.orgId = orgId;
        this.parent = parent;
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

    @Override
    public String toString() {
        return "{" +
                "\"orgId\":" + (orgId == null ? "null" : "\"" + orgId + "\"") + ", " +
                "\"parent\":" + (parent == null ? "null" : parent) +
                "}";
    }
}
