package ru.mycrg.auth_service.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.security.access.prepost.PreAuthorize;
import ru.mycrg.auth_service.entity.User;
import ru.mycrg.auth_service.dto.UserProjection;

import java.util.Optional;

@RepositoryRestResource(collectionResourceRel = "users", path = "users", excerptProjection = UserProjection.class)
public interface UserRepository extends PagingAndSortingRepository<User, Long> {

    @PreAuthorize("permitAll()")
    Optional<User> findByUsername(@Param("username") String userName);

    @PreAuthorize("permitAll()")
    Optional<User> findByEmail(@Param("email") String email);

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    Iterable<User> findAll();

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    Optional<User> findById(Long aLong);

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    void deleteById(Long aLong);

    // NOT Exported
    @Override
    @RestResource(exported = false)
    <S extends User> S save(S entity);

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    @RestResource(exported = false)
    <S extends User> Iterable<S> saveAll(Iterable<S> entities);

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
     @RestResource(exported = false)
    boolean existsById(Long aLong);

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    @RestResource(exported = false)
    Iterable<User> findAllById(Iterable<Long> longs);

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    @RestResource(exported = false)
    long count();

    @Override
    @RestResource(exported = false)
    void delete(User entity);

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    @RestResource(exported = false)
    void deleteAll(Iterable<? extends User> entities);

    @Override
    @PreAuthorize("hasAuthority('ADMIN')")
    @RestResource(exported = false)
    void deleteAll();
}
