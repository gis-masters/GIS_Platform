package ru.mycrg.data_service.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.data_service.entity.EntityDescription;

import java.util.List;

@RepositoryRestResource(exported = false)
public interface EntityDescriptionRepository extends PagingAndSortingRepository<EntityDescription, String> {

    List<EntityDescription> findAllByTableNameIn(List<String> tableNames);
}
