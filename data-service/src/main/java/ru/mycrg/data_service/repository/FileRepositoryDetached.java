package ru.mycrg.data_service.repository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.dao.mappers.FilesMapper;
import ru.mycrg.data_service.entity.File;

import java.sql.SQLException;
import java.util.*;

@Repository
public class FileRepositoryDetached {

    private final Logger log = LoggerFactory.getLogger(FileRepositoryDetached.class);

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

    public List<File> getAllByIds(JdbcTemplate jdbcTemplate, List<UUID> filesIds) {
        if (filesIds == null || filesIds.isEmpty()) {
            return new ArrayList<>();
        }

        String placeholders = String.join(",", Collections.nCopies(filesIds.size(), "?"));
        String query = "SELECT id, title, size, extension, path, content_type, intents, resource_type," +
                " resource_qualifier, created_by, created_at, crs, ecp" +
                " FROM files WHERE id IN (" + placeholders + ")";

        log.debug("Запрос поиска всех файлов по их ID {}", query);

        try {
            return jdbcTemplate.query(query, new FilesMapper(), filesIds.toArray());
        } catch (Exception e) {
            log.warn("Не удалось найти файлы в базе данных. Причина: {}", e.getMessage());

            return new ArrayList<>();
        }
    }
}
