package ru.mycrg.data_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.data_service.entity.EntityDescription;

import java.util.List;

@RepositoryRestResource(exported = false)
public interface EntityDescriptionRepository extends JpaRepository<EntityDescription, String> {

    List<EntityDescription> findAllByTableNameIn(List<String> tableNames);
}
