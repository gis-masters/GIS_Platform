package ru.mycrg.data_service.entity;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "entity_content_types")
public class EntityContentType {

    @Id
    @Column(length = 50)
    private String name;

    @Column(length = 50)
    private String type;

    @Column(length = 100)
    private String title;

    @Column
    private String icon;

    @OneToMany
    @JoinColumn(name = "entity_content_type_name")
    private List<EntityProperty> properties;

    public EntityContentType() {
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

    public List<EntityProperty> getProperties() {
        return properties;
    }

    public void setProperties(List<EntityProperty> properties) {
        this.properties = properties;
    }
}
