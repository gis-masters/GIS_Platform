package ru.mycrg.gis_service.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;
import ru.mycrg.gis_service.entity.Group;

import static ru.mycrg.gis_service.config.Authorities.GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY;

@RepositoryRestResource(exported = false)
public interface GroupRepository extends PagingAndSortingRepository<Group, Long> {

    @Modifying
    @Query("DELETE FROM Group g where g.id = :groupId")
    void deleteGroupById(@Param("groupId") Long groupId);
}
