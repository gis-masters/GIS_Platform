package ru.mycrg.data_service.mappers.entity_properties;

import ru.mycrg.data_service.entity.EntityProperty;
import ru.mycrg.schemas.properties.EntityPropertyResponseModel;

public class CommonEntityPropertyMapper {

    private CommonEntityPropertyMapper() {
        throw new IllegalStateException("Utility class");
    }

    public static EntityPropertyResponseModel mapCommonProperties(EntityProperty entityProperty) {
        return new EntityPropertyResponseModel(
                entityProperty.getName(),
                entityProperty.getPropertyType(),
                entityProperty.getTitle(),
                entityProperty.getDescription(),
                entityProperty.getCategory(),
                entityProperty.isSystemManaged(),
                entityProperty.isHidden(),
                entityProperty.isDisabled(),
                entityProperty.isRequired(),
                entityProperty.isAsTitle(),
                entityProperty.isIndexed());
    }
}
