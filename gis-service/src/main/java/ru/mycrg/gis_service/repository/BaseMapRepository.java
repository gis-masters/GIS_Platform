package ru.mycrg.gis_service.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.gis_service.entity.BaseMap;

import java.util.List;

@RepositoryRestResource(exported = false)
public interface BaseMapRepository extends PagingAndSortingRepository<BaseMap, Long> {

    List<BaseMap> findAllByBaseMapId(Long baseMapId);
}
