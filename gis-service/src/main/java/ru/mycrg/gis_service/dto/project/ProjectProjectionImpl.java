package ru.mycrg.gis_service.dto.project;

import org.springframework.hateoas.server.core.Relation;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service_contract.dto.ProjectBaseProjection;

@Relation(collectionRelation = "projects")
public class ProjectProjectionImpl extends ProjectBaseProjection implements IProjectProjection {

    public ProjectProjectionImpl() {
        // Required
    }

    public ProjectProjectionImpl(Project project) {
        setId(project.getId());
        setName(project.getName());
        setOrganizationId(project.getOrganizationId());
        setBbox(project.getBbox());
        setDefault(project.isDefault());
        setFolder(project.isFolder());
        setCreatedAt(project.getCreatedAt());
        setDescription(project.getDescription());
        setPath(project.getPath());
    }
}
