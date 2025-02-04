package ru.mycrg.data_service.dto.record;

import java.util.HashMap;
import java.util.Map;

import static ru.mycrg.data_service.dao.config.DaoProperties.ID;
import static ru.mycrg.data_service.dao.config.DaoProperties.PRIMARY_KEY;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.TITLE;

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
        Object primaryKey = content.get(PRIMARY_KEY);
        if (primaryKey != null) {
            return Long.valueOf(primaryKey.toString());
        }

        primaryKey = content.get(ID);
        if (primaryKey != null) {
            return Long.valueOf(primaryKey.toString());
        }

        return -1L;
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

    @Override
    public void put(String s, Object o) {
        this.getContent().put(s, o);
    }
}
