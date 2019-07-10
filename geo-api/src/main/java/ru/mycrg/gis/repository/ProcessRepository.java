package ru.mycrg.gis.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.entity.User;

import java.util.Optional;

public interface ProcessRepository extends PagingAndSortingRepository<Process, Long> {

    Optional<Process> findAllByUser(User user);
}
