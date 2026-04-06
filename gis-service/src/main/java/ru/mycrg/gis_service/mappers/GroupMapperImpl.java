package ru.mycrg.gis_service.mappers;

import ru.mycrg.gis_service.dto.GroupUpdateDto;
import ru.mycrg.gis_service.entity.Group;

class GroupMapperImpl implements GroupMapper {

    @Override
    public Group toGroup(GroupUpdateDto updateDto) {
        Group group = new Group();
        update(group, updateDto);

        return group;
    }

    @Override
    public GroupUpdateDto toDto(Group group) {
        GroupUpdateDto dto = new GroupUpdateDto();
        dto.setTitle(group.getTitle());
        dto.setParentId(group.getParentId());
        dto.setPosition(group.getPosition());
        dto.setEnabled(Boolean.toString(group.isEnabled()));
        dto.setExpanded(Boolean.toString(group.isExpanded()));
        dto.setTransparency(group.getTransparency());

        return dto;
    }

    @Override
    public void update(Group group, GroupUpdateDto updateDto) {
        group.setTitle(updateDto.getTitle());
        group.setParentId(updateDto.getParentId());
        group.setPosition(updateDto.getPosition());
        if (updateDto.getEnabled() != null) {
            group.setEnabled(Boolean.parseBoolean(updateDto.getEnabled()));
        }
        if (updateDto.getExpanded() != null) {
            group.setExpanded(Boolean.parseBoolean(updateDto.getExpanded()));
        }
        group.setTransparency(updateDto.getTransparency());
    }
}
