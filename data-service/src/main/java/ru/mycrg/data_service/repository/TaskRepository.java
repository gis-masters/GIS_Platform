package ru.mycrg.data_service.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.data_service.entity.Task;

@RepositoryRestResource(exported = false)
public interface TaskRepository extends PagingAndSortingRepository<Task, Long> {
}
