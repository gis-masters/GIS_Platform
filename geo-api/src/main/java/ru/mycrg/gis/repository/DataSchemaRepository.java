package ru.mycrg.gis.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import ru.mycrg.gis.entity.XsdRule;

import java.util.Optional;

@Repository
public interface DataSchemaRepository extends PagingAndSortingRepository<XsdRule, Long> {

    Optional<XsdRule> findXsdRuleByClassName(String name);
}
