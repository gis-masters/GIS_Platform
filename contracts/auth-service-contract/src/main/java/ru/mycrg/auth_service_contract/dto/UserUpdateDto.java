package ru.mycrg.auth_service_contract.dto;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

public class UserUpdateDto extends PasswordModel {

    @Size(max = 50, message = "Не более 50 символов")
    private String name;

    @Size(max = 50, message = "Не более 50 символов")
    private String middleName;

    @Size(max = 100, message = "Не более 100 символов")
    private String surname;

    @Size(max = 250, message = "Не более 250 символов")
    private String job;

    @Size(max = 20, message = "Не более 20 символов")
    private String phone;

    @Pattern(regexp = "^(true|false)$", message = "Допустимые значения поля enabled: true или false")
    private String enabled;

    @Size(max = 200, message = "Не более 200 символов")
    private String department;

    private Integer bossId;

    public UserUpdateDto() {
        super();
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

    public String isEnabled() {
        return enabled;
    }

    public void setEnabled(String enabled) {
        this.enabled = enabled;
    }

    public String getEnabled() {
        return enabled;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Integer getBossId() {
        return bossId;
    }

    public void setBossId(Integer bossId) {
        this.bossId = bossId;
    }
}
