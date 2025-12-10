package ru.mycrg.data_service.service.gpkg.export.tables;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import static ru.mycrg.data_service.dao.config.DaoProperties.PRIMARY_KEY;
import static ru.mycrg.data_service.service.gpkg.export.tables.MediaFilesWriter.GPKG_MEDIA_FILES_ID_COLUMN;
import static ru.mycrg.data_service.service.gpkg.export.tables.MediaFilesWriter.GPKG_MEDIA_FILES_TABLE;
import static ru.mycrg.data_service.service.gpkg.export.tables.MediaToFeaturesWriter.GPKG_MEDIA_TO_FEATURES_TABLE;

@Repository
public class GpkgExtRelationsWriter implements ICrgGpkgTables {

    private final Logger log = LoggerFactory.getLogger(GpkgExtRelationsWriter.class);

    public static final String GPKG_EXT_RELATION_TABLE = "gpkgext_relations";

    public void createTableIfNotExist(Connection connection) throws SQLException {
        String createSql = "CREATE TABLE IF NOT EXISTS " + GPKG_EXT_RELATION_TABLE + " (" +
                "id    INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "base_table_name        TEXT," +                    //таблица фичей
                "base_primary_column    TEXT    NOT NULL," +
                "related_table_name     TEXT    NOT NULL," +        //таблица доп контента
                "related_primary_column TEXT    NOT NULL," +
                "relation_name          TEXT    NOT NULL," +
                "mapping_table_name     TEXT    );";

        try (PreparedStatement stmt = connection.prepareStatement(createSql)) {
            stmt.executeUpdate();
            log.debug("Создана если не существовала таблица {}", GPKG_EXT_RELATION_TABLE);
        }
    }

    public void insert(Connection connection, String tableName) throws SQLException {
        String insertSql =
                "INSERT OR IGNORE INTO gpkgext_relations" +
                        " (base_table_name, base_primary_column, related_table_name," +
                        " related_primary_column, relation_name, mapping_table_name)" +
                        " VALUES (?, ?, ?, ?, ?, ?)";

        try (PreparedStatement stmt = connection.prepareStatement(insertSql)) {
            stmt.setString(1, tableName);
            stmt.setString(2, PRIMARY_KEY);
            stmt.setString(3, GPKG_MEDIA_FILES_TABLE);
            stmt.setString(4, GPKG_MEDIA_FILES_ID_COLUMN);
            stmt.setString(5, "media");
            stmt.setString(6, GPKG_MEDIA_TO_FEATURES_TABLE);
            stmt.executeUpdate();

            log.debug("Таблица {} содержит файлы, поэтому упомянута в gpkg_extensions", tableName);
        }
    }
}
