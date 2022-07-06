package ru.mycrg.auth_service_contract.dto;

import javax.validation.constraints.NotBlank;

public class PasswordResetDto extends PasswordModel {

    @NotBlank
    private String token;

    public PasswordResetDto() {
        super();
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    @Override
    public String toString() {
        return "{" +
                "\"token\":" + (token == null ? "null" : "\"" + token + "\"") +
                "}";
    }
}
