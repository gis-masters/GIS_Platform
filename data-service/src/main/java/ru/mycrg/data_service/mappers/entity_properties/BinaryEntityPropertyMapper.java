package ru.mycrg.data_service.mappers.entity_properties;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.entity.EntityProperty;
import ru.mycrg.schemas.properties.EntityPropertyResponseModel;
import ru.mycrg.schemas.properties.PropertyType;

import static ru.mycrg.data_service.mappers.entity_properties.CommonEntityPropertyMapper.mapCommonProperties;

@Component
public class BinaryEntityPropertyMapper implements IEntityPropertyMapper {

    @Override
    public EntityPropertyResponseModel map(EntityProperty entityProperty) {
        EntityPropertyResponseModel result = mapCommonProperties(entityProperty);

        result.setAccept(entityProperty.getAccept());
        result.setMaxSize(entityProperty.getMaxSize());
        result.setDefault(entityProperty.isDefault());
        result.setEmbedded(entityProperty.isEmbedded());

        return result;
    }

    @Override
    public PropertyType getType() {
        return PropertyType.BINARY;
    }
}
