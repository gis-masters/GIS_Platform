package ru.mycrg.auth_service_contract.events.request;

public class UserDeletedEvent extends UserBaseRequestEvent {

    public UserDeletedEvent() {
        super();
    }

    public UserDeletedEvent(String login, String token) {
        super(login, token);
    }
}
