package ru.mycrg.gis_service.mappers;

import ru.mycrg.gis_service.dto.BaseMapCreateDto;
import ru.mycrg.gis_service.entity.BaseMap;

class BaseMapMapperImpl implements BaseMapMapper {

    @Override
    public BaseMapCreateDto toDto(BaseMap baseMap) {
        BaseMapCreateDto dto = new BaseMapCreateDto();
        dto.setBaseMapId(baseMap.getBaseMapId());
        dto.setTitle(baseMap.getTitle());
        dto.setPosition(baseMap.getPosition());

        return dto;
    }

    @Override
    public void update(BaseMap baseMap, BaseMapCreateDto baseMapCreateDto) {
        baseMap.setBaseMapId(baseMapCreateDto.getBaseMapId());
        baseMap.setTitle(baseMapCreateDto.getTitle());
        baseMap.setPosition(baseMapCreateDto.getPosition());
    }
}
