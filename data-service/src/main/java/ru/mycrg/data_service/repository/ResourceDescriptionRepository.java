package ru.mycrg.data_service.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.data_service.entity.ResourceDescription;

import java.util.Optional;

@RepositoryRestResource(exported = false)
public interface ResourceDescriptionRepository extends PagingAndSortingRepository<ResourceDescription, Long> {

    Page<ResourceDescription> findByTypeAndTitleContaining(String type, String title, Pageable pageable);

    Page<ResourceDescription> findByTypeAndIdentifierStartingWithAndTitleContaining(String type,
                                                                                    String identifier,
                                                                                    String title,
                                                                                    Pageable pageable);

    Optional<ResourceDescription> findByTypeAndIdentifier(String type, String resourceIdentifier);

    @Modifying
    @Query("UPDATE ResourceDescription rd SET rd.itemsCount = rd.itemsCount + 1 WHERE rd.identifier = :identifier")
    void increaseItemsCounter(@Param("identifier") String identifier);

}
