package ru.mycrg.data_service.dao.mappers;

import org.springframework.jdbc.core.RowMapper;
import ru.mycrg.data_service.entity.Schema;
import ru.mycrg.data_service.util.JsonConverter;

import java.sql.ResultSet;
import java.sql.SQLException;

public class SchemaMapper implements RowMapper<Schema> {

    @Override
    public Schema mapRow(ResultSet rs, int rowNum) throws SQLException {
        Schema schema = new Schema();

        schema.setName(rs.getString("name"));
        schema.setCalculatedFields(rs.getString("calculated_fields"));
        schema.setCustomRule(rs.getString("custom_rule"));

        String classRule = rs.getString("class_rule");
        schema.setClassRule(JsonConverter.toJsonNode(classRule));

        return schema;
    }
}
