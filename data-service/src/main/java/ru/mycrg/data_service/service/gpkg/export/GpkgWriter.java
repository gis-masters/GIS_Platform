package ru.mycrg.data_service.service.gpkg.export;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service_contract.dto.ExportResourceModel;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Repository
public class GpkgWriter {

    private final Logger log = LoggerFactory.getLogger(GpkgWriter.class);

    public static final String GPKG_SYSTEM_SCHEMAS_TABLE = "gpkg_system_schemas";
    public static final String GPKG_SCHEMA_JSON_COLUMN = "schema_json";
    public static final String GPKG_SCHEMA_NAME_COLUMN = "schema_name";

    public static final String GPKG_LAYER_INFO_TABLE = "gpkg_layer_info";
    public static final String GPKG_LAYER_NAME_COLUMN = "layer_name";
    public static final String GPKG_LAYER_EPSG_CODE_COLUMN = "epsg_code";

    public static final String GPKG_SCHEMA_TABLE_NAME_COLUMN = "table_name";

    protected void createSchemaTable(Connection connection) throws SQLException {
        String createTableSql = "CREATE TABLE IF NOT EXISTS " + GPKG_SYSTEM_SCHEMAS_TABLE + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                GPKG_SCHEMA_NAME_COLUMN + " TEXT NOT NULL DEFAULT 'system_schema', " +
                GPKG_SCHEMA_TABLE_NAME_COLUMN + " TEXT NOT NULL, " +
                GPKG_SCHEMA_JSON_COLUMN + " TEXT NOT NULL, " +
                "created_at TEXT NOT NULL, " +
                "description TEXT)";

        try (PreparedStatement stmt = connection.prepareStatement(createTableSql)) {
            stmt.executeUpdate();
            log.debug("Создана если не существовала таблица:" + GPKG_SYSTEM_SCHEMAS_TABLE);
        }
    }

    protected void saveSchema(Connection connection, String schemaJson, ExportResourceModel tableFullName)
            throws SQLException {
        String insertSql =
                "INSERT INTO " + GPKG_SYSTEM_SCHEMAS_TABLE +
                        " (" + GPKG_SCHEMA_NAME_COLUMN + ", " + GPKG_SCHEMA_TABLE_NAME_COLUMN + ", " + GPKG_SCHEMA_JSON_COLUMN + ", " +
                        "created_at, description)" +
                        " VALUES (?, ?, ?, ?, ?)";

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        try (PreparedStatement stmt = connection.prepareStatement(insertSql)) {
            stmt.setString(1, "system_schema");
            stmt.setString(2, tableFullName.toString());
            stmt.setString(3, schemaJson);
            stmt.setString(4, timestamp);
            stmt.setString(5, "System schema appended via GpkgAppender for table: " + tableFullName);

            stmt.executeUpdate();
            log.debug("Сохранили схему для таблицы {} в таблицу: {}", tableFullName, GPKG_SYSTEM_SCHEMAS_TABLE);
        }
    }

    protected void createLayerInfoTable(Connection connection) throws SQLException {
        String createTableSql = "CREATE TABLE IF NOT EXISTS " + GPKG_LAYER_INFO_TABLE + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                GPKG_LAYER_NAME_COLUMN + " TEXT NOT NULL, " +
                GPKG_SCHEMA_TABLE_NAME_COLUMN + " TEXT NOT NULL, " +
                GPKG_LAYER_EPSG_CODE_COLUMN + " TEXT NOT NULL, " +
                "created_at TEXT NOT NULL, " +
                "description TEXT)";

        try (PreparedStatement stmt = connection.prepareStatement(createTableSql)) {
            stmt.executeUpdate();
            log.debug("Создана если не существовала таблица " + GPKG_LAYER_INFO_TABLE);
        }
    }

    protected void saveLayerInfo(Connection connection, String layerName, String epsg,
                                 ExportResourceModel tableFullName)
            throws SQLException {
        String insertSql = "INSERT INTO " + GPKG_LAYER_INFO_TABLE +
                " (" + GPKG_LAYER_NAME_COLUMN + ", " + GPKG_SCHEMA_TABLE_NAME_COLUMN + ", " + GPKG_LAYER_EPSG_CODE_COLUMN + "," +
                " created_at, description)" +
                " VALUES (?, ?, ?, ?, ?)";

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        try (PreparedStatement stmt = connection.prepareStatement(insertSql)) {
            stmt.setString(1, layerName);
            stmt.setString(2, tableFullName.toString());
            stmt.setString(3, epsg);
            stmt.setString(4, timestamp);
            stmt.setString(5, "Layer info appended via GpkgAppender for table: " + tableFullName);

            stmt.executeUpdate();
            log.debug("Сохранили информацию о векторной таблице {} в таблицу: {} layer={}, epsg={}",
                      tableFullName, GPKG_LAYER_INFO_TABLE, layerName, epsg);
        }
    }
}
