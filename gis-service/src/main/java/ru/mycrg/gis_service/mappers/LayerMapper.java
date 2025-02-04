package ru.mycrg.gis_service.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mappings;
import org.mapstruct.factory.Mappers;
import ru.mycrg.gis_service.dto.LayerUpdateDto;
import ru.mycrg.gis_service.entity.Layer;

@Mapper
public interface LayerMapper {

    LayerMapper layerMapper = Mappers.getMapper(LayerMapper.class);

    Layer toEntity(LayerUpdateDto updateDto);

    @Mappings({
            @Mapping(target = "parentId", source = "layer.parent.id")
    })
    LayerUpdateDto toDto(Layer layer);

    void update(@MappingTarget Layer layer, LayerUpdateDto updateDto);
}
