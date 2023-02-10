package ru.mycrg.data_service.dao.mappers;

import com.fasterxml.jackson.core.type.TypeReference;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.data_service_contract.dto.FileDescription;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.ValueType;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static ru.mycrg.data_service.util.JsonConverter.mapper;
import static ru.mycrg.data_service.util.DetailedLogger.logError;
import static ru.mycrg.data_service.util.SchemaUtil.getPropertyByName;
import static ru.mycrg.data_service_contract.enums.ValueType.FILE;
import static ru.mycrg.data_service_contract.enums.ValueType.UUID;

public class BySchemaRowMapper {

    private final Logger log = LoggerFactory.getLogger(BySchemaRowMapper.class);

    final SchemaDto schema;

    public BySchemaRowMapper(SchemaDto schema) {
        this.schema = schema;
    }

    void handleBySchema(Map<String, Object> properties,
                        String columnName,
                        @NotNull Object object) {
        try {
            Optional<SimplePropertyDto> oProperty = getPropertyByName(schema, columnName);
            if (oProperty.isPresent()) {
                SimplePropertyDto property = oProperty.get();
                ValueType valueType = property.getValueTypeAsEnum();
                if (valueType.equals(FILE)) {
                    List<FileDescription> descriptions = mapper.readValue(object.toString(),
                                                                          new TypeReference<List<FileDescription>>() {
                                                                          });

                    properties.put(columnName, descriptions);
                } else if (valueType.equals(UUID)) {
                    properties.put(columnName, object.toString());
                } else {
                    log.warn("Unknown property type: {}", valueType);
                }
            } else {
                properties.put(columnName, object.toString());
            }
        } catch (Exception e) {
            logError("Не удалось обработать колонку: '" + columnName + "'", e);

            properties.put(columnName, object.toString());
        }
    }
}
