package ru.mycrg.data_service.service.gpkg.export.tables;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;

@Repository
public class MediaFilesWriter implements ICrgGpkgTables {

    private final Logger log = LoggerFactory.getLogger(MediaFilesWriter.class);

    public static final String GPKG_MEDIA_FILES_TABLE = "crg_media_files";
    public static final String GPKG_MEDIA_FILES_ID_COLUMN = "id";

    public void createTableIfNotExist(Connection connection) throws SQLException {
        String createSql = "CREATE TABLE IF NOT EXISTS " + GPKG_MEDIA_FILES_TABLE + " (" +
                GPKG_MEDIA_FILES_ID_COLUMN + "     INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "data            BLOB    NOT NULL," +
                "crg_id          TEXT    NOT NULL," +
                "crg_resource_id TEXT            ," +
                "name            TEXT    NOT NULL," +
                "title           TEXT    NOT NULL," +
                "type            TEXT    NOT NULL," +
                "size            TEXT    );";

        try (PreparedStatement stmt = connection.prepareStatement(createSql)) {
            stmt.executeUpdate();
            log.debug("Создана если не существовала таблица {}", GPKG_MEDIA_FILES_TABLE);
        }
    }

    public Long insert(Connection connection, byte[] fileContent, UUID id, String resourceId,
                       String path, String title, String extension, Long size) throws SQLException {
        String insertSql = "INSERT INTO crg_media_files " +
                "(data, crg_id, crg_resource_id, name, title, type, size) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?)";

        try (PreparedStatement stmt = connection.prepareStatement(insertSql, PreparedStatement.RETURN_GENERATED_KEYS)) {
            stmt.setBytes(1, fileContent);
            stmt.setString(2, id.toString());
            stmt.setString(3, resourceId);
            stmt.setString(4, path);
            stmt.setString(5, title);
            stmt.setString(6, extension);
            stmt.setString(7, size != null ? size.toString() : null);

            stmt.executeUpdate();

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    Long mediaId = generatedKeys.getLong(1);
                    log.debug("Сохранили файл {} в таблицу crg_media_files с id={}", title, mediaId);

                    return mediaId;
                } else {
                    log.warn("Не удалось получить ID созданной записи для файла {}", title);

                    return -418L;
                }
            }
        }
    }
}
