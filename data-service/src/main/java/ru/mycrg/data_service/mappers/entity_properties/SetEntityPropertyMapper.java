package ru.mycrg.data_service.mappers.entity_properties;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.entity.EntityProperty;
import ru.mycrg.schemas.properties.EntityPropertyResponseModel;
import ru.mycrg.schemas.properties.PropertyType;

import static ru.mycrg.data_service.mappers.entity_properties.CommonEntityPropertyMapper.mapCommonProperties;

@Component
public class SetEntityPropertyMapper implements IEntityPropertyMapper {

    @Override
    public EntityPropertyResponseModel map(EntityProperty entityProperty) {
        EntityPropertyResponseModel result = mapCommonProperties(entityProperty);

        result.setFields(entityProperty.getAdditional());

        return result;
    }

    @Override
    public PropertyType getType() {
        return PropertyType.SET;
    }
}
