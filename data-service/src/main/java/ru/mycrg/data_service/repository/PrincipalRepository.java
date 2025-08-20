package ru.mycrg.data_service.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.data_service.entity.Principal;

import java.util.Optional;

@RepositoryRestResource(exported = false)
public interface PrincipalRepository extends PagingAndSortingRepository<Principal, Long> {

    Optional<Principal> findByIdentifierAndType(Long identifier, String type);
}
