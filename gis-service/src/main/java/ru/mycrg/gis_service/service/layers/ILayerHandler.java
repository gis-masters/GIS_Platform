package ru.mycrg.gis_service.service.layers;

import ru.mycrg.gis_service.dto.LayerCreateDto;
import ru.mycrg.gis_service.entity.Layer;
import ru.mycrg.gis_service.entity.Project;

import java.util.Optional;

interface ILayerHandler {

    Optional<Layer> create(Project project, LayerCreateDto layerDto);

    String getType();

    default String defaultEpsgCode() {
        return "28406";
    }
}
