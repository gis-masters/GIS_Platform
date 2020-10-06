package ru.mycrg.auth_service_contract;

public abstract class UserBaseEvent implements IUserEvent {

    private String login;
    private String token;

    public UserBaseEvent() {
    }

    public UserBaseEvent(String login, String token) {
        this.login = login;
        this.token = token;
    }

    @Override
    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    @Override
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
