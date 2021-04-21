package ru.mycrg.data_service.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.data_service.dto.PermissionProjection;
import ru.mycrg.data_service.entity.Permission;
import ru.mycrg.data_service.entity.Principal;
import ru.mycrg.data_service.entity.Resource;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@RepositoryRestResource(excerptProjection = PermissionProjection.class,
                        exported = false)
public interface PermissionsRepository extends PagingAndSortingRepository<Permission, Long> {

    Page<PermissionProjection> getAllByResource(Resource resource, Pageable pageable);

    Optional<Permission> findByResourceAndPrincipalAndRole(Resource resource, Principal principal, String role);

    Optional<Permission> findByResourceAndPrincipal(Resource resource, Principal principal);

    @Query("SELECT per FROM Permission AS per " +
                   "JOIN Principal AS pri ON pri.id = per.principal.id " +
                   "WHERE per.resource.id = :resourceId " +
                   "AND ((pri.type = 'user' AND pri.identifier = :userId) " +
                   "OR (pri.type = 'group' AND pri.identifier IN (:groupIds)))")
    Set<PermissionProjection> findByRelatedPermissions(@Param("resourceId") Long resourceId,
                                                       @Param("userId") Long userId,
                                                       @Param("groupIds") List<Long> groupIds);

    @Modifying
    @Query("DELETE FROM Permission where id = :id")
    void deleteById(@Param("id") Long id);
}

