package ru.mycrg.gis_service.service.layers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.gis_service.dto.LayerCreateDto;
import ru.mycrg.gis_service.entity.Layer;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.exceptions.ConflictException;
import ru.mycrg.gis_service.repository.LayerRepository;

@Component
public class ExternalLayerHandler implements ILayerHandler {

    private final Logger log = LoggerFactory.getLogger(ExternalLayerHandler.class);

    private final LayerRepository layerRepository;

    public ExternalLayerHandler(LayerRepository layerRepository) {
        this.layerRepository = layerRepository;
    }

    @Override
    public Layer create(Project project, LayerCreateDto dto) {
        log.debug("ExternalLayerHandler create");

        if (layerRepository.findByTableNameAndProjectAndType(dto.getTableName(), project, dto.getType()).isPresent()) {
            throw new ConflictException("External layer with same tableName already exist");
        }

        return layerRepository.save(new Layer(dto, project));
    }

    @Override
    public String getType() {
        return "external";
    }
}
