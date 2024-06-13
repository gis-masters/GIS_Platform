package ru.mycrg.auth_service_contract.events.request;

import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.ORG_REQUEST_FANOUT;
import static ru.mycrg.messagebus_contract.MessageBusProperties.ORG_REQUEST_KEY;

public class OrganizationBaseRequestEvent extends DefaultMessageBusRequestEvent {

    private Long orgId;
    private String rootToken;
    private String ownerToken;

    public OrganizationBaseRequestEvent() {
        super();
    }

    public OrganizationBaseRequestEvent(Long orgId, String rootToken, String ownerToken) {
        super(UUID.randomUUID(), ORG_REQUEST_FANOUT, ORG_REQUEST_KEY);

        this.orgId = orgId;
        this.rootToken = rootToken;
        this.ownerToken = ownerToken;
    }

    public Long getOrgId() {
        return orgId;
    }

    public void setOrgId(Long orgId) {
        this.orgId = orgId;
    }

    public String getRootToken() {
        return rootToken;
    }

    public void setRootToken(String rootToken) {
        this.rootToken = rootToken;
    }

    public String getOwnerToken() {
        return ownerToken;
    }

    public void setOwnerToken(String ownerToken) {
        this.ownerToken = ownerToken;
    }
}
