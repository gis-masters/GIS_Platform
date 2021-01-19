package ru.mycrg.data_service.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.entity.Schema;

import java.util.Collection;
import java.util.List;

@Repository
public interface DataSchemaRepository extends PagingAndSortingRepository<Schema, Long> {

    List<Schema> findAll();

    List<Schema> findByNameIn(Collection<String> names);

    List<Schema> findByName(String name);
}
