package ru.mycrg.data_service.util;

public enum SystemLibraryAttributes {

    ID("id"),
    TITLE("title"),
    CREATED_AT("created_at"),
    LAST_MODIFIED("last_modified"),
    CREATED_BY("created_by"),
    INNER_PATH("inner_path"),
    FILE_TYPE("type"),
    SIZE("size"),
    PARENT("parent"),
    CONTENT_TYPE_ID("content_type_id"),
    OKTMO("oktmo"),
    HUMAN_PATH("human_path");

    private final String name;

    SystemLibraryAttributes(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
