package ru.mycrg.data_service.util;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.entity.Schema;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.dto.ValueTitleProjection;
import ru.mycrg.data_service_contract.enums.ValueType;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import static ru.mycrg.data_service.service.JsonConverter.mapper;

@Service
public class SchemaHandler {

    private static final Logger log = LoggerFactory.getLogger(SchemaHandler.class);

    public Optional<String> getPropertyNameByType(ValueType type, List<SimplePropertyDto> propertiesList) {
        return propertiesList.stream()
                             .filter(simplePropertyDto -> simplePropertyDto.getValueType().equals(type))
                             .map(SimplePropertyDto::getName)
                             .findFirst();
    }

    public boolean isPropertyExist(SchemaDto schema, String key) {
        return schema.getProperties().stream()
                     .anyMatch(property -> property.getName().equals(key));
    }

    public SchemaDto mapToSchemaDto(Schema schema) {
        try {
            JsonNode classRule = schema.getClassRule();

            final SchemaDto schemaDto = mapper.readValue(classRule.toString(), SchemaDto.class);

            schemaDto.setCustomRuleFunction(schema.getCustomRule());
            schemaDto.setCalcFiledFunction(schema.getCalculatedFields());

            return schemaDto;
        } catch (IOException e) {
            String message = "Failed convert JSON / Error: " + e.getMessage();
            log.warn(message);

            throw new DataServiceException(message);
        }
    }

    public String getEnumerationTitleByValue(SimplePropertyDto property, String value) {
        return property
                .getEnumerations().stream()
                .filter(en -> en.getValue().equals(value))
                .findFirst()
                .map(ValueTitleProjection::getTitle)
                .orElse(value);
    }

    public Optional<SimplePropertyDto> getPropertyByName(SchemaDto schemaDto, String name) {
        return schemaDto
                .getProperties().stream()
                .filter(prDto -> prDto.getName().equalsIgnoreCase(name))
                .findFirst();
    }
}
