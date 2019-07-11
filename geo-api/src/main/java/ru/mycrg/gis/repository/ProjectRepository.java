package ru.mycrg.gis.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import ru.mycrg.gis.entity.Project;

import java.util.Optional;

@Repository
public interface ProjectRepository extends PagingAndSortingRepository<Project, Long> {

}
