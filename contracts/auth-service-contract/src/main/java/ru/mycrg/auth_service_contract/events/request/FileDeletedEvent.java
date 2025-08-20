package ru.mycrg.auth_service_contract.events.request;

import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.FILE_REQUEST_QUEUE;

public class FileDeletedEvent extends DefaultMessageBusRequestEvent {

    private String fileId;
    private String login;
    private String token;

    public FileDeletedEvent() {
        super();
    }

    public FileDeletedEvent(String login, String token, String fileId) {
        super(UUID.randomUUID(), FILE_REQUEST_QUEUE);

        this.fileId = fileId;
        this.login = login;
        this.token = token;
    }

    public String getFileId() {
        return fileId;
    }

    public void setFileId(String fileId) {
        this.fileId = fileId;
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
