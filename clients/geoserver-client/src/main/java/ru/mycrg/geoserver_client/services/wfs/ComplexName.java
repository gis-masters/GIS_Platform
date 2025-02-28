package ru.mycrg.geoserver_client.services.wfs;

public class ComplexName {

    private static final String WORKSPACE_PATTERN = "^scratch_database_\\d+$";

    private final String workspace;
    private final String layerName;

    private ComplexName(String workspace, String layerName) {
        this.workspace = workspace;
        this.layerName = layerName;
    }

    public static ComplexName of(String workspace, String layerName) {
        if (workspace == null || !workspace.matches(WORKSPACE_PATTERN)) {
            throw new WfsExceptions("Неверный формат. Ожидается: scratch_database_№:..., а у вас: " + workspace);
        }
        if (layerName == null || layerName.trim().isEmpty()) {
            throw new WfsExceptions("Имя слоя не может быть пустым");
        }
        return new ComplexName(workspace, layerName.trim());
    }

    public static ComplexName parse(String fullName) {
        if (fullName == null || !fullName.contains(":")) {
            throw new WfsExceptions("Неверный формат typeName. Ожидается: workspace:layer, получено: " + fullName);
        }

        String[] parts = fullName.split(":", 2);
        return ComplexName.of(parts[0], parts[1]);
    }

    public String getWorkspace() {
        return workspace;
    }

    public String getLayerName() {
        return layerName;
    }

    public String getComplexName() {
        return workspace + ":" + layerName;
    }
}
