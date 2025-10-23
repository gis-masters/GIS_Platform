package ru.mycrg.gis_service.dto;

import ru.mycrg.gis_service.dto.project.ProjectProjection;
import ru.mycrg.gis_service_contract.dto.LayerProjection;

public class RelatedLayersModel {

    private final LayerProjection layer;
    private final ProjectProjection project;

    public RelatedLayersModel(LayerProjection layer, ProjectProjection project) {
        this.layer = layer;
        this.project = project;
    }

    public LayerProjection getLayer() {
        return layer;
    }

    public ProjectProjection getProject() {
        return project;
    }
}
