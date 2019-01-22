package ru.mycrg.gis.dto;

import ru.mycrg.common.EntityType;

import java.util.ArrayList;
import java.util.List;

public class EntityTypeDto {

    private String name;
    private String title;
    private String description;
    private String tableName;
    private List<SimplePropertyDto> properties = new ArrayList<>();

    public EntityTypeDto() {}

    public EntityTypeDto(EntityType entityType) {
        this.name = entityType.getName();
        this.title = entityType.getTitle();
        this.description = entityType.getDescription();
        this.tableName = entityType.getTableName();

        entityType.getProperties().forEach(abstractProperty -> {
            this.properties.add(new SimplePropertyDto(abstractProperty));
        });
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public List<SimplePropertyDto> getProperties() {
        return properties;
    }

    public void setProperties(List<SimplePropertyDto> properties) {
        this.properties = properties;
    }
}
