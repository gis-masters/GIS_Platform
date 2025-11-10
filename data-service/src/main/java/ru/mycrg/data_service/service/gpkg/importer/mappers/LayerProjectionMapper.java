package ru.mycrg.data_service.service.gpkg.importer.mappers;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;
import ru.mycrg.gis_service_contract.dto.LayerProjection;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;

/**
 * RowMapper для маппинга результатов запроса в LayerProjection. Используется для извлечения информации о слоях из GPKG
 * файлов.
 */
@Component
public class LayerProjectionMapper implements RowMapper<LayerProjection> {

    public static final String GPKG_LAYER_INFO_ID = "id";
    public static final String GPKG_LAYER_INFO_TITLE = "title";
    public static final String GPKG_LAYER_INFO_TYPE = "type";
    public static final String GPKG_LAYER_INFO_DATASET = "dataset";
    public static final String GPKG_LAYER_INFO_RESOURCE_ID = "resourceId";
    public static final String GPKG_LAYER_INFO_ENABLED = "enabled";
    public static final String GPKG_LAYER_INFO_POSITION = "position";
    public static final String GPKG_LAYER_INFO_TRANSPARENCY = "transparency";
    public static final String GPKG_LAYER_INFO_MAX_ZOOM = "maxZoom";
    public static final String GPKG_LAYER_INFO_MIN_ZOOM = "minZoom";
    public static final String GPKG_LAYER_INFO_STYLE_NAME = "styleName";
    public static final String GPKG_LAYER_INFO_NATIVE_CRS = "nativeCRS";
    public static final String GPKG_LAYER_INFO_DATA_SOURCE_URI = "dataSourceUri";
    public static final String GPKG_LAYER_INFO_PARENT_ID = "parentId";
    public static final String GPKG_LAYER_INFO_PROJECT_ID = "projectId";
    public static final String GPKG_LAYER_INFO_COMPLEX_NAME = "complexName";
    public static final String GPKG_LAYER_INFO_SOURCE_ID = "sourceId";
    public static final String GPKG_LAYER_INFO_SOURCE_TYPE = "sourceType";
    public static final String GPKG_LAYER_INFO_SOURCE_RECORD_ID = "sourceRecordId";
    public static final String GPKG_LAYER_INFO_DATA_STORE_NAME = "dataStoreName";
    public static final String GPKG_LAYER_INFO_CONTENT_TYPE = "contentType";
    public static final String GPKG_LAYER_INFO_VIEW = "view";
    public static final String GPKG_LAYER_INFO_ERROR_TEXT = "errorText";
    public static final String GPKG_LAYER_INFO_STYLE = "style";
    public static final String GPKG_LAYER_INFO_PHOTO_MODE = "photoMode";

    //используются только при чтении
    public static final String GPKG_LAYER_INFO_CREATED_ATER = "createdAter";
    public static final String GPKG_LAYER_INFO_LAST_MODIFIEDEER = "photoMode";

    @Override
    public LayerProjection mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new LayerProjection(
                rs.getLong(GPKG_LAYER_INFO_ID),
                rs.getString(GPKG_LAYER_INFO_TITLE),
                rs.getString(GPKG_LAYER_INFO_TYPE),
                rs.getString(GPKG_LAYER_INFO_DATASET),
                rs.getString(GPKG_LAYER_INFO_RESOURCE_ID),
                rs.getBoolean(GPKG_LAYER_INFO_ENABLED),
                rs.getInt(GPKG_LAYER_INFO_POSITION),
                rs.getInt(GPKG_LAYER_INFO_TRANSPARENCY),
                rs.getInt(GPKG_LAYER_INFO_MAX_ZOOM),
                rs.getInt(GPKG_LAYER_INFO_MIN_ZOOM),
                rs.getString(GPKG_LAYER_INFO_STYLE_NAME),
                rs.getString(GPKG_LAYER_INFO_NATIVE_CRS),
                rs.getString(GPKG_LAYER_INFO_DATA_SOURCE_URI),
                rs.getLong(GPKG_LAYER_INFO_PARENT_ID),
                rs.getLong(GPKG_LAYER_INFO_PROJECT_ID),
                rs.getString(GPKG_LAYER_INFO_COMPLEX_NAME),
                rs.getString(GPKG_LAYER_INFO_SOURCE_ID),
                rs.getString(GPKG_LAYER_INFO_SOURCE_TYPE),
                rs.getLong(GPKG_LAYER_INFO_SOURCE_RECORD_ID),
                rs.getString(GPKG_LAYER_INFO_DATA_STORE_NAME),
                rs.getString(GPKG_LAYER_INFO_CONTENT_TYPE),
                rs.getString(GPKG_LAYER_INFO_VIEW),
                rs.getString(GPKG_LAYER_INFO_ERROR_TEXT),
                rs.getString(GPKG_LAYER_INFO_STYLE),
                rs.getString(GPKG_LAYER_INFO_PHOTO_MODE),
                getLocalDateTime(rs, GPKG_LAYER_INFO_CREATED_ATER),
                getLocalDateTime(rs, GPKG_LAYER_INFO_LAST_MODIFIEDEER)
        );
    }

    private LocalDateTime getLocalDateTime(ResultSet rs, String columnName) throws SQLException {
        Timestamp timestamp = rs.getTimestamp(columnName);

        return timestamp != null ? timestamp.toLocalDateTime() : null;
    }
}
