package ru.mycrg.gis_service.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.gis_service.entity.Permission;

import java.util.List;
import java.util.Optional;

@RepositoryRestResource(exported = false)
public interface PermissionRepository extends PagingAndSortingRepository<Permission, Long> {

    @Query("FROM Permission WHERE  principalType = :principalType " +
            "AND principalId = :principalId " +
            "AND role.id = :roleId " +
            "AND project.id = :projectId")
    List<Permission> findIdentical(@Param("principalType") String principalType,
                                   @Param("principalId") Long principalId,
                                   @Param("roleId") Long roleId,
                                   @Param("projectId") Long projectId);

    @Query("FROM Permission WHERE id <> :originPermissionId " +
            "AND principalType = :principalType " +
            "AND principalId = :principalId " +
            "AND project.id = :projectId")
    List<Permission> findOverlapping(@Param("principalType") String principalType,
                                     @Param("principalId") Long principalId,
                                     @Param("projectId") Long projectId,
                                     @Param("originPermissionId") Long originPermissionId);

    @Modifying
    @Query("DELETE FROM Permission p where p.id = :id")
    void deletePermissionById(@Param("id") Long id);

    @Query("SELECT role.name FROM Role as role " +
            "WHERE role.id =" +
            "(SELECT max(p.role.id) as maxRoleId FROM Permission p " +
            "WHERE p.principalId IN (:allPrincipalIds) " +
            "AND p.project.id  = :projectId) ")
    Optional<String> getBestRoleForProject(@Param("allPrincipalIds") List<Long> allPrincipalIds,
                                           @Param("projectId") Long projectId);

    void deleteAllByProjectIdIn(List<Long> projectIds);
}
