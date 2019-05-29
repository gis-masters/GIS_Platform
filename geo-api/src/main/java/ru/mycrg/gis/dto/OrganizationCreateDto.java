package ru.mycrg.gis.dto;

import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.*;

public class OrganizationCreateDto {

    @NotBlank(message = "Please provide organization name")
    @Size(min=5, max=500, message = "No less 5 and no more than 500 characters")
    private String name;

    @NotBlank(message = "Please provide phone")
    @Length(max = 20, message = "No more than 20 characters")
    private String phone;

    @NotBlank(message = "Please provide user surname")
    @Length(max = 100, message = "No more than 100 characters")
    private String userSurName;

    @NotBlank(message = "Please provide user name")
    @Length(max = 50, message = "No more than 50 characters")
    private String userName;

    @Email
    @NotBlank
    @Length(max = 60, message = "No more than 60 characters")
    private String email;

    //    ^                 # start-of-string
    //    (?=.*[0-9])       # a digit must occur at least once
    //    (?=.*[a-z])       # a lower case letter must occur at least once
    //    (?=.*[A-Z])       # an upper case letter must occur at least once
    //    (?=\S+$)          # no whitespace allowed in the entire string
    //    .{8,}             # at least eight places though
    //    $                 # end-of-string
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\\S+$).{8,}$",
             message = "Пароль должен содержать цифры, заглавную букву, быть не менее 8 символов без пробелов")
    private String password;

    public OrganizationCreateDto() {}

    public OrganizationCreateDto(String name, String phone, String userSurName, String userName, String email,
                                 String password) {
        this.name = name;
        this.phone = phone;
        this.userSurName = userSurName;
        this.userName = userName;
        this.email = email;
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getUserSurName() {
        return userSurName;
    }

    public void setUserSurName(String userSurName) {
        this.userSurName = userSurName;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
