package ru.mycrg.data_service.service;

public enum SystemLibraryAttributes {

    ID("id"),
    CREATED_AT("created_at"),
    LAST_MODIFIED("last_modified"),
    CREATED_BY("created_by"),
    INNER_PATH("inner_path"),
    FILE_TYPE("type"),
    SIZE("size"),
    PARENT("parent");

    private final String name;

    SystemLibraryAttributes(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
