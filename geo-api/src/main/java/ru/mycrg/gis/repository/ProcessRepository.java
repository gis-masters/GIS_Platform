package ru.mycrg.gis.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import ru.mycrg.gis.entity.Process;

import java.util.Optional;

@Repository
public interface ProcessRepository extends PagingAndSortingRepository<Process, Long> {

    Optional<Process> findAllByUserName(String userName);
}
