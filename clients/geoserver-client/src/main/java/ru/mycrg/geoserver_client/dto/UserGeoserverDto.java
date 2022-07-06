package ru.mycrg.geoserver_client.dto;

import ru.mycrg.auth_service_contract.dto.PasswordModel;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class UserGeoserverDto extends PasswordModel {

    @Email
    @NotBlank
    @Size(max = 60, message = "No more than 60 characters")
    private String userName;
    private String role;
    private boolean enabled;

    public UserGeoserverDto() {
        super();
    }

    public UserGeoserverDto(String userName) {
        this(userName, null, null, true);
    }

    public UserGeoserverDto(String userName, String password, String role) {
        this(userName, password, role, true);
    }

    public UserGeoserverDto(String userName, String password, boolean enabled) {
        this(userName, password, null, enabled);
    }

    public UserGeoserverDto(String userName, String password, String role, boolean enabled) {
        super(password);

        this.userName = userName;
        this.role = role;
        this.enabled = enabled;
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
}
