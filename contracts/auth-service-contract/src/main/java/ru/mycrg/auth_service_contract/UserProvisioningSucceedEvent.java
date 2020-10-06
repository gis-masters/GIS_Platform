package ru.mycrg.auth_service_contract;

public class UserProvisioningSucceedEvent extends UserBaseEvent {

    public UserProvisioningSucceedEvent() {
    }

    public UserProvisioningSucceedEvent(IUserEvent mqEvent) {
        super(mqEvent.getLogin(), mqEvent.getToken());
    }

}
