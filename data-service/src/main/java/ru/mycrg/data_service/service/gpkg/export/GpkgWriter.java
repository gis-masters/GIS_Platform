package ru.mycrg.data_service.service.gpkg.export;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Repository
public class GpkgWriter {

    private final Logger log = LoggerFactory.getLogger(GpkgWriter.class);

    public static final String GPKG_SYSTEM_SCHEMAS_TABLE = "gpkg_system_schemas";
    public static final String GPKG_LAYER_INFO = "gpkg_layer_info";

    protected void createSchemaTable(Connection connection) throws SQLException {
        String createTableSql = "CREATE TABLE IF NOT EXISTS " + GPKG_SYSTEM_SCHEMAS_TABLE + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "schema_name TEXT NOT NULL DEFAULT 'system_schema', " +
                "schema_json TEXT NOT NULL, " +
                "created_at TEXT NOT NULL, " +
                "description TEXT" +
                ")";

        try (PreparedStatement stmt = connection.prepareStatement(createTableSql)) {
            stmt.executeUpdate();
            log.debug("Создана если не существовала таблица:" + GPKG_SYSTEM_SCHEMAS_TABLE);
        }
    }

    protected void saveSchema(Connection connection, String schemaJson) throws SQLException {
        String insertSql = "INSERT INTO " + GPKG_SYSTEM_SCHEMAS_TABLE + " (schema_name, schema_json, created_at, description) " +
                "VALUES (?, ?, ?, ?)";

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        try (PreparedStatement stmt = connection.prepareStatement(insertSql)) {
            stmt.setString(1, "system_schema");
            stmt.setString(2, schemaJson);
            stmt.setString(3, timestamp);
            stmt.setString(4, "System schema appended via GpkgAppender");

            stmt.executeUpdate();
            log.debug("Сохранили схему в таблицу: " + GPKG_SYSTEM_SCHEMAS_TABLE);
        }
    }

    protected void createLayerInfoTable(Connection connection) throws SQLException {
        String createTableSql = "CREATE TABLE IF NOT EXISTS " + GPKG_LAYER_INFO + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "layer_name TEXT NOT NULL, " +
                "epsg_code TEXT NOT NULL, " +
                "created_at TEXT NOT NULL, " +
                "description TEXT" +
                ")";

        try (PreparedStatement stmt = connection.prepareStatement(createTableSql)) {
            stmt.executeUpdate();
            log.debug("Создана если не существовала таблица " + GPKG_LAYER_INFO);
        }
    }

    protected void saveLayerInfo(Connection connection, String layerName, String epsg) throws SQLException {
        String insertSql = "INSERT INTO " + GPKG_LAYER_INFO + " (layer_name, epsg_code, created_at, description) " +
                "VALUES (?, ?, ?, ?)";

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        try (PreparedStatement stmt = connection.prepareStatement(insertSql)) {
            stmt.setString(1, layerName);
            stmt.setString(2, epsg);
            stmt.setString(3, timestamp);
            stmt.setString(4, "Layer info appended via GpkgAppender");

            stmt.executeUpdate();
            log.debug("Сохранили информацию о векторной таблицы в таблицу:  " + GPKG_LAYER_INFO + " table: layer={}, " +
                              "epsg={}", layerName, epsg);
        }
    }
}
