package ru.mycrg.auth_service.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.security.access.prepost.PreAuthorize;
import ru.mycrg.auth_service.dto.OrganizationProjection;
import ru.mycrg.auth_service.entity.Organization;

import java.util.Optional;

@RepositoryRestResource(collectionResourceRel = "organizations",
                        path = "organizations",
                        excerptProjection = OrganizationProjection.class)
public interface OrganizationRepository extends PagingAndSortingRepository<Organization, Long> {

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    Iterable<Organization> findAll();

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    Page<Organization> findAll(Pageable pageable);

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    Iterable<Organization> findAll(Sort sort);

    @Override
    Optional<Organization> findById(Long aLong);

    @Override
    <S extends Organization> S save(S entity);

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    void deleteById(Long aLong);

    // NOT Exported
    @Override
    @RestResource(exported = false)
    <S extends Organization> Iterable<S> saveAll(Iterable<S> entities);

    @Override
    @RestResource(exported = false)
    boolean existsById(Long aLong);

    @Override
    @RestResource(exported = false)
    Iterable<Organization> findAllById(Iterable<Long> longs);

    @Override
    @RestResource(exported = false)
    long count();

    @Override
    @RestResource(exported = false)
    void delete(Organization entity);

    @Override
    @RestResource(exported = false)
    void deleteAll(Iterable<? extends Organization> entities);

    @Override
    @RestResource(exported = false)
    void deleteAll();
}
