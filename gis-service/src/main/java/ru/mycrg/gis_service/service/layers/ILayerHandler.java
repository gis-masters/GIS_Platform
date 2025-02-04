package ru.mycrg.gis_service.service.layers;

import org.jetbrains.annotations.NotNull;
import ru.mycrg.gis_service.dto.LayerCreateDto;
import ru.mycrg.gis_service.entity.Layer;
import ru.mycrg.gis_service.entity.Project;

import java.util.Optional;

import static ru.mycrg.gis_service.service.layers.RasterLayerHandler.FULL_MODE;

interface ILayerHandler {

    Optional<Layer> create(Project project, LayerCreateDto layerDto);

    String getType();

    default String defaultEpsgCode() {
        return "28406";
    }

    default @NotNull String getMode(LayerCreateDto dto) {
        return dto.getMode() == null
                ? FULL_MODE
                : dto.getMode();
    }

}
