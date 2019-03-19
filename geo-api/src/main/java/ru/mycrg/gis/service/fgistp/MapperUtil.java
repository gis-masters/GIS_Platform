package ru.mycrg.gis.service.fgistp;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vladmihalcea.hibernate.type.json.internal.JacksonUtil;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.common.EntityTypeDto;
import ru.mycrg.common.SimplePropertyDto;
import ru.mycrg.common.enums.ValueType;
import ru.mycrg.common.propertyTypes.*;
import ru.mycrg.gis.entity.XsdRule;

import java.io.IOException;
import java.util.Optional;

public class MapperUtil {

    private static Logger log = LoggerFactory.getLogger(MapperUtil.class);

    @NotNull
    public static XsdRule mapEntityTypeToXsdRule(EntityType entityType) {
        XsdRule xsdRule = new XsdRule();
        xsdRule.setClassName(entityType.getName());

        try {
            JsonNode jsonNode = JacksonUtil.toJsonNode(getJson(mapEntityTypeToDto(entityType)));
            xsdRule.setClassRule(jsonNode);
        } catch (Exception e) {
            log.warn("Failed get json for: {} / With error: {}", entityType.getName(), e.getMessage());
        }

        return xsdRule;
    }

    public static EntityTypeDto mapEntityTypeToDto(EntityType entityType) {
        EntityTypeDto dto = new EntityTypeDto();
        dto.setName(entityType.getName());
        dto.setTitle(entityType.getTitle());
        dto.setDescription(entityType.getDescription());
        dto.setTableName(entityType.getTableName());
        dto.setCustomRuleFunction(entityType.getCustomRuleFunction());

        entityType.getProperties().forEach(abstractProperty -> {
            dto.addProperty(mapPropertyToDto(abstractProperty));
        });

        return dto;
    }

    private static SimplePropertyDto mapPropertyToDto(AbstractProperty abstractProperty) {
        SimplePropertyDto dto = new SimplePropertyDto();
        dto.setName(abstractProperty.getName());
        dto.setTitle(abstractProperty.getTitle());
        dto.setDescription(abstractProperty.getDescription());
        dto.setRequired(abstractProperty.isRequired());
        dto.setHidden(abstractProperty.isHidden());
        dto.setUpdateability(abstractProperty.getUpdateability());
        dto.setMultiple(abstractProperty.isMultiple());
        dto.setChoice(abstractProperty.getChoice());
        dto.setValueType(abstractProperty.getValueType());
        dto.setSequenceNumber(abstractProperty.getSequenceNumber());

        if (abstractProperty.getValueType() == ValueType.STRING) {
            StringProperty stringProperty = (StringProperty) abstractProperty;

            dto.setMinLength(stringProperty.getMinLength());
            dto.setMaxLength(stringProperty.getMaxLength());
            dto.setPattern(stringProperty.getPattern());
            dto.setPatternDescription(stringProperty.getPatternDescription());
        } else if (abstractProperty.getValueType() == ValueType.INT) {
            IntegerProperty integerProperty = (IntegerProperty) abstractProperty;
            dto.setMaxInclusive(integerProperty.getMaxInclusive());
            dto.setMinInclusive(integerProperty.getMinInclusive());
        } else if (abstractProperty.getValueType() == ValueType.GEOMETRY) {
            GeometryProperty geometryProperty = (GeometryProperty) abstractProperty;
            dto.setAllowedValues(geometryProperty.getAllowedValues());
        } else if (abstractProperty.getValueType() == ValueType.CHOICE) {
            EnumerationProperty enumerationProperty = (EnumerationProperty) abstractProperty;
            dto.setEnumerations(enumerationProperty.getEnumerations());
        } else if (abstractProperty instanceof DoubleProperty) {
            DoubleProperty doubleProperty = (DoubleProperty) abstractProperty;
            dto.setTotalDigits(doubleProperty.getTotalDigits());
        } else {
            log.warn("Not described types");
        }

        return dto;
    }

    public static EntityType mapXsdRuleToEntityType(XsdRule xsdRule) {
        ObjectMapper mapper = new ObjectMapper();

        try {
            JsonNode classRule = xsdRule.getClassRule();
            EntityTypeDto entityTypeDto = mapper.readValue(classRule.toString(), EntityTypeDto.class);

            return mapDtoToEntityType(entityTypeDto);
        } catch (IOException e) {
            log.warn("Failed convert JSON / Error: {}", e.getMessage());
        }

        return new EntityType(xsdRule.getClassName());
    }

    static private EntityType mapDtoToEntityType(EntityTypeDto dto) {
        EntityType entityType = new EntityType();

        entityType.setName(dto.getName());
        entityType.setTitle(dto.getTitle());
        entityType.setDescription(dto.getDescription());
        entityType.setTableName(dto.getTableName());

        dto.getProperties().forEach(propertyDto -> {
            mapDtoToProperty(propertyDto).ifPresent(entityType::addProperty);
        });

        return entityType;
    }

    static private Optional<AbstractProperty> mapDtoToProperty(SimplePropertyDto propertyDto) {
        if (propertyDto.getValueType() == ValueType.STRING) {
            StringProperty stringProperty = new StringProperty();

            fillCommonField(stringProperty, propertyDto);

            stringProperty.setMinLength(propertyDto.getMinLength());
            stringProperty.setMaxLength(propertyDto.getMaxLength());
            stringProperty.setPattern(propertyDto.getPattern());
            stringProperty.setPatternDescription(propertyDto.getPatternDescription());

            return Optional.of(stringProperty);
        } else if (propertyDto.getValueType() == ValueType.INT) {
            IntegerProperty integerProperty = new IntegerProperty();

            fillCommonField(integerProperty, propertyDto);

            integerProperty.setMaxInclusive(propertyDto.getMaxInclusive());
            integerProperty.setMinInclusive(propertyDto.getMinInclusive());

            return Optional.of(integerProperty);
        } else if (propertyDto.getValueType() == ValueType.GEOMETRY) {
            GeometryProperty geometryProperty = new GeometryProperty();

            fillCommonField(geometryProperty, propertyDto);

            geometryProperty.setAllowedValues(propertyDto.getAllowedValues());

            return Optional.of(geometryProperty);
        } else if (propertyDto.getValueType() == ValueType.CHOICE) {
            EnumerationProperty enumerationProperty = new EnumerationProperty();

            fillCommonField(enumerationProperty, propertyDto);

            enumerationProperty.setEnumerations(propertyDto.getEnumerations());

            return Optional.of(enumerationProperty);
        } else if (propertyDto.getValueType() == ValueType.DOUBLE) {
            DoubleProperty doubleProperty = new DoubleProperty();

            fillCommonField(doubleProperty, propertyDto);

            doubleProperty.setTotalDigits(propertyDto.getTotalDigits());

            return Optional.of(doubleProperty);
        } else {
            log.warn("Not described types");

            return Optional.empty();
        }
    }

    static private void fillCommonField(AbstractProperty target, SimplePropertyDto dto) {
        target.setName(dto.getName());
        target.setTitle(dto.getTitle());
        target.setDescription(dto.getDescription());
        target.setRequired(dto.isRequired());
        target.setHidden(dto.isHidden());
        target.setUpdateability(dto.getUpdateability());
        target.setMultiple(dto.isMultiple());
        target.setChoice(dto.getChoice());
        target.setSequenceNumber(dto.getSequenceNumber());
    }

    @Nullable
    static private String getJson(EntityTypeDto classType) throws JsonProcessingException {
        return new ObjectMapper().writer()
                .withDefaultPrettyPrinter()
                .writeValueAsString(classType);
    }
}
