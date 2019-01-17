package ru.mycrg.gis.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import ru.mycrg.gis.entity.CustomRule;

import java.util.Optional;

public interface CustomRuleRepository extends PagingAndSortingRepository<CustomRule, Long> {

    Optional<CustomRule> findCustomRuleByClassName(String name);
}
