package ru.mycrg.gis_service.mappers;

import ru.mycrg.gis_service.dto.GroupUpdateDto;
import ru.mycrg.gis_service.entity.Group;

public interface GroupMapper {

    GroupMapper groupMapper = new GroupMapperImpl();

    Group toGroup(GroupUpdateDto updateDto);

    GroupUpdateDto toDto(Group group);

    void update(Group group, GroupUpdateDto updateDto);
}
