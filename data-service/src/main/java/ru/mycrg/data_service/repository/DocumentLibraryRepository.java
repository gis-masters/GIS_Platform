package ru.mycrg.data_service.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.data_service.entity.DocumentLibrary;

@RepositoryRestResource(exported = false, collectionResourceRel = "libraries")
public interface DocumentLibraryRepository extends PagingAndSortingRepository<DocumentLibrary, Long> {

    Page<DocumentLibrary> findByTitleContainingIgnoreCase(String title, Pageable pageable);
}

