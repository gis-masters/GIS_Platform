package ru.mycrg.schemas.content_types;

import com.fasterxml.jackson.annotation.JsonInclude;
import ru.mycrg.schemas.properties.EntityPropertyResponseModel;

import java.util.ArrayList;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class EntityContentTypeResponseModel {

    private String name;
    private String type;
    private String title;
    private String icon;
    private List<EntityPropertyResponseModel> properties = new ArrayList<>();

    public EntityContentTypeResponseModel() {
        // Required
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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

    public List<EntityPropertyResponseModel> getProperties() {
        return properties;
    }

    public void setProperties(List<EntityPropertyResponseModel> properties) {
        this.properties = properties;
    }
}
