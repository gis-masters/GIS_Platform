package ru.mycrg.data_service.util;

public enum SystemLibraryAttributes {

    ID("id"),
    GUID("guid"),
    NAME("name"),
    EXTENSION_TABLE_ID("object_id"),
    TITLE("title"),
    CREATED_AT("created_at"),
    LAST_MODIFIED("last_modified"),
    CREATED_BY("created_by"),
    UPDATED_BY("updated_by"),
    INNER_PATH("inner_path"),
    FILE_TYPE("type"),
    SIZE("size"),
    PATH("path"),
    CONTENT_TYPE_ID("content_type_id"),
    OKTMO("oktmo"),
    INTENTS("intents"),
    ROLE("role"),
    IS_FOLDER("is_folder"),
    VERSIONS("versions"),
    IS_DELETED("is_deleted");

    private final String name;

    SystemLibraryAttributes(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
