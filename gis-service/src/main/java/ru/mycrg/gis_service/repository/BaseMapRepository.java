package ru.mycrg.gis_service.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;
import ru.mycrg.gis_service.entity.BaseMap;

import java.util.Optional;

import static ru.mycrg.gis_service.config.Authorities.GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY;

@PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
@RepositoryRestResource(exported = false)
public interface BaseMapRepository extends PagingAndSortingRepository<BaseMap, Long> {

    Optional<BaseMap> findByBaseMapId(Long baseMapId);
}
