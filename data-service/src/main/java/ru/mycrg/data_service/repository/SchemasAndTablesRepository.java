package ru.mycrg.data_service.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.data_service.entity.SchemasAndTables;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@RepositoryRestResource(exported = false)
public interface SchemasAndTablesRepository extends PagingAndSortingRepository<SchemasAndTables, Long> {

    Optional<SchemasAndTables> findByIdentifier(String identifier);

    void deleteByIdentifier(String identifier);

    @Query(value = "SELECT * FROM schemas_and_tables WHERE (schema->>'name')\\:\\:text = :schemaId",
           nativeQuery = true)
    List<SchemasAndTables> findBySchemaId(@Param("schemaId") String schemaId);

    List<SchemasAndTables> findByIdentifierIn(List<String> identifiers);

    List<SchemasAndTables> findByIdIn(Set<Long> ids);
}
