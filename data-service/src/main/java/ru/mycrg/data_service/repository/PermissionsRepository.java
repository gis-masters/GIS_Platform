package ru.mycrg.data_service.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import ru.mycrg.data_service.dto.PermissionProjection;
import ru.mycrg.data_service.dto.PermissionWithoutResourceProjection;
import ru.mycrg.data_service.entity.Permission;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@RepositoryRestResource(collectionResourceRel = "permissions",
        path = "permissions",
        excerptProjection = PermissionProjection.class,
        exported = false)
public interface PermissionsRepository extends PagingAndSortingRepository<Permission, Long> {

    @RestResource(exported = false)
    @Query("FROM Permission as p WHERE p.principalType = :principalType AND p.principalId = :principalId")
    Optional<Permission> findPermissionByPrincipal(@Param("principalType") String principalType,
                                                   @Param("principalId") Long principalId);

    @RestResource(exported = false)
    @Query("FROM Permission as p " +
            "WHERE p.principalType = :principalType AND p.principalId = :principalId AND p.role = :role")
    Optional<Permission> findPermissionByParams(@Param("principalType") String principalType,
                                                @Param("principalId") Long principalId,
                                                @Param("role") String role);

    @RestResource(exported = false)
    @Query("SELECT p FROM Permission as p INNER JOIN p.resources as r WHERE r.identifier = :identifier")
    Page<PermissionWithoutResourceProjection> getAllByResourceIdentifier(@Param("identifier") String identifier,
                                                                         Pageable pageable);

    @RestResource(exported = false)
    @Query("SELECT p FROM Permission as p INNER JOIN p.resources as r " +
            "WHERE r.identifier = :identifier AND r.type = :type")
    Set<Permission> getAllByResourceIdentifierAndType(@Param("identifier") String identifier,
                                                      @Param("type") String type);

    @RestResource(exported = false)
    @Query("SELECT p FROM Permission as p INNER JOIN p.resources as r " +
            "WHERE r.identifier = :identifier AND r.type = :type AND p.id = :permissionId")
    Optional<Permission> getByIdWithSpecificResource(@Param("permissionId") Long permissionId,
                                                     @Param("identifier") String identifier,
                                                     @Param("type") String type);

    @RestResource(exported = false)
    @Query("SELECT r.identifier FROM Permission as p INNER JOIN p.resources as r " +
            "WHERE p.principalId IN :ids AND r.identifier LIKE :identifier%")
    Set<String> getAllByResourceIdentifierAndPrincipalIds(@Param("identifier") String identifier,
                                                          @Param("ids") List<Long> ids);

    @RestResource(exported = false)
    @Query("SELECT p.role FROM Permission as p " +
            "INNER JOIN p.resources as r " +
            "WHERE p.principalType = 'user' AND p.principalId = :principalId " +
            "AND r.type = :type AND r.identifier = :identifier")
    Optional<String> getRoleForUser(@Param("principalId") Long principalId,
                                    @Param("identifier") String identifier, @Param("type") String type);

    @RestResource(exported = false)
    @Query("SELECT p.role FROM Permission as p " +
            "INNER JOIN p.resources as r " +
            "WHERE p.principalType = 'group' AND p.principalId IN (:groups)" +
            "AND r.type = :type AND r.identifier = :identifier")
    Optional<String> getRoleForGroups(@Param("groups") List<Long> groups,
                                      @Param("identifier") String identifier, @Param("type") String type);

    @Modifying
    @Query("UPDATE Permission p SET p.role = :newRole, p.lastModified = CURRENT_TIMESTAMP " +
            "WHERE p.principalId = :pId AND p.principalType = :pType")
    @RestResource(exported = false)
    int updatePermissionRole(@Param("pType") String pincipalType,
                             @Param("pId") Long principalId,
                             @Param("newRole") String newRole);
}

