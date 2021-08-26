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

    private boolean enabled;

    public UserGeoserverDto() {
        // Framework required
    }

    public UserGeoserverDto(String userName) {
        this.userName = userName;
    }

    public UserGeoserverDto(String userName, String password) {
        this(userName);

        this.password = password;
    }

    public UserGeoserverDto(String userName, String password, boolean enabled) {
        this(userName, password);

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
}
