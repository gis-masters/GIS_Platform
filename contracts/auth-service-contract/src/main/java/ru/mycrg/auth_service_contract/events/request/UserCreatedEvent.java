package ru.mycrg.auth_service_contract.events.request;

public class UserCreatedEvent extends UserBaseRequestEvent {

    private String geoserverLogin;
    private String password;
    private boolean isEnabled;
    private String role;

    public UserCreatedEvent() {
        super();
    }

    public UserCreatedEvent(String geoserverLogin, String login, String token, String password, boolean isEnabled,
                            String role) {
        super(login, token);

        this.geoserverLogin = geoserverLogin;
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

    public String getGeoserverLogin() {
        return geoserverLogin;
    }

    public void setGeoserverLogin(String geoserverLogin) {
        this.geoserverLogin = geoserverLogin;
    }

    @Override
    public String toString() {
        return "{" +
                "\"geoserverLogin\":\"" + geoserverLogin + "\"" + ", " +
                "\"password\": \"*** ***\"," +
                "\"isEnabled\":\"" + isEnabled + "\"" + ", " +
                "\"role\":" + (role == null ? "null" : "\"" + role + "\"") +
                "}";
    }
}
