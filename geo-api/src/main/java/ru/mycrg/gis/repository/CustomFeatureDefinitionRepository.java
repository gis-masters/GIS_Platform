package ru.mycrg.gis.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import ru.mycrg.gis.entity.CustomFeatureDescription;

import java.util.Optional;

@Repository
public interface CustomFeatureDefinitionRepository extends PagingAndSortingRepository<CustomFeatureDescription, Long> {

    Optional<CustomFeatureDescription> findDefinitionByClassName(String name);
}
