package ru.mycrg.gis_service.service.layers;

import org.springframework.stereotype.Component;
import ru.mycrg.gis_service.dto.LayerCreateDto;
import ru.mycrg.gis_service.entity.Layer;
import ru.mycrg.gis_service.entity.Project;

import java.util.Optional;

import static ru.mycrg.data_service_contract.enums.FileType.MID;

@Component
public class MidLayerHandler implements ILayerHandler {

    private final ILayerHandler baseLayerHandler;

    public MidLayerHandler(BaseLayerHandler baseLayerHandler) {
        this.baseLayerHandler = baseLayerHandler;
    }

    @Override
    public Optional<Layer> create(Project project, LayerCreateDto layerDto) {
        return baseLayerHandler.create(project, layerDto);
    }

    @Override
    public String getType() {
        return MID.name().toLowerCase();
    }
}
