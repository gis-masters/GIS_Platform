package ru.mycrg.gis_service.service;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.data.projection.ProjectionFactory;
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
import java.util.ArrayList;
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

    public Map<Long, List<PermissionProjection>> getAll() {
        Map<Long, List<PermissionProjection>> allPermissions = new HashMap<>();
        projectService.getAll()
                      .forEach(project -> {
                          List<PermissionProjection> projectPermissions = getProjectPermissions(project);
                          if (!projectPermissions.isEmpty()) {
                              allPermissions.put(project.getId(), projectPermissions);
                          }
                      });

        return allPermissions;
    }

    public List<PermissionProjection> getAll(long projectId) {
        return Stream.of(projectService.getById(projectId))
                     .map(this::getProjectPermissions)
                     .findFirst()
                     .orElseGet(ArrayList::new);
    }

    public PermissionProjection getById(long projectId, long permissionId) {
        final Permission permission = getPermissionById(projectId, permissionId);

        return mapToProjection(permission);
    }

    public PermissionProjection create(long projectId, PermissionCreateDto dto) {
        Project project = projectService.getById(projectId);

        checkPermission(dto, projectId, null);

        final Permission savedPermission = permissionRepository.save(new Permission(dto, project));

        return mapToProjection(savedPermission);
    }

    public void update(long projectId, long permissionId, JsonMergePatch patchDto) {
        final Permission permissionForUpdate = getPermissionById(projectId, permissionId);

        PermissionCreateDto permissionDto = permissionMapper.toDto(permissionForUpdate);
        final PermissionCreateDto patchedPermission =
                jsonPatcher.mergePatch(patchDto, permissionDto, PermissionCreateDto.class);

        checkPermission(patchedPermission, projectId, permissionId);

        permissionMapper.update(permissionForUpdate, patchedPermission);

        permissionForUpdate.setLastModified(LocalDateTime.now());

        permissionRepository.save(permissionForUpdate);
    }

    public void delete(long projectId, long permissionId) {
        final Permission permission = getPermissionById(projectId, permissionId);

        permissionRepository.deletePermissionById(permission.getId());
    }

    public void deletePermissions(Long principalId, String principalType) {
        projectService.getAll()
                      .forEach(project ->
                                       getProjectPermissions(project).forEach(permission -> {
                                           if (isSuitable(permission, principalType, principalId)) {
                                               permissionRepository.deletePermissionById(permission.getId());
                                           }
                                       }));
    }

    private boolean isSuitable(PermissionProjection permission, String principalType, Long principalId) {
        return permission.getPrincipalType().equalsIgnoreCase(principalType)
                && permission.getPrincipalId().equals(principalId);
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
    private Permission getPermissionById(Long projectId, Long permissionId) {
        return projectService.getById(projectId)
                             .getPermissions().stream()
                             .filter(permission -> permission.getId().equals(permissionId))
                             .findFirst()
                             .orElseThrow(() -> new NotFoundException(permissionId));
    }

    private List<PermissionProjection> getProjectPermissions(Project project) {
        return project.getPermissions().stream()
                      .map(this::mapToProjection)
                      .collect(Collectors.toList());
    }

    @NotNull
    private PermissionProjection mapToProjection(Permission permission) {
        return projectionFactory.createProjection(PermissionProjection.class, permission);
    }
}
