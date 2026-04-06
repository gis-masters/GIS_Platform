package ru.mycrg.data_service.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.data_service.entity.BaseMap;

import java.util.Collection;
import java.util.List;

@RepositoryRestResource(collectionResourceRel = "basemaps", exported = false)
public interface BaseMapRepository extends JpaRepository<BaseMap, Long> {

    Page<BaseMap> findByIdIn(@Param("ids") Collection<Long> ids, Pageable p);

    Page<BaseMap> findBaseMapByLayerNameNotNull(Pageable pageable);

    List<BaseMap> findBaseMapByPluggableToNewProjectIsTrue();
}
