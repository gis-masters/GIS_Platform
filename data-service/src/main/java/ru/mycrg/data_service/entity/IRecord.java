package ru.mycrg.data_service.entity;

import org.jetbrains.annotations.Nullable;

import java.util.Map;

import static ru.mycrg.data_service.util.SystemLibraryAttributes.IS_FOLDER;

public interface IRecord {

    Map<String, Object> getContent();

    Long getId();

    void setContent(Map<String, Object> content);

    void put(String s, Object o);

    @Nullable
    String getTitle();

    @Nullable
    String getAsString(String field);

    default boolean isFolder() {
        return asBoolean(IS_FOLDER.getName());
    }

    default boolean asBoolean(String field) {
        return Boolean.parseBoolean(getAsString(field));
    }
}
