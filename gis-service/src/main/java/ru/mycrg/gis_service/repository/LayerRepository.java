package ru.mycrg.gis_service.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;
import ru.mycrg.gis_service.entity.Layer;
import ru.mycrg.gis_service.entity.Project;

import java.util.Optional;

import static ru.mycrg.gis_service.config.Authorities.GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY;

@PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
@RepositoryRestResource(collectionResourceRel = "layers", path = "layers")
public interface LayerRepository extends PagingAndSortingRepository<Layer, Long> {

    Optional<Layer> findByInternalNameAndProject(String internalName, Project project);
}
