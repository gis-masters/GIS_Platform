package ru.mycrg.auth_service_contract;

public class UserCreatedEvent extends UserBaseEvent {

    private String password;
    private boolean isEnabled;

    public UserCreatedEvent() {
    }

    public UserCreatedEvent(String login, String password, boolean isEnabled) {
        super(login);

        this.password = password;
        this.isEnabled = isEnabled;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isEnabled() {
        return isEnabled;
    }

    public void setEnabled(boolean enabled) {
        isEnabled = enabled;
    }

}
