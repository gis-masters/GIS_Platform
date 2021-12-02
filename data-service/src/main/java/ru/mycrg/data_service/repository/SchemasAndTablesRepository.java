package ru.mycrg.data_service.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.data_service.entity.SchemasAndTables;

import java.util.Optional;

@RepositoryRestResource(exported = false)
public interface SchemasAndTablesRepository extends PagingAndSortingRepository<SchemasAndTables, Long> {

    Optional<SchemasAndTables> findByIdentifier(String identifier);

    void deleteByIdentifier(String identifier);
}
