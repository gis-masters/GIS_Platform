package ru.mycrg.data_service.service.cqrs.library_records.handlers;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dto.PermissionCreateDto;
import ru.mycrg.data_service.dto.PermissionProjection;
import ru.mycrg.data_service.entity.Permission;
import ru.mycrg.data_service.entity.Principal;
import ru.mycrg.data_service.entity.Role;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.PermissionRepository;
import ru.mycrg.data_service.repository.RoleRepository;
import ru.mycrg.data_service.service.PrincipalService;
import ru.mycrg.data_service.service.cqrs.library_records.requests.CreatePermissionRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.IMasterResourceProtector;
import ru.mycrg.data_service.service.resources.protectors.MasterResourceProtector;
import ru.mycrg.mediator.IRequestHandler;

import static ru.mycrg.data_service.util.RoleHandler.defineIdByRole;

@Component
public class CreatePermissionRequestHandler implements IRequestHandler<CreatePermissionRequest, PermissionProjection> {

    private final ProjectionFactory projectionFactory;
    private final RoleRepository roleRepository;
    private final PrincipalService principalService;
    private final IAuthenticationFacade authenticationFacade;
    private final PermissionRepository permissionRepository;
    private final IMasterResourceProtector resourceProtector;

    public CreatePermissionRequestHandler(ProjectionFactory projectionFactory,
                                          RoleRepository roleRepository,
                                          PrincipalService principalService,
                                          IAuthenticationFacade authenticationFacade,
                                          PermissionRepository permissionRepository,
                                          MasterResourceProtector resourceProtector) {
        this.projectionFactory = projectionFactory;
        this.roleRepository = roleRepository;
        this.principalService = principalService;
        this.authenticationFacade = authenticationFacade;
        this.permissionRepository = permissionRepository;
        this.resourceProtector = resourceProtector;
    }

    @Override
    public PermissionProjection handle(CreatePermissionRequest request) {
        ResourceQualifier rQualifier = request.getrQualifier();
        PermissionCreateDto dto = request.getDto();

        if (!resourceProtector.isOwner(rQualifier)) {
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
