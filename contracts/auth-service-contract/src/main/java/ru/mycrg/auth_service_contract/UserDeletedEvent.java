package ru.mycrg.auth_service_contract;

public class UserDeletedEvent extends UserBaseEvent {

    public UserDeletedEvent() {
    }

    public UserDeletedEvent(String login) {
        super(login);
    }

}
