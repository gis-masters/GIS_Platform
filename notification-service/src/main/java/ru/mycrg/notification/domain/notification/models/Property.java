package ru.mycrg.notification.domain.notification.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Property {
    private final String name;
    private final PropertyType type;
    private final String value;

    @JsonCreator
    public Property(
            @JsonProperty("name") String name,
            @JsonProperty("type") PropertyType type,
            @JsonProperty("value") String value) {
        this.name = name;
        this.type = type;
        this.value = value;
    }

    public String getName() {
        return name;
    }

    public PropertyType getType() {
        return type;
    }

    public String getValue() {
        return value;
    }
}