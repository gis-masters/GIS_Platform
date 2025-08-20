package ru.mycrg.auth_service_contract.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class UserCreateDto extends PasswordModel {

    @NotBlank(message = "Пожалуйста, заполните имя пользователя")
    @Size(max = 50, message = "Не более 50 символов")
    private String name;

    @Size(max = 50, message = "Не более 50 символов")
    private String middleName;

    @NotBlank(message = "Пожалуйста, заполните фамилию")
    @Size(max = 100, message = "Не более 100 символов")
    private String surname;

    @Size(max = 250, message = "Не более 250 символов")
    private String job;

    @Size(max = 20, message = "Не более 20 символов")
    private String phone;

    @Email
    @NotBlank
    @Size(max = 60, message = "Не более 60 символов")
    private String email;

    @Size(max = 200, message = "Не более 200 символов")
    private String department;

    private Integer bossId;

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

    public Integer getBossId() {
        return bossId;
    }

    public void setBossId(Integer bossId) {
        this.bossId = bossId;
    }

    @Override
    public String toString() {
        return "{" +
                "\"name\":" + (name == null ? "null" : "\"" + name + "\"") + ", " +
                "\"middleName\":" + (middleName == null ? "null" : "\"" + middleName + "\"") + ", " +
                "\"surname\":" + (surname == null ? "null" : "\"" + surname + "\"") + ", " +
                "\"job\":" + (job == null ? "null" : "\"" + job + "\"") + ", " +
                "\"phone\":" + (phone == null ? "null" : "\"" + phone + "\"") + ", " +
                "\"email\":" + (email == null ? "null" : "\"" + email + "\"") + ", " +
                "\"department\":" + (department == null ? "null" : "\"" + department + "\"") + ", " +
                "\"bossId\":" + (bossId == null ? "null" : "\"" + bossId + "\"") +
                "}";
    }
}
