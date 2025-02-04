package ru.mycrg.schemas;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import ru.mycrg.schemas.properties.PropertyInt;
import ru.mycrg.schemas.properties.PropertyString;
import ru.mycrg.schemas.properties.PropertyType;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "propertyType", visible = true)
@JsonSubTypes({
                      @Type(value = PropertyString.class, name = "STRING"),
                      @Type(value = PropertyInt.class, name = "INT"),
              })
public interface IEntityProperty {

    String getName();

    String getTitle();

    PropertyType getPropertyType();
}
