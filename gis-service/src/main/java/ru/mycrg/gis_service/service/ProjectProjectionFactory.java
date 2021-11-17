package ru.mycrg.gis_service.service;

import org.springframework.stereotype.Service;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.security.IAuthenticationFacade;

import static ru.mycrg.gis_service.security.Roles.OWNER;

@Service
public class ProjectProjectionFactory {

    private final ResourceProtector resourceProtector;
    private final IAuthenticationFacade authenticationFacade;

    public ProjectProjectionFactory(ResourceProtector resourceProtector,
                                    IAuthenticationFacade authenticationFacade) {
        this.resourceProtector = resourceProtector;
        this.authenticationFacade = authenticationFacade;
    }

    public ProjectProjectionImpl setRoleAndCreateProjection(Project project) {
        final ProjectProjectionImpl projection = new ProjectProjectionImpl(project);

        if (authenticationFacade.isOrganizationAdmin()) {
            projection.setRole(OWNER.name());

            return projection;
        }

        resourceProtector.defineBestRole(project.getPermissions())
                         .ifPresent(projection::setRole);

        return projection;
    }
}
