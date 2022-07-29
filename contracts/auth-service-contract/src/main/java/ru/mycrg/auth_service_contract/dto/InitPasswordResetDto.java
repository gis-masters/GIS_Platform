package ru.mycrg.auth_service_contract.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;

public class InitPasswordResetDto {

    @Email
    @NotEmpty
    private String email;

    @NotEmpty
    private String originHost;

    public InitPasswordResetDto() {
        // Required
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOriginHost() {
        return originHost;
    }

    public void setOriginHost(String originHost) {
        this.originHost = originHost;
    }

    @Override
    public String toString() {
        return "{" +
                "\"email\":" + (email == null ? "null" : "\"" + email + "\"") + ", " +
                "\"originHost\":" + (originHost == null ? "null" : originHost) +
                "}";
    }
}
