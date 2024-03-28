package ru.mycrg.data_service.dao.mappers;

import org.springframework.jdbc.core.RowMapper;
import ru.mycrg.data_service.entity.DocumentLibrary;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;

import static ru.mycrg.data_service.util.JsonConverter.toJsonNode;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.PATH;

public class DocLibraryMapper implements RowMapper<DocumentLibrary> {

    @Override
    public DocumentLibrary mapRow(ResultSet rs, int rowNum) throws SQLException {
        DocumentLibrary dl = new DocumentLibrary();

        dl.setId(rs.getInt("id"));
        dl.setTitle(rs.getString("title"));
        dl.setDetails(rs.getString("details"));
        dl.setPath(rs.getString(PATH.getName()));
        dl.setTableName(rs.getString("table_name"));
        dl.setCreatedBy(rs.getString("created_by"));
        dl.setVersioned(rs.getBoolean("versioned"));
        dl.setReadyForFts(rs.getBoolean("ready_for_fts"));

        String schemaAsJson = rs.getString("schema");
        dl.setSchema(toJsonNode(schemaAsJson));

        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) {
            dl.setCreatedAt(createdAt.toLocalDateTime());
        }

        Timestamp lastModified = rs.getTimestamp("last_modified");
        if (lastModified != null) {
            dl.setLastModified(lastModified.toLocalDateTime());
        }

        return dl;
    }
}
