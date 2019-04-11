package ru.mycrg.gis.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import ru.mycrg.gis.entity.Organization;
import ru.mycrg.gis.entity.User;

import java.util.List;

@Repository
public interface OrganizationRepository extends PagingAndSortingRepository<Organization, Long> {

    List<Organization> findOrganizationByUsersContaining(User name);
}
