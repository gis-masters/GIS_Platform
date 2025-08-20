package ru.mycrg.data_service.repository.reestrs;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.data_service.entity.reestrs.Reestr;

import java.util.Optional;

@RepositoryRestResource(exported = false)
public interface ReestrRepository extends PagingAndSortingRepository<Reestr, Long> {

    Optional<Reestr> findByTableNameIgnoreCase(String tableName);
}
