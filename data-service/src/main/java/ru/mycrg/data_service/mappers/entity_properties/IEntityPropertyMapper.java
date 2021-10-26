package ru.mycrg.data_service.mappers.entity_properties;

import ru.mycrg.data_service.entity.EntityProperty;
import ru.mycrg.schemas.properties.EntityPropertyResponseModel;
import ru.mycrg.schemas.properties.PropertyType;

public interface IEntityPropertyMapper {

    EntityPropertyResponseModel map(EntityProperty entityProperty);

    PropertyType getType();
}
