package ru.mycrg.data_service.service.gpkg.export.tables;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service_contract.dto.ExportResourceModel;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

@Repository
public class VectorTableSchemasWriter implements ICrgGpkgTables {

    private final Logger log = LoggerFactory.getLogger(VectorTableSchemasWriter.class);

    public static final String GPKG_VECTOR_TABLE_SCHEMAS_TABLE = "crg_vector_table_schemas";

    public static final String GPKG_SCHEMA_NAME_COLUMN = "schema_name";
    public static final String GPKG_SCHEMA_JSON_COLUMN = "schema_json";
    public static final String GPKG_SCHEMA_RESOURCE_NAME_COLUMN = "resource_name";

    public void createTableIfNotExist(Connection connection) throws SQLException {
        String createTableSql = "CREATE TABLE IF NOT EXISTS " + GPKG_VECTOR_TABLE_SCHEMAS_TABLE + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                GPKG_SCHEMA_RESOURCE_NAME_COLUMN + " TEXT NOT NULL, " +
                GPKG_SCHEMA_NAME_COLUMN + " TEXT NOT NULL DEFAULT 'system_schema', " +
                GPKG_SCHEMA_JSON_COLUMN + " TEXT NOT NULL)";

        try (PreparedStatement stmt = connection.prepareStatement(createTableSql)) {
            stmt.executeUpdate();
            log.debug("Создана если не существовала таблица:" + GPKG_VECTOR_TABLE_SCHEMAS_TABLE);
        }
    }

    public void insert(Connection connection,
                       String schemaJson,
                       ExportResourceModel tableFullName) throws SQLException {
        String insertSql =
                "INSERT INTO " + GPKG_VECTOR_TABLE_SCHEMAS_TABLE +
                        " (" + GPKG_SCHEMA_RESOURCE_NAME_COLUMN + ", " + GPKG_SCHEMA_NAME_COLUMN + ", " + GPKG_SCHEMA_JSON_COLUMN + ")" +
                        " VALUES (?, ?, ?)";

        try (PreparedStatement stmt = connection.prepareStatement(insertSql)) {
            stmt.setString(1, tableFullName.toString());
            stmt.setString(2, "system_schema");
            stmt.setString(3, schemaJson);

            stmt.executeUpdate();
            log.debug("Сохранили схему для таблицы {} в таблицу: {}", tableFullName, GPKG_VECTOR_TABLE_SCHEMAS_TABLE);
        }
    }
}
