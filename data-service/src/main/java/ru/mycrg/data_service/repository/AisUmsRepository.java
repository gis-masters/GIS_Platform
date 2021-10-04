package ru.mycrg.data_service.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.entity.AisUms;

import java.util.Set;

@Repository
public interface AisUmsRepository extends PagingAndSortingRepository<AisUms, Long> {

    void removeByIdIn(Set<Long> ids);

    void removeByDepartmentName(String departmentName);
}
