package ru.mycrg.auth_service_contract.events.response;

import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import static ru.mycrg.messagebus_contract.MessageBusProperties.USER_RESPONSE_FANOUT;
import static ru.mycrg.messagebus_contract.MessageBusProperties.USER_RESPONSE_KEY;

public class UserBaseResponseEvent extends DefaultMessageBusRequestEvent {

    private String login;
    private String token;

    public UserBaseResponseEvent() {
        super();
    }

    public UserBaseResponseEvent(IMessageBusEvent event, String login, String token) {
        super(event.getId(), USER_RESPONSE_FANOUT, USER_RESPONSE_KEY);

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
