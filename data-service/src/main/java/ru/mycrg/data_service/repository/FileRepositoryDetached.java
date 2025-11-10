package ru.mycrg.data_service.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.mappers.FilesMapper;

import java.sql.SQLException;
import java.util.Optional;
import java.util.UUID;

@Repository
public class FileRepositoryDetached {

    public Optional<File> findByIdentifier(JdbcTemplate jdbcTemplate, UUID identifier) {
        String sql = "SELECT id, title, size, extension, path, content_type, intents, resource_type," +
                " resource_qualifier, created_by, created_at, crs, ecp" +
                " FROM files WHERE id = ?";

        try {
            File result = jdbcTemplate.queryForObject(sql, new FilesMapper(), identifier);

            return Optional.ofNullable(result);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public void deleteByIdentifier(JdbcTemplate jdbcTemplate, UUID identifier) throws SQLException {
        String sql = "DELETE FROM files WHERE id = ?";

        try {
            jdbcTemplate.update(sql, identifier);
        } catch (Exception e) {
            throw new SQLException("Удалить запись о файле невозможно. Причина => " + e.getMessage());
        }
    }
}
