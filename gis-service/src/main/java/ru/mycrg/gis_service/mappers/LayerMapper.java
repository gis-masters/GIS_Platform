package ru.mycrg.gis_service.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import ru.mycrg.gis_service.dto.LayerUpdateDto;
import ru.mycrg.gis_service.entity.Layer;

@Mapper
public interface LayerMapper {

    LayerMapper layerMapper = Mappers.getMapper(LayerMapper.class);

    Layer toEntity(LayerUpdateDto updateDto);

    LayerUpdateDto toDto(Layer group);

    void update(@MappingTarget Layer layer, LayerUpdateDto updateDto);
}
