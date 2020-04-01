package ru.mycrg.data_service.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;
import ru.mycrg.data_service.dto.BaseMapProjection;
import ru.mycrg.data_service.entity.BaseMap;

import java.util.Collection;

import static ru.mycrg.data_service.config.Authorities.GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY;

@PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
@RepositoryRestResource(collectionResourceRel = "basemaps",
                        path = "basemaps",
                        excerptProjection = BaseMapProjection.class)
public interface BaseMapRepository extends PagingAndSortingRepository<BaseMap, Long> {

    Page<BaseMap> findByIdIn(@Param("ids") Collection<Long> ids, Pageable p);

}
