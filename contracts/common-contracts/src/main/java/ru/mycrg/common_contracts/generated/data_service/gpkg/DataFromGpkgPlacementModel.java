package ru.mycrg.common_contracts.generated.data_service.gpkg;

import java.util.UUID;

public class DataFromGpkgPlacementModel {

    private UUID fileId;
    private Long projectId;
    private GpkgLayersPlacementModel layersPlacement;

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

    public GpkgLayersPlacementModel getLayersPlacement() {
        return layersPlacement;
    }

    public void setLayersPlacement(GpkgLayersPlacementModel layersPlacement) {
        this.layersPlacement = layersPlacement;
    }

    @Override
    public String toString() {
        return "{" +
                "\"fileId\":" + (fileId == null ? "null" : fileId) + ", " +
                "\"projectId\":" + (projectId == null ? "null" : "\"" + projectId + "\"") + ", " +
                "\"layersPlacement\":" + (layersPlacement == null ? "null" : layersPlacement) +
                "}";
    }
}
