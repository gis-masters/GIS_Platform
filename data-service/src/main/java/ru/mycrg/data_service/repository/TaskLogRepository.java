package ru.mycrg.data_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import ru.mycrg.data_service.entity.TaskLog;

import java.util.List;

@RepositoryRestResource(exported = false)
public interface TaskLogRepository extends JpaRepository<TaskLog, Long> {
    List<TaskLog> findAllByTaskIdIs(Long taskId);
}
