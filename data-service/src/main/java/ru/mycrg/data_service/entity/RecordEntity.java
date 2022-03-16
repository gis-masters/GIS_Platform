package ru.mycrg.data_service.entity;

import java.util.HashMap;
import java.util.Map;

import static ru.mycrg.data_service.util.SystemLibraryAttributes.*;

public class RecordEntity implements IRecord {

    private Map<String, Object> content = new HashMap<>();

    public RecordEntity() {
        // Required
    }

    public RecordEntity(Map<String, Object> content) {
        this.content = content;
    }

    @Override
    public Map<String, Object> getContent() {
        return content;
    }

    @Override
    public void setValue(String key, Object value) {
        this.content.put(key, value);
    }

    @Override
    public Long getId() {
        Object id = content.get(ID.getName());
        if (id != null) {
            return Long.valueOf(id.toString());
        } else {
            return -1L;
        }
    }

    @Override
    public String getTitle() {
        return getAsString(TITLE.getName());
    }

    @Override
    public String getFileType() {
        return getAsString(FILE_TYPE.getName());
    }

    @Override
    public String getInnerPath() {
        return getAsString(INNER_PATH.getName());
    }

    @Override
    public String getAsString(String field) {
        return String.valueOf(content.get(field));
    }

    @Override
    public String toString() {
        return "{" +
                "\"content\":" + (content == null ? "null" : "\"" + content + "\"") +
                "}";
    }

    public void put(String s, Object o) {
        this.getContent().put(s, o);
    }
}
