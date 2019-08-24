package ru.mycrg.gis.service.dataSchema;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vladmihalcea.hibernate.type.json.internal.JacksonUtil;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.common.FeatureDescriptionDto;
import ru.mycrg.common.SimplePropertyDto;
import ru.mycrg.common.enums.ValueType;
import ru.mycrg.common.propertyTypes.*;
import ru.mycrg.gis.entity.FeatureDescription;

import java.io.IOException;
import java.util.Optional;

public class MapperUtil {

    private static Logger log = LoggerFactory.getLogger(MapperUtil.class);

    private static ObjectMapper mapper = new ObjectMapper();

    @NotNull
    public static FeatureDescription mapFeatureDescriptionToXsdRule(ru.mycrg.gis.dto.FeatureDescription featureDescription) {
        FeatureDescription xsdRule = new FeatureDescription();
        xsdRule.setClassName(featureDescription.getName());

        try {
            JsonNode jsonNode = JacksonUtil.toJsonNode(getJsonString(mapFeatureDescriptionToDto(featureDescription)));
            xsdRule.setClassRule(jsonNode);
        } catch (Exception e) {
            log.warn("Failed get json for: {} / With error: {}", featureDescription.getName(), e.getMessage());
        }

        return xsdRule;
    }

    public static FeatureDescriptionDto mapFeatureDescriptionToDto(ru.mycrg.gis.dto.FeatureDescription featureDescription) {
        FeatureDescriptionDto dto = new FeatureDescriptionDto();
        dto.setName(featureDescription.getName());
        dto.setOriginName(featureDescription.getOriginName());
        dto.setTitle(featureDescription.getTitle());
        dto.setDescription(featureDescription.getDescription());
        dto.setTableName(featureDescription.getTableName());
        dto.setCustomRuleFunction(featureDescription.getCustomRuleFunction());
        dto.setCalcFiledFunction(featureDescription.getCalcFiledFunction());

        featureDescription.getProperties().forEach(abstractProperty -> {
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
        dto.setWhiteSpace(abstractProperty.getWhiteSpace());
        dto.setPatternDescription(abstractProperty.getPatternDescription());
        dto.setPattern(abstractProperty.getPattern());

        if (abstractProperty.getValueType() == ValueType.STRING) {
            StringProperty stringProperty = (StringProperty) abstractProperty;

            dto.setLength(stringProperty.getLength());
            dto.setMinLength(stringProperty.getMinLength());
            dto.setMaxLength(stringProperty.getMaxLength());
        } else if (abstractProperty.getValueType() == ValueType.INT) {
            IntegerProperty integerProperty = (IntegerProperty) abstractProperty;
            dto.setMaxInclusive(integerProperty.getMaxInclusive());
            dto.setMinInclusive(integerProperty.getMinInclusive());
            dto.setFractionDigits(integerProperty.getFractionDigits());
            dto.setTotalDigits(integerProperty.getTotalDigits());
        } else if (abstractProperty.getValueType() == ValueType.GEOMETRY) {
            GeometryProperty geometryProperty = (GeometryProperty) abstractProperty;
            dto.setAllowedValues(geometryProperty.getAllowedValues());
        } else if (abstractProperty.getValueType() == ValueType.CHOICE) {
            EnumerationProperty enumerationProperty = (EnumerationProperty) abstractProperty;
            dto.setEnumerations(enumerationProperty.getEnumerations());
        } else if (abstractProperty instanceof DoubleProperty) {
            DoubleProperty doubleProperty = (DoubleProperty) abstractProperty;
            dto.setTotalDigits(doubleProperty.getTotalDigits());
            dto.setFractionDigits(doubleProperty.getFractionDigits());
        } else {
            log.warn("Not described types");
        }

        return dto;
    }

    public static ru.mycrg.gis.dto.FeatureDescription mapXsdRuleToFeatureDescription(FeatureDescription featureDescription) {
        try {
            JsonNode classRule = featureDescription.getClassRule();
            FeatureDescriptionDto featureDescriptionDto = mapper.readValue(classRule.toString(), FeatureDescriptionDto.class);

            return mapDtoToFeatureDescription(featureDescriptionDto);
        } catch (IOException e) {
            log.warn("Failed convert JSON / Error: {}", e.getMessage());
        }

        return new ru.mycrg.gis.dto.FeatureDescription(featureDescription.getClassName());
    }

    public static JsonNode convertToJsonNode(Object object) {
        try {
            return JacksonUtil.toJsonNode(getJsonString(object));
        } catch (JsonProcessingException e) {
            log.error("Failed convert to jsonNode: {}", e.getMessage());

            return JacksonUtil.toJsonNode("");
        }
    }

    static private ru.mycrg.gis.dto.FeatureDescription mapDtoToFeatureDescription(FeatureDescriptionDto dto) {
        ru.mycrg.gis.dto.FeatureDescription featureDescription = new ru.mycrg.gis.dto.FeatureDescription();

        featureDescription.setName(dto.getName());
        featureDescription.setOriginName(dto.getOriginName());
        featureDescription.setTitle(dto.getTitle());
        featureDescription.setDescription(dto.getDescription());
        featureDescription.setTableName(dto.getTableName());

        dto.getProperties().forEach(propertyDto -> {
            mapDtoToProperty(propertyDto).ifPresent(featureDescription::addProperty);
        });

        return featureDescription;
    }

    static private Optional<AbstractProperty> mapDtoToProperty(SimplePropertyDto propertyDto) {
        if (propertyDto.getValueType() == ValueType.STRING) {
            StringProperty stringProperty = new StringProperty();

            fillCommonField(stringProperty, propertyDto);

            stringProperty.setLength(propertyDto.getLength());
            stringProperty.setMinLength(propertyDto.getMinLength());
            stringProperty.setMaxLength(propertyDto.getMaxLength());

            return Optional.of(stringProperty);
        } else if (propertyDto.getValueType() == ValueType.INT) {
            IntegerProperty integerProperty = new IntegerProperty();

            fillCommonField(integerProperty, propertyDto);

            integerProperty.setMaxInclusive(propertyDto.getMaxInclusive());
            integerProperty.setMinInclusive(propertyDto.getMinInclusive());
            integerProperty.setFractionDigits(propertyDto.getFractionDigits());
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

            doubleProperty.setTotalDigits(propertyDto.getTotalDigits());
            doubleProperty.setFractionDigits(propertyDto.getFractionDigits());

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
        target.setWhiteSpace(dto.getWhiteSpace());
        target.setPattern(dto.getPattern());
        target.setPatternDescription(dto.getPatternDescription());
    }

    @Nullable
    static private String getJsonString(Object classType) throws JsonProcessingException {
        return new ObjectMapper().writer()
                .withDefaultPrettyPrinter()
                .writeValueAsString(classType);
    }

}
