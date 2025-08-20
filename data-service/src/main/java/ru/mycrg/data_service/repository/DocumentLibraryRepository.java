package ru.mycrg.data_service.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.data_service.entity.DocumentLibrary;

import java.util.List;
import java.util.Optional;

@RepositoryRestResource(exported = false, collectionResourceRel = "libraries")
public interface DocumentLibraryRepository extends PagingAndSortingRepository<DocumentLibrary, Long> {

    boolean existsByTableName(String tableName);

    Optional<DocumentLibrary> findByTableName(String tableName);

    @Query(value = "SELECT * FROM doc_libraries WHERE (schema->>'name')\\:\\:text = :schemaId",
           nativeQuery = true)
    List<DocumentLibrary> findBySchemaId(@Param("schemaId") String schemaId);

    void deleteByTableName(String tableName);
}
