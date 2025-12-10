package ru.mycrg.data_service.service.gpkg.export.tables;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service_contract.dto.gpkg.StyleWithIcons;
import ru.mycrg.data_service_contract.dto.gpkg.SvgIcon;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

@Repository
public class SvgContentWriter implements ICrgGpkgTables {

    private final Logger log = LoggerFactory.getLogger(SvgContentWriter.class);

    public static final String GPKG_SVG_CONTENT_TABLE = "crg_svg_content_table";
    public static final String GPKG_SVG_STYLE_NAME_COLUMN = "style_name";
    public static final String GPKG_SVG_SVG_NAME_COLUMN = "svg_name";
    public static final String GPKG_SVG_SVG_BODY_COLUMN = "svg_body";

    public void createTableIfNotExist(Connection connection) throws SQLException {
        String createTableSql = "CREATE TABLE IF NOT EXISTS " + GPKG_SVG_CONTENT_TABLE + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                GPKG_SVG_STYLE_NAME_COLUMN + " TEXT NOT NULL," +
                GPKG_SVG_SVG_NAME_COLUMN + " TEXT NOT NULL, " +
                GPKG_SVG_SVG_BODY_COLUMN + " TEXT NOT NULL)";

        try (PreparedStatement stmt = connection.prepareStatement(createTableSql)) {
            stmt.executeUpdate();
            log.debug("Создана если не существовала таблица: " + GPKG_SVG_CONTENT_TABLE);
        }
    }

    public void insert(Connection connection, StyleWithIcons styleAndSvg) throws SQLException {
        List<SvgIcon> svgIcons = styleAndSvg.getSvg();

        //нужно постараться батчем
        for (SvgIcon svg: svgIcons) {
            String insertSql = "INSERT INTO " + GPKG_SVG_CONTENT_TABLE +
                    " (" + GPKG_SVG_STYLE_NAME_COLUMN + ", " + GPKG_SVG_SVG_NAME_COLUMN + ", " + GPKG_SVG_SVG_BODY_COLUMN + ")" +
                    " VALUES (?, ?, ?)";

            try (PreparedStatement stmt = connection.prepareStatement(insertSql)) {
                stmt.setString(1, styleAndSvg.getName());
                stmt.setString(2, svg.getName());
                stmt.setString(3, svg.getBody());

                stmt.executeUpdate();
            }
            log.debug("Сохранили информацию о svg в таблицу: {}",
                      GPKG_SVG_CONTENT_TABLE);
        }
    }
}
