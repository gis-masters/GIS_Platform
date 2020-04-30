package ru.mycrg.data_service.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.data_service.entity.Resource;

@RepositoryRestResource(exported = false)
public interface ResourceRepository extends PagingAndSortingRepository<Resource, Long> {

}

