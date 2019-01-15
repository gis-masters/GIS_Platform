package ru.mycrg.gis.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import ru.mycrg.gis.entity.Organization;

@Repository
public interface OrganizationRepository extends PagingAndSortingRepository<Organization, Long> {

}
