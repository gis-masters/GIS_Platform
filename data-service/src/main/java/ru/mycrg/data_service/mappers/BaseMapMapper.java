package ru.mycrg.data_service.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import ru.mycrg.data_service.dto.XYZBaseMapDto;
import ru.mycrg.data_service.dto.WMTSBaseMapDto;
import ru.mycrg.data_service.entity.BaseMapEntity;

@Mapper
public interface BaseMapMapper {

    BaseMapMapper baseMapMapper = Mappers.getMapper(BaseMapMapper.class);

    @Mapping(source = "entity.type", target = "source.type")
    @Mapping(source = "entity.url", target = "source.url")
    @Mapping(source = "entity.layerName", target = "source.layerName")
    @Mapping(source = "entity.style", target = "source.style")
    @Mapping(source = "entity.projection", target = "source.projection")
    @Mapping(source = "entity.format", target = "source.format")
    @Mapping(source = "entity.size", target = "tileGrid.size")
    @Mapping(source = "entity.resolution", target = "tileGrid.resolution")
    @Mapping(source = "entity.matrixIds", target = "tileGrid.matrixIds")
    WMTSBaseMapDto toWMTSBaseMap(BaseMapEntity entity);

    @Mapping(source = "entity.type", target = "source.type")
    @Mapping(source = "entity.url", target = "source.url")
    XYZBaseMapDto toXYZBaseMap(BaseMapEntity entity);

}
