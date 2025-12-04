package ru.mycrg.data_service.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.dao.mappers.SchemasAndTablesShortMapper;

import java.util.Optional;

@Repository
public class SchemasAndTablesRepositoryDetached {

    public Optional<SchemasAndTables> findByIdentifier(JdbcTemplate jdbcTemplate, String identifier) {
        String sql = "SELECT id, identifier, path, schema, title, crs FROM schemas_and_tables WHERE identifier = ?";

        try {
            SchemasAndTables result = jdbcTemplate.queryForObject(sql, new SchemasAndTablesShortMapper(), identifier);
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
}
