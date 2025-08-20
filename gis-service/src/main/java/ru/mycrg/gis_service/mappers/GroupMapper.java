package ru.mycrg.gis_service.mappers;

import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import ru.mycrg.gis_service.dto.GroupUpdateDto;
import ru.mycrg.gis_service.entity.Group;
import org.mapstruct.Mapper;

@Mapper
public interface GroupMapper {

    GroupMapper groupMapper = Mappers.getMapper(GroupMapper.class);

    Group toGroup(GroupUpdateDto updateDto);

    GroupUpdateDto toDto(Group group);

    void update(@MappingTarget Group group, GroupUpdateDto updateDto);
}
