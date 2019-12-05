package ru.mycrg.auth.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;
import ru.mycrg.auth.entity.Organization;

import java.util.List;

@PreAuthorize("hasAuthority('ADMIN')")
@RepositoryRestResource(collectionResourceRel = "organizations", path = "organizations")
public interface OrganizationRepository extends PagingAndSortingRepository<Organization, Long> {

}
