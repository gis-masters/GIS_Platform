package ru.mycrg.data_service.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import ru.mycrg.data_service.dto.BaseMapCreateDto;
import ru.mycrg.data_service.entity.BaseMap;

@Mapper
public interface BasemapMapper {

    BasemapMapper basemapMapper = Mappers.getMapper(BasemapMapper.class);

    @Mapping(source = "dto.type", target = "type")
    BaseMap toEntity(BaseMapCreateDto dto);

    BaseMapCreateDto toDto(BaseMap dto);
}
