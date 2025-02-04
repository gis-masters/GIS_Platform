package ru.mycrg.auth_service_contract.events.response;

import ru.mycrg.auth_service_contract.events.request.UserCreatedEvent;

public class UserProvisioningFailedEvent extends UserBaseResponseEvent {

    public UserProvisioningFailedEvent() {
        super();
    }

    public UserProvisioningFailedEvent(UserCreatedEvent event) {
        super(event, event.getLogin(), event.getToken());
    }
}
