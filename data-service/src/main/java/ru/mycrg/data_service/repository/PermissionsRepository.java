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

import java.util.Optional;

@RepositoryRestResource(excerptProjection = PermissionProjection.class,
                        exported = false)
public interface PermissionsRepository extends PagingAndSortingRepository<Permission, Long> {

    Page<PermissionProjection> getAllByResource(Resource resource, Pageable pageable);

    Optional<Permission> findByResourceAndPrincipalAndRole(Resource resource, Principal principal, String role);

    Optional<Permission> findByResourceAndPrincipal(Resource resource, Principal principal);

    @Modifying
    @Query("DELETE FROM Permission where id = :id")
    void deleteById(@Param("id") Long id);

}

