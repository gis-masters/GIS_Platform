package ru.mycrg.data_service.mappers.entity_properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.entity.EntityProperty;
import ru.mycrg.schemas.properties.EntityPropertyResponseModel;
import ru.mycrg.schemas.properties.PropertyType;

import static ru.mycrg.data_service.mappers.entity_properties.CommonEntityPropertyMapper.mapCommonProperties;

@Component
public class DefaultEntityPropertyMapper implements IEntityPropertyMapper {

    private final Logger log = LoggerFactory.getLogger(DefaultEntityPropertyMapper.class);

    @Override
    public EntityPropertyResponseModel map(EntityProperty entityProperty) {
        log.warn("used defaultEntityPropertyMapper");

        return mapCommonProperties(entityProperty);
    }

    @Override
    public PropertyType getType() {
        return null;
    }
}
