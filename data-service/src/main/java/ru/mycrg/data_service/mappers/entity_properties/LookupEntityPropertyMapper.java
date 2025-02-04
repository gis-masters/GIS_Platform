package ru.mycrg.data_service.mappers.entity_properties;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.entity.EntityProperty;
import ru.mycrg.schemas.properties.EntityPropertyResponseModel;
import ru.mycrg.schemas.properties.PropertyType;

import static ru.mycrg.data_service.mappers.entity_properties.CommonEntityPropertyMapper.mapCommonProperties;

@Component
public class LookupEntityPropertyMapper implements IEntityPropertyMapper {

    @Override
    public EntityPropertyResponseModel map(EntityProperty entityProperty) {
        EntityPropertyResponseModel result = mapCommonProperties(entityProperty);

        result.setAllowMultipleValues(entityProperty.isAllowMultipleValues());
        result.setLookupTableName(entityProperty.getLookupTableName());
        result.setLookupFieldName(entityProperty.getLookupFieldName());
        result.setAdditionalFields(entityProperty.getAdditionalFields());

        return result;
    }

    @Override
    public PropertyType getType() {
        return PropertyType.LOOKUP;
    }
}
