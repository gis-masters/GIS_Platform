package ru.mycrg.auth_service_contract.events.response;

import ru.mycrg.auth_service_contract.events.request.UserCreatedEvent;

public class UserProvisioningSucceedEvent extends UserBaseResponseEvent {

    public UserProvisioningSucceedEvent() {
        super();
    }

    public UserProvisioningSucceedEvent(UserCreatedEvent event) {
        super(event, event.getLogin(), event.getToken());
    }
}
