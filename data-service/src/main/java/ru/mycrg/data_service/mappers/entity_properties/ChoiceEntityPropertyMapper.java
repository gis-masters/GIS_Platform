package ru.mycrg.data_service.mappers.entity_properties;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.entity.EntityProperty;
import ru.mycrg.schemas.properties.EntityPropertyResponseModel;
import ru.mycrg.schemas.properties.PropertyType;

import static ru.mycrg.data_service.mappers.entity_properties.CommonEntityPropertyMapper.mapCommonProperties;

@Component
public class ChoiceEntityPropertyMapper implements IEntityPropertyMapper {

    @Override
    public EntityPropertyResponseModel map(EntityProperty entityProperty) {
        EntityPropertyResponseModel result = mapCommonProperties(entityProperty);

        result.setDisplay(entityProperty.getDisplay());
        result.setMultiple(entityProperty.isMultiple());
        result.setValueType(entityProperty.getValueType());
        result.setAllowFillIn(entityProperty.isAllowFillIn());

        result.setOptions(entityProperty.getAdditional());

        return result;
    }

    @Override
    public PropertyType getType() {
        return PropertyType.CHOICE;
    }
}
