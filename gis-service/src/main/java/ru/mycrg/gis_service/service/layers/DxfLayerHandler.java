package ru.mycrg.gis_service.service.layers;

import org.springframework.stereotype.Component;
import ru.mycrg.gis_service.dto.LayerCreateDto;
import ru.mycrg.gis_service.entity.Layer;
import ru.mycrg.gis_service.entity.Project;

import java.util.Optional;

import static ru.mycrg.data_service_contract.enums.FileType.DXF;

@Component
public class DxfLayerHandler implements ILayerHandler {

    public static final String REQUIRED_DXF_NAME = "entities";

    private final ILayerHandler baseLayerHandler;

    public DxfLayerHandler(BaseLayerHandler baseLayerHandler) {
        this.baseLayerHandler = baseLayerHandler;
    }

    @Override
    public Optional<Layer> create(Project project, LayerCreateDto layerDto) {
        layerDto.setNativeName(REQUIRED_DXF_NAME);

        return baseLayerHandler.create(project, layerDto);
    }

    @Override
    public String getType() {
        return DXF.name().toLowerCase();
    }
}
