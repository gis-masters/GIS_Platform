package ru.mycrg.data_service.service.cqrs.tasks.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dto.TaskLogDto;
import ru.mycrg.data_service.entity.Task;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.TaskRepository;
import ru.mycrg.data_service.service.TaskLogService;
import ru.mycrg.data_service.service.cqrs.tasks.requests.UpdateTaskStatusRequest;
import ru.mycrg.data_service_contract.enums.TaskStatus;
import ru.mycrg.mediator.IRequestHandler;

import java.time.LocalDateTime;

import static java.util.Objects.nonNull;

@Component
public class UpdateTaskStatusRequestHandler implements IRequestHandler<UpdateTaskStatusRequest, Task> {

    private final TaskRepository taskRepository;
    private final TaskLogService taskLogService;
    private final IAuthenticationFacade authenticationFacade;

    public UpdateTaskStatusRequestHandler(TaskRepository taskRepository,
                                          TaskLogService taskLogService,
                                          IAuthenticationFacade authenticationFacade) {
        this.taskRepository = taskRepository;
        this.taskLogService = taskLogService;
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public Task handle(UpdateTaskStatusRequest request) {
        Long userId = authenticationFacade.getUserDetails().getUserId();
        TaskStatus newStatus = request.getTaskStatus();
        Long taskId = request.getTaskId();

        Task taskFromDb = taskRepository
                .findById(taskId)
                .orElseThrow(() -> new NotFoundException("Не найдена задача: " + taskId));

        taskFromDb.setUpdatedBy(userId);
        taskFromDb.setLastModified(LocalDateTime.now());

        if (nonNull(newStatus)) {
            taskFromDb.setStatus(newStatus);
        }

        Task updatedTask = taskRepository.save(taskFromDb);

        taskLogService.create(new TaskLogDto("Статус задачи обновлён на: " + newStatus.getTranslatedStatus(),
                                             updatedTask.getId()),
                              updatedTask);

        return updatedTask;
    }
}
