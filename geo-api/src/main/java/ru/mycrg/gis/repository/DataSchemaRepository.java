package ru.mycrg.gis.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import ru.mycrg.gis.entity.FeatureDescription;

import java.util.Optional;

@Repository
public interface DataSchemaRepository extends PagingAndSortingRepository<FeatureDescription, Long> {

    Optional<FeatureDescription> findXsdRuleByClassName(String name);
}
