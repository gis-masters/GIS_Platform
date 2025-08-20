package ru.mycrg.geoserver_client.dto;

import ru.mycrg.auth_service_contract.dto.PasswordModel;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class UserGeoserverDto extends PasswordModel {

    private String geoserverLogin;
    @Email
    @NotBlank
    @Size(max = 60, message = "No more than 60 characters")
    private String userName;
    private String role;
    private boolean enabled;

    public UserGeoserverDto() {
        super();
    }

    public UserGeoserverDto(String userName, String geoserverLogin) {
        this(userName, null, null, true, geoserverLogin);
    }

    public UserGeoserverDto(String geoserverLogin, String userName, String password, String role) {
        this(userName, password, role, true, geoserverLogin);
    }

    public UserGeoserverDto(String userName, String password, boolean enabled) {
        this(userName, password, null, enabled, null);
    }

    public UserGeoserverDto(String userName, String password, String role, boolean enabled, String geoserverLogin) {
        super(password);

        this.userName = userName;
        this.role = role;
        this.enabled = enabled;
        this.geoserverLogin = geoserverLogin;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
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
}
