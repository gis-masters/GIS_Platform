package ru.mycrg.data_service.dao.mappers;

import org.springframework.jdbc.core.RowMapper;
import ru.mycrg.data_service.entity.SchemaTemplate;

import java.sql.ResultSet;
import java.sql.SQLException;

import static ru.mycrg.http_client.JsonConverter.toJsonNode;

public class SchemaMapper implements RowMapper<SchemaTemplate> {

    @Override
    public SchemaTemplate mapRow(ResultSet rs, int rowNum) throws SQLException {
        SchemaTemplate schemaTemplate = new SchemaTemplate();

        schemaTemplate.setName(rs.getString("name"));
        schemaTemplate.setCalculatedFields(rs.getString("calculated_fields"));
        schemaTemplate.setCustomRule(rs.getString("custom_rule"));

        String classRule = rs.getString("class_rule");
        schemaTemplate.setClassRule(toJsonNode(classRule));

        return schemaTemplate;
    }
}
