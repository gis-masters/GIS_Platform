package ru.mycrg.gis_service.mappers;

import ru.mycrg.common_contracts.enums.Roles;
import ru.mycrg.gis_service.dto.project.ProjectProjectionImpl;
import ru.mycrg.gis_service.entity.Project;

public class ProjectMapper {

    public static ProjectProjectionImpl toProjection(Project project, Roles role) {
        ProjectProjectionImpl projection = new ProjectProjectionImpl(project);
        projection.setRole(role);

        return projection;
    }
}
