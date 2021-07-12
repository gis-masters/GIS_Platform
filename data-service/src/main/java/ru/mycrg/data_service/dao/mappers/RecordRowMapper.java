package ru.mycrg.data_service.dao.mappers;

import org.springframework.jdbc.core.RowMapper;
import ru.mycrg.data_service.dto.Record;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;

public class RecordRowMapper implements RowMapper<Record> {

    @Override
    public Record mapRow(ResultSet rs, int rowNum) throws SQLException {
        final Record record = new Record();

        final ResultSetMetaData metaData = rs.getMetaData();
        int i = 1;
        while (i <= metaData.getColumnCount()) {
            record.put(metaData.getColumnName(i), rs.getString(i));
            i++;
        }

        return record;
    }
}
