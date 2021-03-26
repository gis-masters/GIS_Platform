package ru.mycrg.auth_service_contract.events.response;

import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import static ru.mycrg.messagebus_contract.MessageBusProperties.*;

public class OrganizationBaseResponseEvent extends DefaultMessageBusRequestEvent {

    private Long orgId;
    private String token;

    public OrganizationBaseResponseEvent() {
        super();
    }

    public OrganizationBaseResponseEvent(IMessageBusEvent event, Long orgId, String token) {
        super(event.getId(), ORG_RESPONSE_FANOUT, ORG_RESPONSE_KEY);

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
