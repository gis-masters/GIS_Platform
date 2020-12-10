package ru.mycrg.data_service.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.data_service.entity.Resource;

import java.util.Optional;

@RepositoryRestResource(exported = false)
public interface ResourceRepository extends PagingAndSortingRepository<Resource, Long> {

    Optional<Resource> findByTypeAndIdentifier(String type, String identifier);

    Page<Resource> findByTypeAndTitleContaining(String type, String title, Pageable pageable);

    void deleteByIdentifierStartsWith(String identifier);

    Page<Resource> findByTypeAndIdentifierStartingWithAndTitleContaining(String type,
                                                                         String identifier,
                                                                         String title,
                                                                         Pageable pageable);

    @Modifying
    @Query("UPDATE Resource rd SET rd.itemsCount = rd.itemsCount + 1 WHERE rd.identifier = :identifier")
    void increaseItemsCounter(@Param("identifier") String identifier);
}

