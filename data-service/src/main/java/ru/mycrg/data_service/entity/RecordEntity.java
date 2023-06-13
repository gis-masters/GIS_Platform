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
    public void setContent(Map<String, Object> content) {
        this.content = content;
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
    public String getAsString(String field) {
        Object o = content.get(field);
        if (o == null) {
            return null;
        }

        return String.valueOf(o);
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
