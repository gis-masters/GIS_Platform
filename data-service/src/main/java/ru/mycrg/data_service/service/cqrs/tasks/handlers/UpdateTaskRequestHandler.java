package ru.mycrg.data_service.service.cqrs.tasks.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dto.TaskLogDto;
import ru.mycrg.data_service.entity.Task;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.TaskRepository;
import ru.mycrg.data_service.service.TaskLogService;
import ru.mycrg.data_service.service.cqrs.tasks.requests.UpdateTaskRequest;
import ru.mycrg.data_service_contract.dto.TaskUpdateDto;
import ru.mycrg.data_service_contract.enums.TaskType;
import ru.mycrg.mediator.IRequestHandler;

import java.time.LocalDateTime;

import static java.util.Objects.nonNull;

@Component
public class UpdateTaskRequestHandler implements IRequestHandler<UpdateTaskRequest, Task> {

    private final TaskRepository taskRepository;
    private final TaskLogService taskLogService;
    private final IAuthenticationFacade authenticationFacade;

    public UpdateTaskRequestHandler(TaskRepository taskRepository,
                                    TaskLogService taskLogService,
                                    IAuthenticationFacade authenticationFacade) {
        this.taskRepository = taskRepository;
        this.taskLogService = taskLogService;
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public Task handle(UpdateTaskRequest request) {
        Long userId = authenticationFacade.getUserDetails().getUserId();
        TaskUpdateDto updateDto = request.getTaskUpdateDto();
        Long taskId = request.getTaskId();

        Task taskFromDb = taskRepository
                .findById(taskId)
                .orElseThrow(() -> new NotFoundException("Не найдена задача: " + taskId));

        taskFromDb.setUpdatedBy(userId);
        taskFromDb.setLastModified(LocalDateTime.now());

        if (nonNull(updateDto.getDescription())) {
            taskFromDb.setDescription(updateDto.getDescription());
        }
        if (nonNull(updateDto.getDueDate())) {
            taskFromDb.setDueDate(updateDto.getDueDate());
        }
        if (nonNull(updateDto.getAssignedTo())) {
            taskFromDb.setAssignedTo(updateDto.getAssignedTo());
        }
        if (nonNull(updateDto.getOwnerId())) {
            taskFromDb.setOwnerId(updateDto.getOwnerId());
        }
        if (nonNull(updateDto.getType())) {
            taskFromDb.setType(TaskType.valueOf(updateDto.getType()));
        }

        Task updatedTask = taskRepository.save(taskFromDb);

        request.setTask(updatedTask);

        taskLogService.create(new TaskLogDto("Изменение задачи", updatedTask.getId()), updatedTask);

        return updatedTask;
    }
}
