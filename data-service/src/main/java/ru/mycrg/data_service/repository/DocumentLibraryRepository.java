package ru.mycrg.data_service.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.data_service.entity.DocumentLibrary;

import java.util.List;

import java.util.Optional;

@RepositoryRestResource(exported = false, collectionResourceRel = "libraries")
public interface DocumentLibraryRepository extends PagingAndSortingRepository<DocumentLibrary, Long> {

    List<DocumentLibrary> findByTitleContainingIgnoreCase(String title);

    boolean existsByTableName(String tableName);

    Optional<DocumentLibrary> findByTableName(String tableName);
}

