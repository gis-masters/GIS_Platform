package ru.mycrg.auth_service_contract.dto;

public class IdNameProjection {

    private Long id;
    private String name;

    public IdNameProjection() {
        // Required
    }

    public IdNameProjection(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
