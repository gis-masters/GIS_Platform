package ru.mycrg.gis_service.service;

import org.jetbrains.annotations.NotNull;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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

    public Map<Long, List<PermissionProjection>> getAll(Authentication authentication) {
        Map<Long, List<PermissionProjection>> allPermissions = new HashMap<>();
        projectService.getAll(authentication)
                      .forEach(project -> {
                          List<PermissionProjection> projectPermissions = getProjectPermission(project);
                          if (!projectPermissions.isEmpty()) {
                              allPermissions.put(project.getId(), projectPermissions);
                          }
                      });

        return allPermissions;
    }

    public List<PermissionProjection> getAll(long projectId, Authentication authentication) {
        return Stream.of(projectService.getById(projectId, authentication))
                     .map(this::getProjectPermission)
                     .findFirst().get();
    }

    public PermissionProjection getById(long projectId, long permissionId, Authentication authentication) {
        final Permission permission = getPermissionById(projectId, permissionId, authentication);

        return mapToProjection(permission);
    }

    public PermissionProjection create(long projectId, PermissionCreateDto dto, Authentication authentication) {
        Project project = projectService.getById(projectId, authentication);

        checkPermission(dto, projectId, null);

        final Permission savedPermission = permissionRepository.save(new Permission(dto, project));

        return mapToProjection(savedPermission);
    }

    public void update(long projectId, long permissionId, JsonMergePatch patchDto, Authentication authentication) {
        final Permission permissionForUpdate = getPermissionById(projectId, permissionId, authentication);

        PermissionCreateDto permissionDto = permissionMapper.toDto(permissionForUpdate);
        final PermissionCreateDto patchedPermission =
                jsonPatcher.mergePatch(patchDto, permissionDto, PermissionCreateDto.class);

        checkPermission(patchedPermission, projectId, permissionId);

        permissionMapper.update(permissionForUpdate, patchedPermission);

        permissionForUpdate.setLastModified(LocalDateTime.now());

        permissionRepository.save(permissionForUpdate);
    }

    public void delete(long projectId, long permissionId, Authentication authentication) {
        final Permission permission = getPermissionById(projectId, permissionId, authentication);

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

    @NotNull
    private Permission getPermissionById(Long projectId, Long permissionId, Authentication authentication) {
        return projectService.getById(projectId, authentication)
                             .getPermissions().stream()
                             .filter(permission -> permission.getId().equals(permissionId))
                             .findFirst()
                             .orElseThrow(() -> new NotFoundException(permissionId));
    }

    private List<PermissionProjection> getProjectPermission(Project project) {
        return project.getPermissions().stream()
                      .map(this::mapToProjection)
                      .collect(Collectors.toList());
    }

    @NotNull
    private PermissionProjection mapToProjection(Permission permission) {
        return projectionFactory.createProjection(PermissionProjection.class, permission);
    }
}
