package ru.mycrg.gis_service.mapper;

import ru.mycrg.gis_service.entity.Layer;
import ru.mycrg.gis_service_contract.dto.LayerProjection;

import static ru.mycrg.common_utils.CrgGlobalProperties.buildGeoserverComplexLayerName;
import static ru.mycrg.gis_service.service.geoserver.FeatureUtil.buildGeoserverFeatureName;

public class LayerMapper {

    public static LayerProjection toProjection(Layer layer, String orgWorkspaceName) {
        String tableName = layer.getTableName();
        String nativeCRS = layer.getNativeCRS();

        return new LayerProjection(layer.getId(),
                                   layer.getTitle(),
                                   layer.getType(),
                                   layer.getDataset(),
                                   layer.getTableName(),
                                   layer.isEnabled(),
                                   layer.getPosition(),
                                   layer.getTransparency(),
                                   layer.getMaxZoom(),
                                   layer.getMinZoom(),
                                   layer.getStyleName(),
                                   layer.getNativeCRS(),
                                   layer.getDataSourceUri(),
                                   layer.getParent() != null ? layer.getParent().getId() : null,
                                   layer.getProject() != null ? layer.getProject().getId() : null,
                                   buildGeoserverComplexLayerName(orgWorkspaceName,
                                                                  buildGeoserverFeatureName(tableName, nativeCRS)),
                                   layer.getLibraryId(),
                                   layer.getRecordId(),
                                   layer.getDataStoreName(),
                                   layer.getContentType(),
                                   layer.getView(),
                                   layer.getErrorText(),
                                   layer.getStyle(),
                                   layer.getPhotoMode(),
                                   layer.getCreatedAt(),
                                   layer.getLastModified()
        );
    }
}