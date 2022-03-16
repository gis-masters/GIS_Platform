package ru.mycrg.data_service.dao.mappers;

import org.jetbrains.annotations.Nullable;
import org.springframework.jdbc.core.RowMapper;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.RecordEntity;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;

import static java.sql.Types.*;

public class RecordRowMapper extends BySchemaRowMapper implements RowMapper<IRecord> {

    public RecordRowMapper(@Nullable SchemaDto schema) {
        super(schema);
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
                        handleBySchema(record.getContent(), columnName, rs.getObject(i));
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
}
