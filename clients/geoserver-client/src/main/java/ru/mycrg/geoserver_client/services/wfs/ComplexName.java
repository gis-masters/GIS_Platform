package ru.mycrg.geoserver_client.services.wfs;

import ru.mycrg.geoserver_client.exceptions.GeoserverClientException;
import static ru.mycrg.common_utils.CrgGlobalProperties.buildGeoserverComplexLayerName;

public class ComplexName {

    private final String workspace;
    private final String layerName;

    private ComplexName(String workspace, String layerName) {
        this.workspace = workspace;
        this.layerName = layerName;
    }

    public static ComplexName of(String workspace, String layerName) {
        if (workspace == null || workspace.trim().isEmpty()) {
            throw new GeoserverClientException("Workspace не может быть пустым");
        }
        if (layerName == null || layerName.trim().isEmpty()) {
            throw new GeoserverClientException("Имя слоя не может быть пустым");
        }

        return new ComplexName(workspace.trim(), layerName.trim());
    }

    public static ComplexName parse(String complexName) {
        if (complexName == null || !complexName.contains(":")) {
            throw new GeoserverClientException("Неверный формат typeName. Ожидается: workspace:layer, получено: " + complexName);
        }
        String[] parts = complexName.split(":", 2);

        return ComplexName.of(parts[0], parts[1]);
    }

    public String getWorkspace() {
        return workspace;
    }

    public String getLayerName() {
        return layerName;
    }

    public String getComplexName() {
        return buildGeoserverComplexLayerName(workspace, layerName);
    }
}
