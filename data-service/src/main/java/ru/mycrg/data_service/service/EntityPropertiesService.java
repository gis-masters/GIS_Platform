package ru.mycrg.data_service.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.entity.EntityProperty;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.mappers.entity_properties.DefaultEntityPropertyMapper;
import ru.mycrg.data_service.mappers.entity_properties.IEntityPropertyMapper;
import ru.mycrg.data_service.repository.EntityPropertyRepository;
import ru.mycrg.schemas.IEntityProperty;
import ru.mycrg.schemas.properties.EntityPropertyResponseModel;
import ru.mycrg.schemas.properties.PropertyType;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

import static java.util.stream.Collectors.toMap;

@Service
public class EntityPropertiesService {

    private final IEntityPropertyMapper defaultMapper;
    private final EntityPropertyRepository entityPropertyRepository;
    private final Map<PropertyType, IEntityPropertyMapper> propertyMappers;

    public EntityPropertiesService(EntityPropertyRepository entityPropertyRepository,
                                   List<IEntityPropertyMapper> propertyMappers) {
        this.entityPropertyRepository = entityPropertyRepository;

        this.defaultMapper = new DefaultEntityPropertyMapper();
        this.propertyMappers = propertyMappers.stream()
                                              .collect(toMap(IEntityPropertyMapper::getType, Function.identity()));
    }

    public Page<EntityPropertyResponseModel> getPaged(Pageable pageable) {
        return entityPropertyRepository
                .findAll(pageable)
                .map(entityProperty -> {
                    return propertyMappers.getOrDefault(PropertyType.valueOf(entityProperty.getPropertyType()), defaultMapper)
                                          .map(entityProperty);
                });
    }

    public EntityPropertyResponseModel create(IEntityProperty entityProperty) {
        try {
            final EntityProperty entity = new EntityProperty(entityProperty);

            final EntityProperty savedProperty = entityPropertyRepository.save(entity);

            return defaultMapper.map(savedProperty);
        } catch (Exception e) {
            throw new DataServiceException("Failed to create entityProperty. Reason: " + e.getMessage());
        }
    }
}
