package ru.mycrg.gis_service.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.gis_service.entity.Project;

import java.util.Optional;

@RepositoryRestResource(collectionResourceRel = "projects", path = "projects")
public interface ProjectRepository extends PagingAndSortingRepository<Project, Long> {

    Page<Project> findAllByOrganizationId(Long orgId, Pageable pageable);

    Optional<Project> findByIdAndOrganizationId(Long id, Long organizationId);

    Optional<Project> findByNameAndOrganizationId(String name, Long organizationId);

    Optional<Project> findByInternalNameAndOrganizationId(String internalName, Long organizationId);

    Optional<Project> findByInternalName(String internalName);
}
