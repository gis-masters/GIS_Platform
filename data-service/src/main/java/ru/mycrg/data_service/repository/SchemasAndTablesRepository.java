package ru.mycrg.data_service.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.data_service.entity.SchemasAndTables;

import java.util.Optional;

@RepositoryRestResource(exported = false)
public interface SchemasAndTablesRepository extends PagingAndSortingRepository<SchemasAndTables, Long> {

    Optional<SchemasAndTables> findByIdentifier(String identifier);

    @Query(value = "SELECT * FROM schemas_and_tables AS res WHERE res.path = ?1 " +
            "AND LOWER(res.title) LIKE CONCAT('%',LOWER(?2),'%')",
           countQuery = "SELECT count(*) FROM schemas_and_tables AS res WHERE res.path = ?1 " +
                   "AND LOWER(res.title) LIKE CONCAT('%',LOWER(?2),'%')",
           nativeQuery = true)
    Page<SchemasAndTables> findByPath(String path, String title, Pageable pageable);

    void deleteByIdentifier(String identifier);
}
