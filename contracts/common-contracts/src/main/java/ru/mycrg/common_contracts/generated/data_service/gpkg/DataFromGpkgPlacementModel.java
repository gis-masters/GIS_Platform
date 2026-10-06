package ru.mycrg.common_contracts.generated.data_service.gpkg;

import java.util.UUID;

public class DataFromGpkgPlacementModel {

    private UUID fileId;
    private Long projectId;
    private String datasetIdentifier;
    private Long layerGroupId;
    private GpkgLayersPlacementModel layersPlacement;
    private boolean keepSourceFile;

    public DataFromGpkgPlacementModel() {
        // Required
    }

    public DataFromGpkgPlacementModel(UUID fileId, Long projectId, GpkgLayersPlacementModel layersPlacement) {
        this.fileId = fileId;
        this.projectId = projectId;
        this.layersPlacement = layersPlacement;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public UUID getFileId() {
        return fileId;
    }

    public void setFileId(UUID fileId) {
        this.fileId = fileId;
    }

    public String getDatasetIdentifier() {
        return datasetIdentifier;
    }

    public void setDatasetIdentifier(String datasetIdentifier) {
        this.datasetIdentifier = datasetIdentifier;
    }

    public Long getLayerGroupId() {
        return layerGroupId;
    }

    public void setLayerGroupId(Long layerGroupId) {
        this.layerGroupId = layerGroupId;
    }

    public GpkgLayersPlacementModel getLayersPlacement() {
        return layersPlacement;
    }

    public void setLayersPlacement(GpkgLayersPlacementModel layersPlacement) {
        this.layersPlacement = layersPlacement;
    }

    public boolean isKeepSourceFile() {
        return keepSourceFile;
    }

    public void setKeepSourceFile(boolean keepSourceFile) {
        this.keepSourceFile = keepSourceFile;
    }

    @Override
    public String toString() {
        return "{" +
                "\"fileId\":" + (fileId == null ? "null" : fileId) + ", " +
                "\"projectId\":" + (projectId == null ? "null" : "\"" + projectId + "\"") + ", " +
                "\"datasetIdentifier\":" + (datasetIdentifier == null ? "null" : "\"" + datasetIdentifier + "\"") + ", " +
                "\"layerGroupId\":" + (layerGroupId == null ? "null" : layerGroupId) + ", " +
                "\"layersPlacement\":" + (layersPlacement == null ? "null" : layersPlacement) + ", " +
                "\"keepSourceFile\":" + keepSourceFile +
                "}";
    }
}
