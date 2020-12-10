package ru.mycrg.auth_service.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;
import ru.mycrg.auth_service.dto.GroupProjection;
import ru.mycrg.auth_service.entity.Group;

import java.util.Optional;

import static ru.mycrg.auth_service_contract.Authorities.GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;

@PreAuthorize(HAS_ANY_AUTHORITY)
@RepositoryRestResource(collectionResourceRel = "groups",
                        path = "groups",
                        excerptProjection = GroupProjection.class)
public interface GroupRepository extends PagingAndSortingRepository<Group, Long> {

    Optional<Group> findByIdAndOrganizationId(Long id, Long organizationId);

    Page<GroupProjection> findByOrganizationId(Long organizationId, Pageable p);
}
