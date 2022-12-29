package ru.mycrg.data_service.entity;

import org.jetbrains.annotations.Nullable;

import java.util.Map;

import static ru.mycrg.data_service.util.SystemLibraryAttributes.IS_FOLDER;

public interface IRecord {

    Map<String, Object> getContent();

    Long getId();

    void setValue(String key, Object value);

    @Nullable
    String getTitle();

    @Nullable
    String getAsString(String field);

    default boolean isFolder() {
        return Boolean.parseBoolean(getAsString(IS_FOLDER.getName()));
    }
}
