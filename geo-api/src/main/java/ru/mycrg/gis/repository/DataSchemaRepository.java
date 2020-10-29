package ru.mycrg.gis.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import ru.mycrg.gis.entity.DataSchemaDescription;

import java.util.Collection;
import java.util.List;

@Repository
public interface DataSchemaRepository extends PagingAndSortingRepository<DataSchemaDescription, Long> {

    List<DataSchemaDescription> findAll();

    List<DataSchemaDescription> findByNameIn(Collection<String> names);

    List<DataSchemaDescription> findByName(String name);
}
