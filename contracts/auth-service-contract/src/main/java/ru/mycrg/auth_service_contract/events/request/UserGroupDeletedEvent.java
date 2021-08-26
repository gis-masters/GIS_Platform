package ru.mycrg.auth_service_contract.events.request;

import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.USER_REQUEST_FANOUT;
import static ru.mycrg.messagebus_contract.MessageBusProperties.USER_REQUEST_KEY;

public class UserGroupDeletedEvent extends DefaultMessageBusRequestEvent {

    private String token;

    private Long groupId;

    public UserGroupDeletedEvent() {
        super();
    }

    public UserGroupDeletedEvent(String token, Long groupId) {
        super(UUID.randomUUID(), USER_REQUEST_FANOUT, USER_REQUEST_KEY);

        this.token = token;
        this.groupId = groupId;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
