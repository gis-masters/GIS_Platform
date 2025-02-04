package ru.mycrg.data_service.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.data_service.dto.PermissionProjection;
import ru.mycrg.data_service.entity.Permission;
import ru.mycrg.data_service.entity.Principal;
import ru.mycrg.data_service.entity.Role;

import java.util.List;
import java.util.Optional;

@RepositoryRestResource(exported = false)
public interface PermissionRepository extends PagingAndSortingRepository<Permission, Long> {

    void deleteByResourceTableAndResourceId(String table, Long id);

    Page<PermissionProjection> findAllByResourceTableAndResourceId(String table, Object resId, Pageable pageable);

    List<PermissionProjection> findAllByResourceTableAndResourceId(String table, Long resId);

    Page<PermissionProjection> findAllByResourceTableAndResourceIdAndPrincipalIn(String table,
                                                                                 Object resId,
                                                                                 List<Principal> principals,
                                                                                 Pageable pageable);

    Optional<Permission> findByResourceTableAndResourceIdAndPrincipalAndRole(String table,
                                                                             Object resId,
                                                                             Principal principal,
                                                                             Role role);
}
