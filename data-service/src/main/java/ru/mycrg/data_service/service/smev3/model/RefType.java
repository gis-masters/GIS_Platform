package ru.mycrg.data_service.service.smev3.model;

public class RefType {
    private String code;
    private String name;

    public RefType(String code, String name) {
        this.code = code;
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }
}
