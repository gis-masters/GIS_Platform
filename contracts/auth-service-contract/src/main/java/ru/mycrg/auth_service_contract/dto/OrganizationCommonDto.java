package ru.mycrg.auth_service_contract.dto;

public class OrganizationCommonDto {

    private long id;
    private String name;
    private String phone;
    private String status;
    private int usersCount;

    public OrganizationCommonDto() {
    }

    public Long getId() {
        return this.id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return this.phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setUsersCount(int usersCount) {
        this.usersCount = usersCount;
    }

    public int getUsersCount() {
        return this.usersCount;
    }
}
