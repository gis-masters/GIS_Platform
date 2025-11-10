package ru.mycrg.gis_service.dto;

import ru.mycrg.gis_service.dto.project.IProjectProjection;
import ru.mycrg.gis_service_contract.dto.LayerProjection;

public class RelatedLayersModel {

    private final LayerProjection layer;
    private final IProjectProjection project;

    public RelatedLayersModel(LayerProjection layer, IProjectProjection project) {
        this.layer = layer;
        this.project = project;
    }

    public LayerProjection getLayer() {
        return layer;
    }

    public IProjectProjection getProject() {
        return project;
    }
}
