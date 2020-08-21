package ru.mycrg.auth_service_contract;

public abstract class UserBaseEvent implements IUserEvent {

    private String login;

    public UserBaseEvent() {
    }

    public UserBaseEvent(String login) {
        this.login = login;
    }

    @Override
    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }
}
