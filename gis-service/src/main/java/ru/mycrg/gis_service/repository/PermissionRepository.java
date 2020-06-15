package ru.mycrg.gis_service.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.gis_service.entity.Permission;

import java.util.List;

@RepositoryRestResource(exported = false)
public interface PermissionRepository extends PagingAndSortingRepository<Permission, Long> {

    @Query("from Permission where principalType = :principalType " +
            "and principalId = :principalId " +
            "and role = :role " +
            "and project.id = :projectId")
    List<Permission> findIdentical(@Param("principalType") String principalType,
                                   @Param("principalId") Long principalId,
                                   @Param("role") String role,
                                   @Param("projectId") Long projectId);

    @Query("from Permission where id <> :originPermissionId " +
            "and principalType = :principalType " +
            "and principalId = :principalId " +
            "and project.id = :projectId")
    List<Permission> findOverlapping(@Param("principalType") String principalType,
                                     @Param("principalId") Long principalId,
                                     @Param("projectId") Long projectId,
                                     @Param("originPermissionId") Long originPermissionId);

    @Modifying
    @Query("DELETE FROM Permission p where p.id = :id")
    void deletePermissionById(@Param("id") Long id);
}
