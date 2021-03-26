package ru.mycrg.data_service_contract.dto;

import java.util.ArrayList;
import java.util.List;

public class ContentTypes {

    private String id;
    private String type;
    private String title;
    private String icon;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}
