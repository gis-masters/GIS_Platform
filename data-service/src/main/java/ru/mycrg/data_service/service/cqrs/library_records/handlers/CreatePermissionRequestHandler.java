package ru.mycrg.data_service.service.cqrs.library_records.handlers;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dto.PermissionCreateDto;
import ru.mycrg.data_service.dto.PermissionProjection;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.entity.Permission;
import ru.mycrg.data_service.entity.Principal;
import ru.mycrg.data_service.entity.Role;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.PermissionRepository;
import ru.mycrg.data_service.repository.RoleRepository;
import ru.mycrg.data_service.security.AuthenticationFacade;
import ru.mycrg.data_service.service.PrincipalService;
import ru.mycrg.data_service.service.cqrs.library_records.requests.CreatePermissionRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.IResourceProtector;
import ru.mycrg.mediator.IRequestHandler;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

import static java.util.stream.Collectors.toMap;
import static ru.mycrg.data_service.util.RoleHandler.defineIdByRole;

@Component
public class CreatePermissionRequestHandler implements IRequestHandler<CreatePermissionRequest, PermissionProjection> {

    private final ProjectionFactory projectionFactory;
    private final RoleRepository roleRepository;
    private final PrincipalService principalService;
    private final AuthenticationFacade authenticationFacade;
    private final PermissionRepository permissionRepository;
    private final Map<ResourceType, IResourceProtector> protectors;

    public CreatePermissionRequestHandler(ProjectionFactory projectionFactory,
                                          RoleRepository roleRepository,
                                          PrincipalService principalService,
                                          AuthenticationFacade authenticationFacade,
                                          PermissionRepository permissionRepository,
                                          List<IResourceProtector> protectors) {
        this.projectionFactory = projectionFactory;
        this.roleRepository = roleRepository;
        this.principalService = principalService;
        this.authenticationFacade = authenticationFacade;
        this.permissionRepository = permissionRepository;

        this.protectors = protectors.stream()
                                    .collect(toMap(IResourceProtector::getType, Function.identity()));
    }

    @Override
    public PermissionProjection handle(
            ru.mycrg.data_service.service.cqrs.library_records.requests.CreatePermissionRequest request) {
        ResourceQualifier rQualifier = request.getrQualifier();
        PermissionCreateDto dto = request.getDto();

        if (!protectors.get(rQualifier.getType()).isOwner(rQualifier)) {
            throw new ForbiddenException("Недостаточно прав для создания правил");
        }

        try {
            Role role = roleRepository.findById(defineIdByRole(dto.getRole()))
                                      .orElseThrow(() -> new NotFoundException("Not found role"));

            Principal principal = principalService.getOrCreate(dto.getPrincipalId(), dto.getPrincipalType());

            Permission permission = new Permission();
            permission.setRole(role);
            permission.setPrincipal(principal);
            permission.setResourceTable(rQualifier.getResourceTable());
            permission.setResourceId(request.getResourceId());
            permission.setCreatedBy(authenticationFacade.getLogin());

            Permission newPermission = permissionRepository.save(permission);
            request.setNewPermission(permission);

            return projectionFactory.createProjection(PermissionProjection.class, newPermission);
        } catch (DataIntegrityViolationException e) {
            throw new ConflictException("Already joined");
        } catch (Exception e) {
            throw new DataServiceException("Failed to create permission. Reason: " + e.getMessage());
        }
    }
}
