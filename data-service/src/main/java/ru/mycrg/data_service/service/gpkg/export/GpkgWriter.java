package ru.mycrg.data_service.service.gpkg.export;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service_contract.dto.ExportResourceModel;
import ru.mycrg.data_service_contract.dto.gpkg.StyleWithIcons;
import ru.mycrg.data_service_contract.dto.gpkg.SvgIcon;
import ru.mycrg.gis_service_contract.dto.LayerProjection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.time.LocalTime;
import java.util.List;

import static java.time.LocalTime.now;
import static ru.mycrg.data_service.dao.config.DaoProperties.DEFAULT_GEOMETRY_COLUMN_NAME;
import static ru.mycrg.data_service.service.gpkg.importer.mappers.LayerProjectionMapper.*;

@Repository
public class GpkgWriter {

    private final Logger log = LoggerFactory.getLogger(GpkgWriter.class);

    public static final String GPKG_RESOURCE_NAME_COLUMN = "resource_name";

    public static final String GPKG_VECTOR_TABLE_SCHEMAS_TABLE = "crg_vector_table_schemas";
    public static final String GPKG_SCHEMA_JSON_COLUMN = "schema_json";
    public static final String GPKG_SCHEMA_NAME_COLUMN = "schema_name";

    public static final String GPKG_VECTOR_TABLE_INFO_TABLE = "crg_vector_table_info";
    public static final String GPKG_VECTOR_TABLE_NAME_COLUMN = "layer_name";
    public static final String GPKG_VECTOR_TABLE_EPSG_CODE_COLUMN = "epsg_code";
    public static final String GPKG_VECTOR_TABLE_DESCRIPTION_COLUMN = "description";

    public static final String GPKG_SVG_CONTENT_TABLE = "crg_svg_content_table";
    public static final String GPKG_SVG_STYLE_NAME_COLUMN = "style_name";
    public static final String GPKG_SVG_SVG_NAME_COLUMN = "svg_name";
    public static final String GPKG_SVG_SVG_BODY_COLUMN = "svg_body";

    public static final String GPKG_STYLE_LAYER_TABLE = "layer_styles"; //имя, которое понимает QGIS

    public static final String GPKG_LAYER_INFO_TABLE = "crg_layer_info_table";

    protected void createIfNotExistSchemaTable(Connection connection) throws SQLException {
        String createTableSql = "CREATE TABLE IF NOT EXISTS " + GPKG_VECTOR_TABLE_SCHEMAS_TABLE + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                GPKG_RESOURCE_NAME_COLUMN + " TEXT NOT NULL, " +
                GPKG_SCHEMA_NAME_COLUMN + " TEXT NOT NULL DEFAULT 'system_schema', " +
                GPKG_SCHEMA_JSON_COLUMN + " TEXT NOT NULL)";

        try (PreparedStatement stmt = connection.prepareStatement(createTableSql)) {
            stmt.executeUpdate();
            log.debug("Создана если не существовала таблица:" + GPKG_VECTOR_TABLE_SCHEMAS_TABLE);
        }

        insertInfoInGpkgContentsTable(connection, GPKG_VECTOR_TABLE_SCHEMAS_TABLE);
    }

    private void insertInfoInGpkgContentsTable(Connection connection, String tableName) throws SQLException {
        String insertSql =
                "INSERT OR IGNORE INTO gpkg_contents" +
                        " (table_name, data_type, identifier, last_change, srs_id)" +
                        " VALUES (?, ?, ?, ?, ?)";

        try (PreparedStatement stmt = connection.prepareStatement(insertSql)) {
            stmt.setString(1, tableName);
            stmt.setString(2, "attributes");
            stmt.setString(3, tableName);
            stmt.setString(4, String.valueOf(LocalTime.now()));
            stmt.setInt(5, 0);

            stmt.executeUpdate();
            log.debug("Сохранили данные о таблице {} в системной таблице gpkg_contents", tableName);
        }
    }

    protected void saveSchema(Connection connection, String schemaJson, ExportResourceModel tableFullName)
            throws SQLException {
        String insertSql =
                "INSERT INTO " + GPKG_VECTOR_TABLE_SCHEMAS_TABLE +
                        " (" + GPKG_RESOURCE_NAME_COLUMN + ", " + GPKG_SCHEMA_NAME_COLUMN + ", " + GPKG_SCHEMA_JSON_COLUMN + ")" +
                        " VALUES (?, ?, ?)";

        try (PreparedStatement stmt = connection.prepareStatement(insertSql)) {
            stmt.setString(1, tableFullName.toString());
            stmt.setString(2, "system_schema");
            stmt.setString(3, schemaJson);

            stmt.executeUpdate();
            log.debug("Сохранили схему для таблицы {} в таблицу: {}", tableFullName, GPKG_VECTOR_TABLE_SCHEMAS_TABLE);
        }
    }

    protected void createIfNotExistVectorTableInfoTable(Connection connection) throws SQLException {
        String createTableSql = "CREATE TABLE IF NOT EXISTS " + GPKG_VECTOR_TABLE_INFO_TABLE + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                GPKG_RESOURCE_NAME_COLUMN + " TEXT NOT NULL, " +
                GPKG_VECTOR_TABLE_NAME_COLUMN + " TEXT NOT NULL, " +
                GPKG_VECTOR_TABLE_EPSG_CODE_COLUMN + " TEXT NOT NULL, " +
                GPKG_VECTOR_TABLE_DESCRIPTION_COLUMN + ")";

        try (PreparedStatement stmt = connection.prepareStatement(createTableSql)) {
            stmt.executeUpdate();
            log.debug("Создана если не существовала таблица " + GPKG_VECTOR_TABLE_INFO_TABLE);
        }

        insertInfoInGpkgContentsTable(connection, GPKG_VECTOR_TABLE_INFO_TABLE);
    }

    protected void saveVectorTableInfo(Connection connection,
                                       String title,
                                       String epsg,
                                       String description,
                                       ExportResourceModel tableFullName) throws SQLException {
        String insertSql = "INSERT INTO " + GPKG_VECTOR_TABLE_INFO_TABLE +
                " (" + GPKG_RESOURCE_NAME_COLUMN + ", " + GPKG_VECTOR_TABLE_NAME_COLUMN + ", "
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

    public void createIfNotExistStylesTable(Connection connection) throws SQLException {
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

        insertInfoInGpkgContentsTable(connection, GPKG_STYLE_LAYER_TABLE);
    }

    public void createIfNotExistSvgTable(Connection connection) throws SQLException {
        String createTableSql = "CREATE TABLE IF NOT EXISTS " + GPKG_SVG_CONTENT_TABLE + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                GPKG_SVG_STYLE_NAME_COLUMN + " TEXT NOT NULL," +
                GPKG_SVG_SVG_NAME_COLUMN + " TEXT NOT NULL, " +
                GPKG_SVG_SVG_BODY_COLUMN + " TEXT NOT NULL)";

        try (PreparedStatement stmt = connection.prepareStatement(createTableSql)) {
            stmt.executeUpdate();
            log.debug("Создана если не существовала таблица: " + GPKG_SVG_CONTENT_TABLE);
        }

        insertInfoInGpkgContentsTable(connection, GPKG_SVG_CONTENT_TABLE);
    }

    public void addStylesAndSvgs(Connection connection, List<StyleWithIcons> stylesAndSvgs) throws SQLException {
        for (StyleWithIcons styleAndSvg: stylesAndSvgs) {
            insertStyleInTable(connection, styleAndSvg);

            insertSvgInTable(connection, styleAndSvg);
        }
    }

    public void createIfNotExistLayerTable(Connection connection) throws SQLException {
        String createTableSql = "CREATE TABLE IF NOT EXISTS " + GPKG_LAYER_INFO_TABLE + " (" +
                GPKG_LAYER_INFO_ID + " INTEGER PRIMARY KEY AUTOINCREMENT, " +
                GPKG_LAYER_INFO_TITLE + " TEXT, " +
                GPKG_LAYER_INFO_DATASET + " TEXT, " +
                GPKG_LAYER_INFO_RESOURCE_ID + " TEXT, " +
                GPKG_LAYER_INFO_TYPE + " TEXT, " +
                GPKG_LAYER_INFO_ENABLED + " INTEGER, " +
                GPKG_LAYER_INFO_POSITION + " INTEGER, " +
                GPKG_LAYER_INFO_TRANSPARENCY + " INTEGER, " +
                GPKG_LAYER_INFO_MAX_ZOOM + " INTEGER, " +
                GPKG_LAYER_INFO_MIN_ZOOM + " INTEGER, " +
                GPKG_LAYER_INFO_STYLE_NAME + " TEXT, " +
                GPKG_LAYER_INFO_NATIVE_CRS + " TEXT, " +
                GPKG_LAYER_INFO_DATA_STORE_NAME + " TEXT, " +
                GPKG_LAYER_INFO_DATA_SOURCE_URI + " TEXT, " +
                GPKG_LAYER_INFO_SOURCE_ID + " TEXT, " +
                GPKG_LAYER_INFO_SOURCE_TYPE + " TEXT, " +
                GPKG_LAYER_INFO_SOURCE_RECORD_ID + " INTEGER, " +
                "createdAt TEXT, " +
                "lastModified TEXT, " +
                GPKG_LAYER_INFO_PROJECT_ID + " INTEGER, " +
                GPKG_LAYER_INFO_PARENT_ID + " INTEGER, " +
                GPKG_LAYER_INFO_CONTENT_TYPE + " TEXT, " +
                GPKG_LAYER_INFO_VIEW + " TEXT, " +
                GPKG_LAYER_INFO_ERROR_TEXT + " TEXT, " +
                GPKG_LAYER_INFO_STYLE + " TEXT, " +
                GPKG_LAYER_INFO_PHOTO_MODE + " TEXT)";

        try (PreparedStatement stmt = connection.prepareStatement(createTableSql)) {
            stmt.executeUpdate();

            log.debug("Создана если не существовала таблица: " + GPKG_LAYER_INFO_TABLE);
        }

        insertInfoInGpkgContentsTable(connection, GPKG_LAYER_INFO_TABLE);
    }

    public void addLayersProjection(Connection connection, List<LayerProjection> layerProjections) throws SQLException {
        //нужен батч
        for (LayerProjection projection: layerProjections) {
            String insertSql = "INSERT INTO " + GPKG_LAYER_INFO_TABLE +
                    " (title, dataset, resourceId, type, enabled, position, transparency, maxZoom, minZoom, " +
                    "styleName, nativeCRS, dataStoreName, dataSourceUri, sourceId, sourceType, sourceRecordId, " +
                    "createdAt, lastModified, projectId, parentId, contentType, view, errorText, style, photoMode)" +
                    " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

            try (PreparedStatement stmt = connection.prepareStatement(insertSql)) {
                stmt.setString(1, projection.getTitle() != null ? projection.getTitle() : null);
                stmt.setString(2, projection.getDataset() != null ? projection.getDataset() : null);
                stmt.setString(3, projection.getResourceId() != null ? projection.getResourceId() : null);
                stmt.setString(4, projection.getType() != null ? projection.getType() : null);
                stmt.setInt(5, projection.isEnabled() ? 1 : 0);
                stmt.setObject(6, projection.getPosition() != null ? projection.getPosition() : null);
                stmt.setInt(7, projection.getTransparency());
                stmt.setInt(8, projection.getMaxZoom());
                stmt.setInt(9, projection.getMinZoom());
                stmt.setString(10, projection.getStyleName() != null ? projection.getStyleName() : null);
                stmt.setString(11, projection.getNativeCRS() != null ? projection.getNativeCRS() : null);
                stmt.setString(12,
                               projection.getDataStoreName() != null ? projection.getDataStoreName() : null);
                stmt.setString(13,
                               projection.getDataSourceUri() != null ? projection.getDataSourceUri() : null);
                stmt.setString(14, projection.getSourceId() != null ? projection.getSourceId() : null);
                stmt.setString(15, projection.getSourceType() != null ? projection.getSourceType() : null);
                stmt.setObject(16, projection.getSourceRecordId() != null ? projection.getSourceRecordId() : null);
                stmt.setString(17, projection.getCreatedAt() != null ? String.valueOf(
                        projection.getCreatedAt()) : null);
                stmt.setString(18, projection.getLastModified() != null ? String.valueOf(
                        projection.getLastModified()) : null);
                stmt.setObject(19, projection.getProjectId() != null ? projection.getProjectId() : null);
                stmt.setObject(20, projection.getParentId() != null ? projection.getParentId() : null);
                stmt.setString(21, projection.getContentType() != null ? projection.getContentType() : null);
                stmt.setString(22, projection.getView() != null ? projection.getView() : null);
                stmt.setString(23, projection.getErrorText() != null ? projection.getErrorText() : null);
                stmt.setString(24, projection.getStyle() != null ? projection.getStyle() : null);
                stmt.setString(25, projection.getPhotoMode() != null ? projection.getPhotoMode() : null);

                stmt.executeUpdate();
            }

            log.debug("Сохранили информацию о слое '{}' в таблицу: {}",
                      projection.getTitle() != null ? projection.getTitle() : "null",
                      GPKG_LAYER_INFO_TABLE);
        }
    }

    private void insertSvgInTable(Connection connection, StyleWithIcons styleAndSvg) throws SQLException {
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

    private void insertStyleInTable(Connection connection, StyleWithIcons styleAndSvg) throws SQLException {
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
