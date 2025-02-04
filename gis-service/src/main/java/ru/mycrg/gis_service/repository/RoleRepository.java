package ru.mycrg.gis_service.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.gis_service.entity.Role;

import java.util.Optional;

@RepositoryRestResource(exported = false)
public interface RoleRepository extends PagingAndSortingRepository<Role, Long> {

    Optional<Role> findByNameIgnoreCase(String name);
}
