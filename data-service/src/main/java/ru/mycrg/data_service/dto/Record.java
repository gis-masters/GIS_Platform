package ru.mycrg.data_service.dto;

import java.util.HashMap;
import java.util.Map;

public class Record {

    private final Map<String, Object> content = new HashMap<>();

    public Record() {
        // Required
    }

    public Map<String, Object> getContent() {
        return content;
    }

    public void put(String key, String value) {
        this.content.put(key, value);
    }
}
