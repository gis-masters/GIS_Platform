package ru.mycrg.data_service.mappers;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.jdbc.core.RowMapper;
import ru.mycrg.data_service.entity.File;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;

import static ru.mycrg.data_service.dao.config.DaoProperties.ID;
import static ru.mycrg.http_client.JsonConverter.toJsonNode;

public class FilesMapper implements RowMapper<File> {

    @Override
    public File mapRow(ResultSet rs, int rowNum) throws SQLException {
        File entity = new File();
        entity.setId(UUID.fromString(rs.getString(ID)));
        entity.setTitle(rs.getString("title"));
        entity.setSize(rs.getLong("size"));
        entity.setExtension(rs.getString("extension"));
        entity.setPath(rs.getString("path"));
        entity.setContentType(rs.getString("content_type"));
        entity.setIntents(rs.getString("intents"));
        entity.setResourceType(rs.getString("resource_type"));

        entity.setCreatedBy(rs.getString("created_by"));
        entity.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        entity.setEcp(rs.getBytes("ecp"));

        // Правильная десериализация JSON поля schema
        String resourceQualifier = rs.getString("resource_qualifier");
        if (resourceQualifier != null && !resourceQualifier.trim().isEmpty()) {
            try {
                JsonNode rq = toJsonNode(resourceQualifier);
                entity.setResourceQualifier(rq);
            } catch (Exception e) {
                // Логируем ошибку, но не прерываем выполнение
                entity.setResourceQualifier(null);
            }
        } else {
            entity.setResourceQualifier(null);
        }

        return entity;
    }
}
