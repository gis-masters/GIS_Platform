package ru.mycrg.data_service.dao.mappers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.entity.SchemasAndTables;

import java.sql.ResultSet;
import java.sql.SQLException;

import static ru.mycrg.data_service.dao.config.DaoProperties.ID;

//TODO: Удалить и использовать полноценного брата (без Short)
@Component
public class SchemasAndTablesShortMapper implements RowMapper<SchemasAndTables> {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public SchemasAndTables mapRow(ResultSet rs, int rowNum) throws SQLException {
        SchemasAndTables entity = new SchemasAndTables();
        entity.setId(rs.getLong(ID));
        entity.setIdentifier(rs.getString("identifier"));
        entity.setPath(rs.getString("path"));
        entity.setTitle(rs.getString("title"));
        entity.setCrs(rs.getString("crs"));

        // Правильная десериализация JSON поля schema
        String schemaJson = rs.getString("schema");
        if (schemaJson != null && !schemaJson.trim().isEmpty()) {
            try {
                JsonNode schema = objectMapper.readTree(schemaJson);
                entity.setSchema(schema);
            } catch (Exception e) {
                // Логируем ошибку, но не прерываем выполнение
                entity.setSchema(null);
            }
        } else {
            entity.setSchema(null);
        }

        return entity;
    }
}
