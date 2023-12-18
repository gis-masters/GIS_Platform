package ru.mycrg.gis_service.service.layers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.gis_service.dto.LayerCreateDto;
import ru.mycrg.gis_service.entity.Layer;
import ru.mycrg.gis_service.entity.Project;

import java.util.Optional;

@Component
public class MidLayerHandler implements ILayerHandler {

    private final Logger log = LoggerFactory.getLogger(MidLayerHandler.class);

    private final DxfLayerHandler dxfLayerHandler;

    public MidLayerHandler(DxfLayerHandler dxfLayerHandler) {
        this.dxfLayerHandler = dxfLayerHandler;
    }

    @Override
    public Optional<Layer> create(Project project, LayerCreateDto dto) {
        log.debug("MID create");

        return dxfLayerHandler.create(project, dto);
    }

    @Override
    public String getType() {
        return "mid";
    }
}
