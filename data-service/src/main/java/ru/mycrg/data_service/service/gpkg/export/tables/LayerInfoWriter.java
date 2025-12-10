package ru.mycrg.data_service.service.gpkg.export.tables;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import ru.mycrg.gis_service_contract.dto.LayerProjection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import static ru.mycrg.data_service.service.gpkg.importer.mappers.LayerProjectionMapper.*;

@Repository
public class LayerInfoWriter implements ICrgGpkgTables {

    private static final Logger log = LoggerFactory.getLogger(LayerInfoWriter.class);

    public static final String GPKG_LAYER_INFO_TABLE = "crg_layer_info_table";

    public void createTableIfNotExist(Connection connection) throws SQLException {
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
    }

    public void insert(Connection connection,
                       List<LayerProjection> layerProjections) throws SQLException {
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
}
