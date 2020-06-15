package ru.mycrg.gis_service.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import ru.mycrg.gis_service.dto.PermissionCreateDto;
import ru.mycrg.gis_service.entity.Permission;

@Mapper
public interface PermissionMapper {

    PermissionMapper permissionMapper = Mappers.getMapper(PermissionMapper.class);

    Permission toPermission(PermissionCreateDto updateDto);

    PermissionCreateDto toDto(Permission group);

    void update(@MappingTarget Permission permission, PermissionCreateDto updateDto);
}
