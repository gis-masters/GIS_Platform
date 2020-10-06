package ru.mycrg.auth_service_contract;

import java.util.List;

public class OrganizationRemovedEvent extends OrganizationBaseEvent {

    List<String> users;

    public OrganizationRemovedEvent() {
    }

    public OrganizationRemovedEvent(Long orgId, String token, List<String> users) {
        super(orgId, token);

        this.users = users;
    }

    public List<String> getUsers() {
        return users;
    }
}
