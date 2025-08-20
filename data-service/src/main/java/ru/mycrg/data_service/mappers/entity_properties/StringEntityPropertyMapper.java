package ru.mycrg.data_service.mappers.entity_properties;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.entity.EntityProperty;
import ru.mycrg.schemas.properties.EntityPropertyResponseModel;
import ru.mycrg.schemas.properties.PropertyType;

import static ru.mycrg.data_service.mappers.entity_properties.CommonEntityPropertyMapper.mapCommonProperties;

@Component
public class StringEntityPropertyMapper implements IEntityPropertyMapper {

    @Override
    public EntityPropertyResponseModel map(EntityProperty entityProperty) {
        EntityPropertyResponseModel result = mapCommonProperties(entityProperty);

        result.setDisplay(entityProperty.getDisplay());
        result.setMask(entityProperty.getMask());
        result.setMaxLength(entityProperty.getMaxLength());
        result.setMinLength(entityProperty.getMinLength());
        result.setWellKnowRegex(entityProperty.getWellKnowRegex());
        result.setRegex(entityProperty.getRegex());
        result.setRegexErrorMessage(entityProperty.getRegexErrorMessage());
        result.setDefaultValue(entityProperty.getDefaultValue());

        return result;
    }

    @Override
    public PropertyType getType() {
        return PropertyType.STRING;
    }
}
