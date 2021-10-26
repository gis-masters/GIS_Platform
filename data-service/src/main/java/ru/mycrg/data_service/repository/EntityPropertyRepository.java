package ru.mycrg.data_service.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.entity.EntityProperty;

@Repository
public interface EntityPropertyRepository extends PagingAndSortingRepository<EntityProperty, Long> {

}
