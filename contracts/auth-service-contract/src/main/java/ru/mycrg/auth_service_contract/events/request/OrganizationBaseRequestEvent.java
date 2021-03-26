package ru.mycrg.auth_service_contract.events.request;

import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.ORG_REQUEST_FANOUT;
import static ru.mycrg.messagebus_contract.MessageBusProperties.ORG_REQUEST_KEY;

public class OrganizationBaseRequestEvent extends DefaultMessageBusRequestEvent {

    private Long orgId;
    private String token;

    public OrganizationBaseRequestEvent() {
        super();
    }

    public OrganizationBaseRequestEvent(Long orgId, String token) {
        super(UUID.randomUUID(), ORG_REQUEST_FANOUT, ORG_REQUEST_KEY);

        this.orgId = orgId;
        this.token = token;
    }

    public Long getOrgId() {
        return orgId;
    }

    public void setOrgId(Long orgId) {
        this.orgId = orgId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
