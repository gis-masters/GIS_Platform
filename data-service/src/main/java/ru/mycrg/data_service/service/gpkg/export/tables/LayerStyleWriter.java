package ru.mycrg.data_service.service.gpkg.export.tables;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service_contract.dto.gpkg.StyleWithIcons;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import static java.time.LocalTime.now;
import static ru.mycrg.data_service.dao.config.DaoProperties.DEFAULT_GEOMETRY_COLUMN_NAME;

/**
 * Таблица понимается QGIS-ом, менять её название или структуру нельзя!
 */
@Repository
public class LayerStyleWriter implements ICrgGpkgTables {

    private final Logger log = LoggerFactory.getLogger(LayerStyleWriter.class);

    public static final String GPKG_STYLE_LAYER_TABLE = "layer_styles"; //имя, которое понимает QGIS

    public void createTableIfNotExist(Connection connection) throws SQLException {
        String createTableSql = "CREATE TABLE IF NOT EXISTS " + GPKG_STYLE_LAYER_TABLE + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "f_table_catalog TEXT, " +
                "f_table_schema TEXT, " +
                "f_table_name TEXT, " +
                "f_geometry_column TEXT, " +
                "styleName TEXT, " +
                "styleQML TEXT, " +
                "styleSLD TEXT, " +
                "useAsDefault INTEGER, " +
                "description TEXT, " +
                "owner TEXT, " +
                "ui TEXT, " +
                "update_time TEXT)";

        try (PreparedStatement stmt = connection.prepareStatement(createTableSql)) {
            stmt.executeUpdate();
            log.debug("Создана если не существовала таблица: " + GPKG_STYLE_LAYER_TABLE);
        }
    }

    public void insert(Connection connection, StyleWithIcons styleAndSvg) throws SQLException {
        String insertSql = "INSERT INTO " + GPKG_STYLE_LAYER_TABLE +
                " (f_table_name, f_geometry_column, styleName, " +
                "styleSLD, useAsDefault, description, update_time)" +
                " VALUES (?, ?, ?, ?, ?, ?, ?)";

        try (PreparedStatement stmt = connection.prepareStatement(insertSql)) {
            //не хватает привязки к имени таблицы
            stmt.setString(1, "имя таблицы к которой привязываемся");

            stmt.setString(2, DEFAULT_GEOMETRY_COLUMN_NAME);
            stmt.setString(3, styleAndSvg.getName());
            stmt.setString(4, styleAndSvg.getBody());
            stmt.setInt(5, 1);
            stmt.setString(6, "Стиль создан и добавлен CrimeanResearchGroup");
            stmt.setString(7, String.valueOf(now()));

            stmt.executeUpdate();
            log.debug("Сохранили информацию о стиле слоя {} в таблицу: {}", "имя таблицы к которой привязываемся",
                      GPKG_STYLE_LAYER_TABLE);
        }
    }
}
