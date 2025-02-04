package ru.mycrg.data_service.dao.mappers;

import org.jetbrains.annotations.Nullable;
import org.springframework.jdbc.core.RowMapper;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.dto.record.RecordEntity;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.sql.ResultSet;
import java.sql.SQLException;

public class RecordRowMapper extends BySchemaRowMapper implements RowMapper<IRecord> {

    public RecordRowMapper(@Nullable SchemaDto schema) {
        super(schema);
    }

    @Override
    public IRecord mapRow(ResultSet rs, int rowNum) throws SQLException {
        RecordEntity record = new RecordEntity();

        extract(rs, record.getContent());

        return record;
    }
}
