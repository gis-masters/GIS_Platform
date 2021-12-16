package ru.mycrg.geoserver_client.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

public class UserGeoserverDto {

    @Email
    @NotBlank
    @Size(max = 60, message = "No more than 60 characters")
    String userName;

    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\\S+$).{8,}$",
             message = "Пароль должен состоять только из цифр, заглавных и строчных букв латинского алфавита")
    String password;

    private String role;
    private boolean enabled;

    public UserGeoserverDto() {
        // Required
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
        this.userName = userName;
        this.password = password;
        this.role = role;
        this.enabled = enabled;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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
