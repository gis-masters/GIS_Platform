package ru.mycrg.data_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.data_service.entity.Role;

@RepositoryRestResource(exported = false)
public interface RoleRepository extends JpaRepository<Role, Long> {

}
