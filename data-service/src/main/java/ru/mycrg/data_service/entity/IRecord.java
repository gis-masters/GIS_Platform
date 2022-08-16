package ru.mycrg.data_service.entity;

import org.jetbrains.annotations.Nullable;

import java.util.Map;

public interface IRecord {

    Map<String, Object> getContent();

    Long getId();

    void setValue(String key, Object value);

    @Nullable
    String getTitle();

    @Nullable
    String getAsString(String field);
}
