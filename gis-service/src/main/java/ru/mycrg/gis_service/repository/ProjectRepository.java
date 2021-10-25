package ru.mycrg.gis_service.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.gis_service.entity.Project;

import java.util.List;
import java.util.Optional;

@RepositoryRestResource(collectionResourceRel = "projects", path = "projects")
public interface ProjectRepository extends PagingAndSortingRepository<Project, Long> {

    Page<Project> findAllByOrganizationIdAndNameContainingIgnoreCase(Long orgId, String name, Pageable pageable);

    Page<Project> findAllByNameContainingIgnoreCase(String name, Pageable pageable);

    List<Project> findAllByOrganizationId(Long orgId);

    Optional<Project> findByIdAndOrganizationId(Long id, Long organizationId);
}
