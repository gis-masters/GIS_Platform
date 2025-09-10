package ru.mycrg.data_service.repository;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.entity.SchemasAndTables;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

@Repository
public class SchemasAndTablesRepositoryDetached {

    public Optional<SchemasAndTables> findByIdentifier(JdbcTemplate jdbcTemplate, String identifier) {
        String sql = "SELECT id, identifier, path, schema, title, crs FROM schemas_and_tables WHERE identifier = ?";

        try {
            SchemasAndTables result = jdbcTemplate.queryForObject(sql, new SchemasAndTablesRowMapper(), identifier);
            return Optional.ofNullable(result);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public void save(JdbcTemplate jdbcTemplate, SchemasAndTables entity) {
        String sql = "INSERT INTO schemas_and_tables " +
                "(title, details, is_folder, identifier, path, crs, schema, created_at, last_modified) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?::jsonb, ?, ?)";

        jdbcTemplate.update(sql,
                            entity.getTitle(),
                            entity.getDetails(),
                            entity.isFolder(),
                            entity.getIdentifier(),
                            entity.getPath(),
                            entity.getCrs(),
                            entity.getSchema() != null ? entity.getSchema().toString() : null,
                            entity.getCreatedAt(),
                            entity.getLastModified()
        );
    }

    private static class SchemasAndTablesRowMapper implements RowMapper<SchemasAndTables> {

        private static final ObjectMapper objectMapper = new ObjectMapper();

        @Override
        public SchemasAndTables mapRow(ResultSet rs, int rowNum) throws SQLException {
            SchemasAndTables entity = new SchemasAndTables();
            entity.setId(rs.getLong("id"));
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
}