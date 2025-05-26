package ru.mycrg.gis_service.service.layers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.gis_service.dto.LayerCreateDto;
import ru.mycrg.gis_service.entity.Layer;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.repository.LayerRepository;

import java.util.Optional;

@Component
public class ExternalNspdLayerHandler implements ILayerHandler {

    private final Logger log = LoggerFactory.getLogger(ExternalNspdLayerHandler.class);

    private final LayerRepository layerRepository;

    public ExternalNspdLayerHandler(LayerRepository layerRepository) {
        this.layerRepository = layerRepository;
    }

    @Override
    public Optional<Layer> create(Project project, LayerCreateDto dto) {
        log.debug("ExternalNspdLayerHandler creator");

        Layer newLayer = layerRepository.save(new Layer(dto, project));

        return Optional.of(newLayer);
    }

    @Override
    public String getType() {
        return "external_nspd";
    }
}
