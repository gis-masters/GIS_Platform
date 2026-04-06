package ru.mycrg.gis_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.gis_service.entity.Group;

@RepositoryRestResource(exported = false)
public interface GroupRepository extends JpaRepository<Group, Long> {

    @Modifying
    @Query("DELETE FROM Group g where g.id = :groupId")
    void deleteGroupById(@Param("groupId") Long groupId);
}
