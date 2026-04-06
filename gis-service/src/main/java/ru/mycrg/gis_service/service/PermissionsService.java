package ru.mycrg.gis_service.service;

import jakarta.json.JsonMergePatch;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.gis_service.dto.PermissionCreateDto;
import ru.mycrg.gis_service.dto.PermissionProjection;
import ru.mycrg.gis_service.entity.Permission;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.entity.Role;
import ru.mycrg.gis_service.exceptions.ConflictException;
import ru.mycrg.gis_service.exceptions.ForbiddenException;
import ru.mycrg.gis_service.exceptions.NotFoundException;
import ru.mycrg.gis_service.repository.PermissionRepository;
import ru.mycrg.gis_service.repository.RoleRepository;
import ru.mycrg.gis_service.service.projects.ProjectService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static java.time.LocalDateTime.now;
import static ru.mycrg.gis_service.GisServiceApplication.objectMapper;
import static ru.mycrg.http_client.JsonConverter.toJsonNode;

@Service
@Transactional
public class PermissionsService {

    private final Logger log = LoggerFactory.getLogger(PermissionsService.class);

    private final PermissionRepository permissionRepository;
    private final ProjectionFactory projectionFactory;
    private final ProjectService projectService;
    private final ProjectProtector projectProtector;
    private final RoleRepository roleRepository;

    public PermissionsService(PermissionRepository permissionRepository,
                              ProjectionFactory projectionFactory,
                              ProjectService projectService,
                              ProjectProtector projectProtector,
                              RoleRepository roleRepository) {
        this.projectService = projectService;
        this.projectionFactory = projectionFactory;
        this.permissionRepository = permissionRepository;
        this.projectProtector = projectProtector;
        this.roleRepository = roleRepository;
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

    public List<PermissionProjection> getAllAllowed(long projectId) {
        Project project = projectService.getById(projectId);
        if (projectProtector.isOwner(project.getId())) {
            return getProjectPermissions(project);
        } else {
            return getAllowedPermissions(project);
        }
    }

    public PermissionProjection getById(long projectId, long permissionId) {
        final Permission permission = getPermissionById(projectId, permissionId);

        return mapToProjection(permission);
    }

    public PermissionProjection create(long projectId, PermissionCreateDto dto) {
        Project project = projectService.getById(projectId);

        throwIfNotOwnerOrAdmin(project);

        Role role = roleRepository.findByNameIgnoreCase(dto.getRole())
                                  .orElseThrow(() -> new NotFoundException("Не найдена роль: " + dto.getRole()));

        throwIfIdentical(dto, projectId, role.getId());

        Permission permission = new Permission(dto, project);
        permission.setRole(role);

        Permission savedPermission = permissionRepository.save(permission);

        log.debug("Создали правило [{}]", permission);

        return mapToProjection(savedPermission);
    }

    public void update(long projectId, long permissionId, JsonMergePatch patchDto) {
        Permission permissionForUpdate = getPermissionById(projectId, permissionId);

        patchPermission(permissionForUpdate, patchDto);

        PermissionCreateDto dto = new PermissionCreateDto(permissionForUpdate);
        throwIfIdentical(dto, projectId, permissionForUpdate.getRole().getId());
        throwIfOverlapped(dto, projectId, permissionForUpdate.getId());

        permissionRepository.save(permissionForUpdate);
    }

    public void delete(long projectId, long permissionId) {
        final Permission permission = getPermissionById(projectId, permissionId);

        permissionRepository.deletePermissionById(permission.getId());
    }

    private void patchPermission(Permission permissionForUpdate, JsonMergePatch patchDto) {
        PermissionCreateDto dto;
        dto = objectMapper.treeToValue(toJsonNode(patchDto.toJsonValue()), PermissionCreateDto.class);

        if (dto.getPrincipalId() != null) {
            permissionForUpdate.setPrincipalId(dto.getPrincipalId());
        }

        if (dto.getPrincipalType() != null) {
            permissionForUpdate.setPrincipalType(dto.getPrincipalType());
        }

        if (dto.getRole() != null) {
            roleRepository.findByNameIgnoreCase(dto.getRole())
                          .ifPresent(permissionForUpdate::setRole);
        }

        permissionForUpdate.setLastModified(now());
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

    private void throwIfIdentical(PermissionCreateDto permission,
                                  Long projectId,
                                  Long roleId) {
        String principalType = permission.getPrincipalType();
        Long principalId = permission.getPrincipalId();

        List<Permission> identicalPermissions =
                permissionRepository.findIdentical(principalType, principalId, roleId, projectId);
        if (!identicalPermissions.isEmpty()) {
            throw new ConflictException("Такое правило уже существует: " + identicalPermissions.getFirst().toString());
        }
    }

    private void throwIfOverlapped(PermissionCreateDto permission,
                                   Long projectId,
                                   Long originPermissionId) {
        String principalType = permission.getPrincipalType();
        Long principalId = permission.getPrincipalId();

        List<Permission> overlappingPermissions =
                permissionRepository.findOverlapping(principalType, principalId, projectId, originPermissionId);
        if (!overlappingPermissions.isEmpty()) {
            throw new ConflictException("Переопределение правила. Отредактируйте существующее правило: "
                                                + overlappingPermissions.getFirst().toString());
        }
    }

    @NotNull
    private Permission getPermissionById(Long projectId, Long permissionId) {
        Project project = projectService.getById(projectId);
        throwIfNotOwnerOrAdmin(project);

        return project.getPermissions().stream()
                      .filter(permission -> permission.getId().equals(permissionId))
                      .findFirst()
                      .orElseThrow(() -> new NotFoundException(permissionId));
    }

    private List<PermissionProjection> getProjectPermissions(Project project) {
        return project.getPermissions().stream()
                      .map(this::mapToProjection)
                      .collect(Collectors.toList());
    }

    private List<PermissionProjection> getAllowedPermissions(Project project) {
        List<Permission> permissionsForProject = projectProtector.getUserPermissionsForProject(project);

        return permissionsForProject.stream()
                                    .map(this::mapToProjection)
                                    .collect(Collectors.toList());
    }

    @NotNull
    private PermissionProjection mapToProjection(Permission permission) {
        return projectionFactory.createProjection(PermissionProjection.class, permission);
    }

    private void throwIfNotOwnerOrAdmin(@NotNull Project project) {
        if (!projectProtector.isOwner(project.getId())) {
            throw new ForbiddenException("получения", "разрешений на проект", project.getName());
        }
    }
}
