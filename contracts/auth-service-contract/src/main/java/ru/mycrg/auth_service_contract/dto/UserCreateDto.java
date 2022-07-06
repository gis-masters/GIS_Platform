package ru.mycrg.auth_service_contract.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class UserCreateDto extends PasswordModel {

    @NotBlank(message = "Please provide user name")
    @Size(min = 3, max = 50, message = "No less 3 and no more than 50 characters")
    private String name;

    @Size(min = 3, max = 50, message = "No less 3 and no more than 50 characters")
    private String middleName;

    @NotBlank(message = "Please provide user surname")
    @Size(max = 100, message = "No more than 100 characters")
    private String surname;

    @Size(max = 250, message = "No more than 250 characters")
    private String job;

    @Size(max = 20, message = "No more than 20 characters")
    private String phone;

    @Email
    @NotBlank
    @Size(max = 60, message = "No more than 60 characters")
    private String email;

    @Size(max = 200, message = "No more than 200 characters")
    private String department;

    public UserCreateDto() {
        super();
    }

    public UserCreateDto(String name, String surname, String email, String password) {
        this(name, null, surname, null, null, email, password, null);
    }

    public UserCreateDto(String name, String surname, String email, String password, String middleName, String job,
                         String phone) {
        this(name, middleName, surname, job, phone, email, password, null);
    }

    public UserCreateDto(String name, String middleName, String surname, String job, String phone, String email,
                         String password, String department) {
        super(password);

        this.name = name;
        this.middleName = middleName;
        this.surname = surname;
        this.job = job;
        this.phone = phone;
        this.email = email;
        this.department = department;
    }

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }
}
