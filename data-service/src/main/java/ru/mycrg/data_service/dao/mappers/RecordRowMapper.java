package ru.mycrg.data_service.dao.mappers;

import com.fasterxml.jackson.core.type.TypeReference;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.RowMapper;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.RecordEntity;
import ru.mycrg.data_service_contract.dto.FileDescription;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.ValueType;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

import static java.sql.Types.*;
import static ru.mycrg.data_service.service.JsonConverter.mapper;
import static ru.mycrg.data_service.util.DetailedLogger.logError;
import static ru.mycrg.data_service.util.SchemaUtil.getPropertyByName;
import static ru.mycrg.data_service_contract.enums.ValueType.FILE;

public class RecordRowMapper implements RowMapper<IRecord> {

    private final Logger log = LoggerFactory.getLogger(RecordRowMapper.class);

    private final SchemaDto schema;

    public RecordRowMapper(@Nullable SchemaDto schema) {
        this.schema = schema;
    }

    @Override
    public IRecord mapRow(ResultSet rs, int rowNum) throws SQLException {
        RecordEntity record = new RecordEntity();

        ResultSetMetaData metaData = rs.getMetaData();
        int i = 1;
        while (i <= metaData.getColumnCount()) {
            String columnName = metaData.getColumnName(i);

            switch (metaData.getColumnType(i)) {
                case BIT:
                    record.put(columnName, rs.getBoolean(i));
                    break;
                case BIGINT:
                    record.put(columnName, rs.getLong(i));
                    break;
                case OTHER:
                    if (rs.getObject(i) != null && schema != null) {
                        handleBySchema(record, columnName, rs.getObject(i), schema);
                    } else {
                        record.put(columnName, rs.getString(i));
                    }
                    break;
                default:
                    record.put(columnName, rs.getString(i));
                    break;
            }

            i++;
        }

        return record;
    }

    private void handleBySchema(RecordEntity record,
                                String columnName,
                                @NotNull Object object,
                                @NotNull SchemaDto schema) {
        try {
            Optional<SimplePropertyDto> oProperty = getPropertyByName(schema, columnName);
            if (oProperty.isPresent()) {
                SimplePropertyDto property = oProperty.get();
                ValueType valueType = property.getValueType();
                if (valueType.equals(FILE)) {
                    List<FileDescription> descriptions = mapper.readValue(object.toString(),
                                                                          new TypeReference<List<FileDescription>>() {
                                                                          });

                    record.put(columnName, descriptions);
                } else {
                    log.warn("Unknown property type: {}", valueType);
                }
            } else {
                record.put(columnName, object.toString());
            }
        } catch (Exception e) {
            logError("Не удалось обработать колонку: '" + columnName + "'", e);

            record.put(columnName, object.toString());
        }
    }
}
