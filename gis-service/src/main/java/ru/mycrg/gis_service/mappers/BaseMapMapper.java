package ru.mycrg.gis_service.mappers;

import ru.mycrg.gis_service.dto.BaseMapCreateDto;
import ru.mycrg.gis_service.entity.BaseMap;

public interface BaseMapMapper {

    BaseMapMapper baseMapMapper = new BaseMapMapperImpl();

    BaseMapCreateDto toDto(BaseMap baseMap);

    void update(BaseMap baseMap, BaseMapCreateDto baseMapCreateDto);
}
