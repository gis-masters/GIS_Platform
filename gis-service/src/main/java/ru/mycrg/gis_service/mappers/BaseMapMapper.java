package ru.mycrg.gis_service.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import ru.mycrg.gis_service.dto.BaseMapCreateDto;
import ru.mycrg.gis_service.entity.BaseMap;

@Mapper
public interface BaseMapMapper {

    BaseMapMapper baseMapMapper = Mappers.getMapper(BaseMapMapper.class);

    BaseMapCreateDto toDto(BaseMap baseMap);

    void update(@MappingTarget BaseMap baseMap, BaseMapCreateDto BaseMapCreateDto);
}
