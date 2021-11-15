package ru.mycrg.data_service.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.data_service.entity.DocumentLibrary;

import java.util.Optional;

@RepositoryRestResource(exported = false, collectionResourceRel = "libraries")
public interface DocumentLibraryRepository extends PagingAndSortingRepository<DocumentLibrary, Long> {

    boolean existsByTableName(String tableName);

    Page<DocumentLibrary> findAllByTitleContainingIgnoreCase(String title, Pageable pageable);

    Optional<DocumentLibrary> findByTableName(String tableName);
}
