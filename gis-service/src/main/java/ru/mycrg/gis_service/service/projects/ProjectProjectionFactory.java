package ru.mycrg.gis_service.service.projects;

import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.gis_service.dto.project.ProjectProjectionImpl;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.service.ResourceProtector;

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
        ProjectProjectionImpl projection = new ProjectProjectionImpl(project);

        if (authenticationFacade.isOrganizationAdmin()) {
            projection.setRole(OWNER.name());

            return projection;
        }

        resourceProtector.defineBestRole(project)
                         .ifPresent(projection::setRole);

        return projection;
    }
}
