package ru.mycrg.data_service.service.gpkg.export.tables;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

@Repository
public class MediaToFeaturesWriter implements ICrgGpkgTables {

    private final Logger log = LoggerFactory.getLogger(MediaToFeaturesWriter.class);

    public static final String GPKG_MEDIA_TO_FEATURES_TABLE = "crg_media_to_features";

    public void createTableIfNotExist(Connection connection) throws SQLException {
        String createSql = "CREATE TABLE IF NOT EXISTS " + GPKG_MEDIA_TO_FEATURES_TABLE + " (" +
                "id    INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "feature_id   INTEGER NOT NULL, " +
                "media_id     INTEGER NOT NULL);";

        try (PreparedStatement stmt = connection.prepareStatement(createSql)) {
            stmt.executeUpdate();
            log.debug("Создана если не существовала таблица {}", GPKG_MEDIA_TO_FEATURES_TABLE);
        }
    }

    public void insert(Connection connection, Long mediaId, Long featureId) {
        String insertSql = "INSERT INTO crg_media_to_features (feature_id, media_id) VALUES (?, ?)";

        try (PreparedStatement stmt = connection.prepareStatement(insertSql)) {
            stmt.setLong(1, featureId);
            stmt.setLong(2, mediaId);

            stmt.executeUpdate();
            log.debug("Создана связь между feature_id={} и media_id={} в таблице crg_media_to_features", featureId,
                      mediaId);
        } catch (SQLException e) {
            log.error("Не удалось создать связь между feature_id={} и media_id={}. Причина: {}", featureId, mediaId,
                      e.getMessage());
        }
    }
}
