package ru.mycrg.gis_service.mappers;

import ru.mycrg.gis_service.dto.project.ProjectProjectionImpl;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.security.Roles;

public class ProjectMapper {

    public static ProjectProjectionImpl toProjection(Project project, Roles role) {
        ProjectProjectionImpl projection = new ProjectProjectionImpl(project);
        projection.setRole(role.name());

        return projection;
    }
}
