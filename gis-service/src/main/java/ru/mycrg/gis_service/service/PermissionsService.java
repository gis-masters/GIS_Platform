package ru.mycrg.gis_service.service;

import org.jetbrains.annotations.Nullable;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.gis_service.dto.PermissionCreateDto;
import ru.mycrg.gis_service.dto.PermissionProjection;
import ru.mycrg.gis_service.entity.Permission;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.exceptions.ConflictException;
import ru.mycrg.gis_service.exceptions.NotFoundException;
import ru.mycrg.gis_service.json.JsonPatcher;
import ru.mycrg.gis_service.repository.PermissionRepository;

import javax.json.JsonMergePatch;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static ru.mycrg.gis_service.mappers.PermissionMapper.permissionMapper;

@Service
@Transactional
public class PermissionsService {

    private final PermissionRepository permissionRepository;
    private final ProjectionFactory projectionFactory;
    private final ProjectService projectService;
    private final JsonPatcher jsonPatcher;

    public PermissionsService(PermissionRepository permissionRepository,
                              ProjectionFactory projectionFactory,
                              ProjectService projectService,
                              JsonPatcher jsonPatcher) {
        this.jsonPatcher = jsonPatcher;
        this.projectService = projectService;
        this.projectionFactory = projectionFactory;
        this.permissionRepository = permissionRepository;
    }

    public List<PermissionProjection> getAll(long projectId, Authentication authentication) {
        return getProjectPermissions(projectId, authentication).stream()
                .map(permission -> projectionFactory.createProjection(PermissionProjection.class, permission))
                .collect(Collectors.toList());
    }

    public PermissionProjection getById(long projectId, long permissionId, Authentication authentication) {
        final List<Permission> permissions = getProjectPermissions(projectId, authentication);
        final Permission permission = getPermissionById(permissions, permissionId);

        return projectionFactory.createProjection(PermissionProjection.class, permission);
    }

    public PermissionProjection create(long projectId, PermissionCreateDto dto, Authentication authentication) {
        Project project = projectService.getById(projectId, authentication);

        checkPermission(dto, projectId, null);

        final Permission savedPermission = permissionRepository.save(new Permission(dto, project));

        return projectionFactory.createProjection(PermissionProjection.class, savedPermission);
    }

    public void update(long projectId, long permissionId, JsonMergePatch patchDto, Authentication authentication) {
        final List<Permission> permissions = getProjectPermissions(projectId, authentication);
        final Permission permissionForUpdate = getPermissionById(permissions, permissionId);

        PermissionCreateDto permissionDto = permissionMapper.toDto(permissionForUpdate);
        final PermissionCreateDto patchedPermission =
                jsonPatcher.mergePatch(patchDto, permissionDto, PermissionCreateDto.class);

        checkPermission(patchedPermission, projectId, permissionId);

        permissionMapper.update(permissionForUpdate, patchedPermission);

        permissionForUpdate.setLastModified(LocalDateTime.now());

        permissionRepository.save(permissionForUpdate);
    }

    public void delete(long projectId, long permissionId, Authentication authentication) {
        final List<Permission> permissions = getProjectPermissions(projectId, authentication);
        final Permission permission = getPermissionById(permissions, permissionId);

        permissionRepository.deletePermissionById(permission.getId());
    }

    private void checkPermission(PermissionCreateDto patchedPermission,
                                 Long projectId,
                                 @Nullable Long originPermissionId) {
        String principalType = patchedPermission.getPrincipalType();
        Long principalId = patchedPermission.getPrincipalId();
        String role = patchedPermission.getRole();

        final List<Permission> identicalPermissions =
                permissionRepository.findIdentical(principalType, principalId, role, projectId);
        if (!identicalPermissions.isEmpty()) {
            throw new ConflictException(
                    "Permission already exist: " + identicalPermissions.get(0).toString());
        }

        if (originPermissionId != null) {
            final List<Permission> overlappingPermissions =
                    permissionRepository.findOverlapping(principalType, principalId, projectId, originPermissionId);
            if (!overlappingPermissions.isEmpty()) {
                throw new ConflictException(
                        "Overlapping permissions, edit old permission: " + overlappingPermissions.get(0).toString());
            }
        }
    }

    private Permission getPermissionById(List<Permission> permissions, Long permissionId) {
        return permissions.stream()
                .filter(permission -> permission.getId().equals(permissionId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException(permissionId));
    }

    private List<Permission> getProjectPermissions(long projectId, Authentication authentication) {
        return projectService
                .getById(projectId, authentication)
                .getPermissions();
    }
}
