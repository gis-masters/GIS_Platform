package ru.mycrg.gis.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.gis.entity.Project;

import java.util.List;
import java.util.Optional;

@RepositoryRestResource(collectionResourceRel = "projects", path = "projects")
public interface ProjectRepository extends PagingAndSortingRepository<Project, Long> {

    Optional<Project> findByInternalName(String internalName);

    Optional<Project> findByInternalNameAndOrganizationId(String internalName, Long organizationId);

    List<Project> findByOrganizationId(Long organizationId);

    Page<Project> findByOrganizationId(Long organizationId, Pageable pageable);

}
