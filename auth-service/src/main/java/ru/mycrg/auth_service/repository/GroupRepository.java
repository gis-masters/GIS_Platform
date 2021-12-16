package ru.mycrg.auth_service.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.auth_service.dto.GroupProjection;
import ru.mycrg.auth_service.entity.Group;

import java.util.Optional;

@RepositoryRestResource(collectionResourceRel = "groups",
                        path = "groups",
                        excerptProjection = GroupProjection.class)
public interface GroupRepository extends PagingAndSortingRepository<Group, Long> {

    Optional<Group> findByIdAndOrganizationId(Long id, Long organizationId);

    Page<GroupProjection> findByOrganizationId(Long organizationId, Pageable p);
}
