package ru.mycrg.gis_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.gis_service.entity.BaseMap;

import java.util.List;

@RepositoryRestResource(exported = false)
public interface BaseMapRepository extends JpaRepository<BaseMap, Long> {

    List<BaseMap> findAllByBaseMapId(Long baseMapId);

    @Query("SELECT b FROM BaseMap b " +
            "LEFT JOIN FETCH b.project p " +
            "WHERE b.baseMapId = :baseMapId " +
            "AND p.organizationId = :organizationId")
    List<BaseMap> findByBasemapIdAndOrgId(@Param("baseMapId") Long baseMapId,
                                          @Param("organizationId") Long organizationId);
}
