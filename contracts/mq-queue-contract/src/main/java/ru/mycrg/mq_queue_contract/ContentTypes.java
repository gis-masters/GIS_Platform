package ru.mycrg.mq_queue_contract;

import java.util.ArrayList;
import java.util.List;

public class ContentTypes {

    private String id;
    private String type;
    private List<Object> attributes = new ArrayList<>();

    public ContentTypes() {
        // Required
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<Object> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<Object> attributes) {
        this.attributes = attributes;
    }
}
