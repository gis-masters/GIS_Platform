package ru.mycrg.auth_service_contract.dto;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

public class UserUpdateDto {

    @Size(min = 3, max = 50, message = "No less 3 and no more than 50 characters")
    private String name;

    @Size(min = 3, max = 50, message = "No less 3 and no more than 50 characters")
    private String middleName;

    @Size(max = 100, message = "No more than 100 characters")
    private String surname;

    @Size(max = 250, message = "No more than 250 characters")
    private String job;

    @Size(max = 20, message = "No more than 20 characters")
    private String phone;

    //    ^                 # start-of-string
    //    (?=.*[0-9])       # a digit must occur at least once
    //    (?=.*[a-z])       # a lower case letter must occur at least once
    //    (?=.*[A-Z])       # an upper case letter must occur at least once
    //    (?=\S+$)          # no whitespace allowed in the entire string
    //    .{8,}             # at least eight places though
    //    $                 # end-of-string
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\\S+$).{8,}$",
             message = "Пароль должен состоять только из цифр, заглавных и строчных букв латинского алфавита")
    private String password;

    @Pattern(regexp = "^(true|false)$", message = "Допустимые значения поля enabled: true или false")
    private String enabled;

    public UserUpdateDto() {
        //Required by framework
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getJob() {
        return job;
    }

    public void setJob(String job) {
        this.job = job;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String isEnabled() {
        return enabled;
    }

    public void setEnabled(String enabled) {
        this.enabled = enabled;
    }
}
