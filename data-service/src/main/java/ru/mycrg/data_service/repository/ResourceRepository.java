package ru.mycrg.data_service.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.data_service.entity.Resource;

import java.util.List;
import java.util.Optional;

@RepositoryRestResource(exported = false)
public interface ResourceRepository extends PagingAndSortingRepository<Resource, Long> {

    Optional<Resource> findByTypeAndIdentifier(String type, String identifier);

    List<Resource> findByTypeAndTitleContainingIgnoreCase(String type, String title);

    void deleteByIdentifierStartsWith(String identifier);

    List<Resource> findByTypeAndIdentifierStartingWithAndTitleContainingIgnoreCase(String type,
                                                                                   String identifier,
                                                                                   String title);

    @Modifying
    @Query("UPDATE Resource rd SET rd.itemsCount = rd.itemsCount + 1 WHERE rd.identifier = :identifier")
    void increaseItemsCounter(@Param("identifier") String identifier);
}

