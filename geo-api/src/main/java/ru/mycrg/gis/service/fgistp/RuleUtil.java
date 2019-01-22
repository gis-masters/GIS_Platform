package ru.mycrg.gis.service.fgistp;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vladmihalcea.hibernate.type.json.internal.JacksonUtil;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.EntityType;
import ru.mycrg.common.enums.ValueType;
import ru.mycrg.common.propertyTypes.*;
import ru.mycrg.gis.dto.EntityTypeDto;
import ru.mycrg.gis.dto.SimplePropertyDto;
import ru.mycrg.gis.entity.XsdRule;

import java.io.IOException;
import java.util.Optional;

@Service
public class RuleUtil {

    private static Logger log = LoggerFactory.getLogger(RuleUtil.class);

    @NotNull
    XsdRule mapClassToEntity(EntityType entityType) {
        XsdRule xsdRule = new XsdRule();
        xsdRule.setClassName(entityType.getName());

        try {
            JsonNode jsonNode = JacksonUtil.toJsonNode(getJson(new EntityTypeDto(entityType)));
            xsdRule.setClassRule(jsonNode);
        } catch (Exception e) {
            log.warn("Failed get json for: {} / With error: {}", entityType.getName(), e.getMessage());
        }

        return xsdRule;
    }

    public EntityType mapEntityToClass(XsdRule xsdRule) {
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

    private EntityType mapDtoToEntityType(EntityTypeDto dto) {
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

    private Optional<AbstractProperty> mapDtoToProperty(SimplePropertyDto propertyDto) {
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
            integerProperty.setTotalDigits(propertyDto.getTotalDigits());

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

            return Optional.of(doubleProperty);
        } else {
            log.warn("Not described types");

            return Optional.empty();
        }
    }

    private void fillCommonField(AbstractProperty target, SimplePropertyDto dto) {
        target.setName(dto.getName());
        target.setTitle(dto.getTitle());
        target.setDescription(dto.getDescription());
        target.setRequired(dto.isRequired());
        target.setHidden(dto.isHidden());
        target.setUpdateability(dto.getUpdateability());
        target.setMultiple(dto.isMultiple());
        target.setChoice(dto.getChoice());
    }

    @Nullable
    private String getJson(EntityTypeDto classType) throws JsonProcessingException {
        return new ObjectMapper().writer()
                .withDefaultPrettyPrinter()
                .writeValueAsString(classType);
    }
}
