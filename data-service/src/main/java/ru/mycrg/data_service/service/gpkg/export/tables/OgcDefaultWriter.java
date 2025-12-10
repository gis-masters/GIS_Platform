package ru.mycrg.data_service.service.gpkg.export.tables;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import static java.time.LocalTime.now;

@Repository
public class OgcDefaultWriter {

    private final Logger log = LoggerFactory.getLogger(OgcDefaultWriter.class);

    public void insert(Connection connection, String tableName, String description) throws SQLException {
        String insertSql =
                "INSERT OR IGNORE INTO gpkg_contents" +
                        " (table_name, data_type, identifier, last_change, srs_id, description)" +
                        " VALUES (?, ?, ?, ?, ?, ?)";

        try (PreparedStatement stmt = connection.prepareStatement(insertSql)) {
            stmt.setString(1, tableName);
            stmt.setString(2, "attributes");
            stmt.setString(3, tableName);
            stmt.setString(4, String.valueOf(now()));
            stmt.setInt(5, 0);
            stmt.setString(6, description);

            stmt.executeUpdate();
            log.debug("Сохранили данные о таблице {} в системной таблице gpkg_contents", tableName);
        }
    }

    public void insert(Connection connection, String tableName) throws SQLException {
        String insertSql =
                "INSERT OR IGNORE INTO gpkg_extensions" +
                        " (table_name, extension_name, definition, scope)" +
                        " VALUES (?, ?, ?, ?)";

        try (PreparedStatement stmt = connection.prepareStatement(insertSql)) {
            stmt.setString(1, tableName);
            stmt.setString(2, "gpkg_related_tables");
            stmt.setString(3, "http://docs.opengeospatial.org/is/18-000/18-000.html");
            stmt.setString(4, "read-write");

            stmt.executeUpdate();
            log.debug("Сохранили данные о таблице {} в системной таблице gpkg_extensions", tableName);
        }
    }
}
