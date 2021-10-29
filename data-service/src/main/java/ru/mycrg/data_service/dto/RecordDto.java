package ru.mycrg.data_service.dto;

import org.springframework.hateoas.core.Relation;

import java.util.HashMap;
import java.util.Map;

@Relation(collectionRelation = "records")
public class RecordDto {

    private final Map<String, Object> content = new HashMap<>();

    public RecordDto() {
        // Required
    }

    public Map<String, Object> getContent() {
        return content;
    }

    public void put(String key, Object value) {
        this.content.put(key, value);
    }
}
