package ru.mycrg.data_service.repository;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.entity.Schema;

import java.util.Collection;
import java.util.List;

@Repository
public interface DataSchemaRepository extends PagingAndSortingRepository<Schema, Long> {

    @Override
    @NotNull
    List<Schema> findAll();

    List<Schema> findByNameIn(Collection<String> names);

    List<Schema> findByName(String name);

    @Query(value = "SELECT * FROM schemas WHERE class_rule \\:\\:text ILIKE %:property%",
           nativeQuery = true)
    List<Schema> findBySpecificPropertyName(@Param("property") String property);

    boolean existsByName(String name);
}
