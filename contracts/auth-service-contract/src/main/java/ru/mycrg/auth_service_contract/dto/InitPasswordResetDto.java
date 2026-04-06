package ru.mycrg.auth_service_contract.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public class InitPasswordResetDto {

    @Email
    @NotEmpty
    @Size(max = 60, message = "Не более 60 символов")
    private String email;

    @NotEmpty
    private String origin;

    public InitPasswordResetDto() {
        // Required
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    @Override
    public String toString() {
        return "{" +
                "\"email\":" + (email == null ? "null" : "\"" + email + "\"") + ", " +
                "\"origin\":" + (origin == null ? "null" : origin) +
                "}";
    }
}
