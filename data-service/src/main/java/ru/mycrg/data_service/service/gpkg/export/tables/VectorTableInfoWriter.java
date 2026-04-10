package ru.mycrg.data_service.service.gpkg.export.tables;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service_contract.dto.ExportResourceModel;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

@Repository
public class VectorTableInfoWriter implements ICrgGpkgTables {

    private static final Logger log = LoggerFactory.getLogger(VectorTableInfoWriter.class);

    public static final String GPKG_VECTOR_TABLE_INFO_TABLE = "crg_vector_table_info";

    public static final String GPKG_VECTOR_TABLE_NAME_COLUMN = "layer_name";
    public static final String GPKG_VECTOR_TABLE_EPSG_CODE_COLUMN = "epsg_code";
    public static final String GPKG_VECTOR_TABLE_DESCRIPTION_COLUMN = "description";
    public static final String GPKG_VECTOR_TABLE_RESOURCE_NAME_COLUMN = "resource_name";

    public void createTableIfNotExist(Connection connection) throws SQLException {
        String createTableSql = "CREATE TABLE IF NOT EXISTS " + GPKG_VECTOR_TABLE_INFO_TABLE + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                GPKG_VECTOR_TABLE_RESOURCE_NAME_COLUMN + " TEXT NOT NULL, " +
                GPKG_VECTOR_TABLE_NAME_COLUMN + " TEXT NOT NULL, " +
                GPKG_VECTOR_TABLE_EPSG_CODE_COLUMN + " TEXT NOT NULL, " +
                GPKG_VECTOR_TABLE_DESCRIPTION_COLUMN + ")";

        try (PreparedStatement stmt = connection.prepareStatement(createTableSql)) {
            stmt.executeUpdate();
            log.debug("Создана если не существовала таблица " + GPKG_VECTOR_TABLE_INFO_TABLE);
        }
    }

    public void insert(Connection connection,
                       String title,
                       String epsg,
                       String description,
                       ExportResourceModel tableFullName) throws SQLException {
        String insertSql = "INSERT INTO " + GPKG_VECTOR_TABLE_INFO_TABLE +
                " (" + GPKG_VECTOR_TABLE_RESOURCE_NAME_COLUMN + ", " + GPKG_VECTOR_TABLE_NAME_COLUMN + ", "
                + GPKG_VECTOR_TABLE_EPSG_CODE_COLUMN + "," + GPKG_VECTOR_TABLE_DESCRIPTION_COLUMN + ")" +
                " VALUES (?, ?, ?, ?)";

        try (PreparedStatement stmt = connection.prepareStatement(insertSql)) {
            stmt.setString(1, tableFullName.toString());
            stmt.setString(2, title);
            stmt.setString(3, epsg);
            stmt.setString(4, description);

            stmt.executeUpdate();
            log.debug("Сохранили информацию о векторной таблице {} в таблицу: {} layer={}, epsg={}",
                      tableFullName, GPKG_VECTOR_TABLE_INFO_TABLE, title, epsg);
        }
    }
}
