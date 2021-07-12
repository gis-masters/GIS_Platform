package ru.mycrg.data_service.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.data_service.dto.PermissionProjection;
import ru.mycrg.data_service.entity.Permission;
import ru.mycrg.data_service.entity.Principal;

import java.util.List;
import java.util.Optional;

@RepositoryRestResource(exported = false)
public interface PermissionRepository extends PagingAndSortingRepository<Permission, Long> {

    void deleteByResourceTableAndResourceId(String table, Long id);

    @Query("SELECT max(p.role.id) " +
                   "FROM Permission AS p " +
                   "WHERE p.resourceTable = :resTable " +
                   "AND p.resourceId = :resId " +
                   "AND p.principal IN :principals")
    Optional<Long> bestRoleNonHierarchy(@Param("resTable") String resTable,
                                        @Param("resId") Long resId,
                                        @Param("principals") List<Principal> principals);

    Page<PermissionProjection> findAllByResourceTableAndResourceId(String table, Long resId, Pageable pageable);

    List<PermissionProjection> findAllByResourceTableAndResourceId(String table, Long resId);

    Page<PermissionProjection> findAllByResourceTableAndResourceIdAndPrincipalIn(String table,
                                                                                 Long resId,
                                                                                 List<Principal> principals,
                                                                                 Pageable pageable);
}
