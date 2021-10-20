package ru.mycrg.data_service.entity;

import java.util.Map;

import static ru.mycrg.data_service.util.SystemLibraryAttributes.ID;

public class RecordImpl implements IRecord {

    private Map<String, Object> content;

    public RecordImpl() {
        // Required
    }

    public RecordImpl(Map<String, Object> content) {
        this.content = content;
    }

    @Override
    public Map<String, Object> getContent() {
        return content;
    }

    @Override
    public Long getId() {
        return (Long) content.get(ID.getName());
    }

    @Override
    public void setValue(String key, Object value) {
        this.content.put(key, value);
    }

    public void setContent(Map<String, Object> content) {
        this.content = content;
    }

    @Override
    public String toString() {
        return "{" +
                "\"content\":" + (content == null ? "null" : "\"" + content + "\"") +
                "}";
    }
}
