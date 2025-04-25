package ru.mycrg.data_service.dao.mappers;

import com.fasterxml.jackson.core.type.TypeReference;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.data_service_contract.dto.DocumentVersioningDto;
import ru.mycrg.data_service_contract.dto.FileDescription;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.ValueType;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static java.sql.Types.*;
import static java.util.Objects.isNull;
import static ru.mycrg.data_service.config.CrgCommonConfig.SYSTEM_DATETIME_PATTERN;
import static ru.mycrg.data_service.util.DetailedLogger.logError;
import static ru.mycrg.data_service.util.JsonConverter.mapper;
import static ru.mycrg.data_service.service.schemas.SchemaUtil.getPropertyByName;
import static ru.mycrg.data_service_contract.enums.ValueType.*;

public class BySchemaRowMapper {

    private final Logger log = LoggerFactory.getLogger(BySchemaRowMapper.class);

    final SchemaDto schema;

    public BySchemaRowMapper(SchemaDto schema) {
        this.schema = schema;
    }

    void extract(ResultSet rs, Map<String, Object> properties) throws SQLException {
        ResultSetMetaData metaData = rs.getMetaData();
        int i = 1;
        while (i <= metaData.getColumnCount()) {
            String columnName = metaData.getColumnName(i);

            switch (metaData.getColumnType(i)) {
                case BIT:
                    properties.put(columnName, rs.getBoolean(i));
                    break;
                case BIGINT:
                    if (isNull(rs.getObject(i))) {
                        properties.put(columnName, null);
                    } else {
                        properties.put(columnName, rs.getLong(i));
                    }

                    break;
                case INTEGER:
                    if (isNull(rs.getObject(i))) {
                        properties.put(columnName, null);
                    } else {
                        properties.put(columnName, rs.getInt(i));
                    }

                    break;
                case TIMESTAMP:
                    Timestamp timestamp = rs.getTimestamp(i);
                    if (timestamp != null) {
                        properties.put(columnName,
                                       timestamp.toLocalDateTime()
                                                .format(DateTimeFormatter.ofPattern(SYSTEM_DATETIME_PATTERN)));
                    } else {
                        properties.put(columnName, null);
                    }

                    break;
                case OTHER:
                    if (rs.getObject(i) != null && schema != null) {
                        handleOtherTypesBySchema(properties, columnName, rs.getObject(i));
                    } else {
                        properties.put(columnName, rs.getString(i));
                    }
                    break;
                default:
                    properties.put(columnName, rs.getString(i));
                    break;
            }

            i++;
        }
    }

    void handleOtherTypesBySchema(Map<String, Object> properties,
                                  String columnName,
                                  @NotNull Object object) {
        try {
            // Костыляка для 'versions' - поле не добавляется в схему
            if (VERSIONS.name().equalsIgnoreCase(columnName)) {
                List<DocumentVersioningDto> descriptions = mapper
                        .readValue(object.toString(),
                                   new TypeReference<List<DocumentVersioningDto>>() {
                                   });

                properties.put(columnName, descriptions);

                return;
            }

            Optional<SimplePropertyDto> oProperty = getPropertyByName(schema, columnName);
            if (oProperty.isEmpty()) {
                log.warn("Не удалось найти свойство: '{}' в схеме: '{}'", columnName, schema.getName());
                properties.put(columnName, object.toString());

                return;
            }

            SimplePropertyDto property = oProperty.get();
            ValueType valueType = property.getValueTypeAsEnum();
            if (valueType.equals(FILE)) {
                List<FileDescription> descriptions = mapper.readValue(object.toString(),
                                                                      new TypeReference<List<FileDescription>>() {
                                                                      });

                properties.put(columnName, descriptions);
            } else if (valueType.equals(UUID)) {
                properties.put(columnName, object.toString());
            } else if (valueType.equals(GEOMETRY)) {
                properties.put(columnName, object.toString());
            } else {
                log.warn("Unknown property type: {}", valueType);
            }
        } catch (Exception e) {
            logError("Не удалось обработать колонку: '" + columnName + "'", e);

            properties.put(columnName, object.toString());
        }
    }
}
