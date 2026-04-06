package ru.mycrg.gis_service.mappers;

import ru.mycrg.gis_service.dto.LayerUpdateDto;
import ru.mycrg.gis_service.entity.Layer;

public interface LayerMapper {

    LayerMapper layerMapper = new LayerMapperImpl();

    Layer toEntity(LayerUpdateDto updateDto);

    LayerUpdateDto toDto(Layer layer);

    void update(Layer layer, LayerUpdateDto updateDto);
}
