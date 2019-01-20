package ru.mycrg.gis.service.fgistp;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.gis.dto.EntityTypeDto;
import ru.mycrg.gis.dto.SimplePropertyDto;
import ru.mycrg.gis.service.fgistp.enums.ValueType;
import ru.mycrg.gis.service.fgistp.propertyTypes.*;

import java.util.ArrayList;
import java.util.List;

public class EntityType {

    private static Logger log = LoggerFactory.getLogger(EntityType.class);

    private String name;
    private String title;
    private String description;
    private String tableName;
    private List<AbstractProperty> properties = new ArrayList<>();

    public EntityType() {}

    public EntityType(String name) {
        this.name = name;
    }

    public EntityType(EntityTypeDto dto) {
        this.name = dto.getName();
        this.title = dto.getTitle();
        this.description = dto.getDescription();
        this.tableName = dto.getTableName();

        dto.getProperties().forEach(simplePropertyDto -> {
            if (simplePropertyDto.getValueType() == ValueType.STRING) {
                this.properties.add(new StringProperty(simplePropertyDto));
            } else if (simplePropertyDto.getValueType() == ValueType.INT) {
                this.properties.add(new IntegerProperty(simplePropertyDto));
            } else if (simplePropertyDto.getValueType() == ValueType.GEOMETRY) {
                this.properties.add(new GeometryProperty(simplePropertyDto));
            } else if (simplePropertyDto.getValueType() == ValueType.CHOICE) {
                this.properties.add(new EnumerationProperty(simplePropertyDto));
            } else if (simplePropertyDto.getValueType() == ValueType.DOUBLE) {
                this.properties.add(new DoubleProperty(simplePropertyDto));
            } else {
                log.warn("Describe new property here");
            }
        });
    }

    // TODO: Validation rules here
    // Inheritance other EntityType

    public void addProperty(AbstractProperty property) {
        properties.add(property);
    }

    public List<AbstractProperty> getProperties() {
        return properties;
    }

    public void setProperties(List<AbstractProperty> properties) {
        this.properties = properties;
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
}
