package ru.mycrg.auth_service_contract.events.request;

import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.USER_REQUEST_FANOUT;
import static ru.mycrg.messagebus_contract.MessageBusProperties.USER_REQUEST_KEY;

public class UserBaseRequestEvent extends DefaultMessageBusRequestEvent {

    private String login;
    private String token;

    public UserBaseRequestEvent() {
        super();
    }

    public UserBaseRequestEvent(String login, String token) {
        super(UUID.randomUUID(), USER_REQUEST_FANOUT, USER_REQUEST_KEY);

        this.login = login;
        this.token = token;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
