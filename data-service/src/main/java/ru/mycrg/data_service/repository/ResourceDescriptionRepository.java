package ru.mycrg.data_service.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.data_service.entity.ResourceDescription;

import java.util.Optional;

@RepositoryRestResource(exported = false)
public interface ResourceDescriptionRepository extends PagingAndSortingRepository<ResourceDescription, Long> {

    Page<ResourceDescription> findByTypeAndTitleContaining(String type, String title, Pageable pageable);

    Page<ResourceDescription> findByTypeAndResourceIdentifierStartingWithAndTitleContaining(String type,
                                                                                            String resourceIdentifier,
                                                                                            String title,
                                                                                            Pageable pageable);

    Optional<ResourceDescription> findByTypeAndResourceIdentifier(String type, String resourceIdentifier);

    Long countAllByTypeAndResourceIdentifierStartingWith(String type, String resourceIdentifier);
}
