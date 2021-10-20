package ru.mycrg.data_service.entity;

import java.util.Map;

public interface IRecord {

    Map<String, Object> getContent();

    Long getId();

    void setValue(String key, Object value);
}
