package ru.mycrg.auth_service_contract;

public class UserCreatedEvent extends UserBaseEvent {

    private String password;
    private boolean isEnabled;
    private String role;

    public UserCreatedEvent() {
    }

    public UserCreatedEvent(String login, String password, boolean isEnabled, String role) {
        super(login);

        this.password = password;
        this.isEnabled = isEnabled;
        this.role = role;
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
