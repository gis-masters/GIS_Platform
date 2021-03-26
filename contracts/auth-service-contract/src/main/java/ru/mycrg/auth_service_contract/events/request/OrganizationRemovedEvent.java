package ru.mycrg.auth_service_contract.events.request;

import java.util.List;

public class OrganizationRemovedEvent extends OrganizationBaseRequestEvent {

    List<String> users;

    public OrganizationRemovedEvent() {
        super();
    }

    public OrganizationRemovedEvent(Long orgId, String token, List<String> users) {
        super(orgId, token);

        this.users = users;
    }

    public List<String> getUsers() {
        return users;
    }
}
