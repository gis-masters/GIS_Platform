package ru.mycrg.auth_service_contract;

public class UserProvisioningFailedEvent extends UserBaseEvent {

    public UserProvisioningFailedEvent() {
    }

    public UserProvisioningFailedEvent(IUserEvent mqEvent) {
        super(mqEvent.getLogin());
    }
}
