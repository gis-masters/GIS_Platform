package ru.mycrg.auth_service.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.security.access.prepost.PreAuthorize;
import ru.mycrg.auth_service.entity.Organization;

import java.util.Optional;

import static ru.mycrg.auth_service_contract.Authorities.SYSTEM_ADMIN_AUTHORITY;

@RepositoryRestResource(collectionResourceRel = "organizations", exported = false)
public interface OrganizationRepository extends PagingAndSortingRepository<Organization, Long> {

    @Override
    @PreAuthorize(SYSTEM_ADMIN_AUTHORITY)
    Iterable<Organization> findAll();

    @Override
    @PreAuthorize(SYSTEM_ADMIN_AUTHORITY)
    Page<Organization> findAll(Pageable pageable);

    @Override
    @PreAuthorize(SYSTEM_ADMIN_AUTHORITY)
    Iterable<Organization> findAll(Sort sort);

    // NOT Exported
    @Override
    @RestResource(exported = false)
    Optional<Organization> findById(Long aLong);

    @Override
    @RestResource(exported = false)
    <S extends Organization> S save(S entity);

    @Override
    @RestResource(exported = false)
    void deleteById(Long aLong);

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
