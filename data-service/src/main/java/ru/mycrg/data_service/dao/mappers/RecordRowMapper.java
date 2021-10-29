package ru.mycrg.data_service.dao.mappers;

import org.springframework.jdbc.core.RowMapper;
import ru.mycrg.data_service.dto.RecordDto;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;

public class RecordRowMapper implements RowMapper<RecordDto> {

    @Override
    public RecordDto mapRow(ResultSet rs, int rowNum) throws SQLException {
        final RecordDto recordDto = new RecordDto();

        final ResultSetMetaData metaData = rs.getMetaData();
        int i = 1;
        while (i <= metaData.getColumnCount()) {
            if (metaData.getColumnClassName(i).contains("Boolean")) {
                recordDto.put(metaData.getColumnName(i), rs.getBoolean(i));
            } else if (metaData.getColumnClassName(i).contains("Long")) {
                recordDto.put(metaData.getColumnName(i), rs.getLong(i));
            } else {
                recordDto.put(metaData.getColumnName(i), rs.getString(i));
            }

            i++;
        }

        return recordDto;
    }
}
