package ru.mycrg.data_service.service.cqrs.tasks.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dto.TaskLogDto;
import ru.mycrg.data_service.entity.Task;
import ru.mycrg.data_service.repository.TaskRepository;
import ru.mycrg.data_service.service.TaskLogService;
import ru.mycrg.data_service.service.cqrs.tasks.requests.CreateTaskRequest;
import ru.mycrg.data_service_contract.dto.TaskCreateDto;
import ru.mycrg.data_service_contract.enums.TaskStatus;
import ru.mycrg.data_service_contract.enums.TaskType;
import ru.mycrg.mediator.IRequestHandler;

@Component
public class CreateTaskRequestHandler implements IRequestHandler<CreateTaskRequest, Task> {

    private final TaskRepository taskRepository;
    private final TaskLogService taskLogService;
    private final IAuthenticationFacade authenticationFacade;

    public CreateTaskRequestHandler(TaskRepository taskRepository,
                                    TaskLogService taskLogService,
                                    IAuthenticationFacade authenticationFacade) {
        this.taskRepository = taskRepository;
        this.taskLogService = taskLogService;
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public Task handle(CreateTaskRequest request) {
        Long userId = authenticationFacade.getUserDetails().getUserId();
        TaskCreateDto taskCreateDto = request.getTaskCreateDto();

        Task task = new Task();
        task.setAssignedTo(taskCreateDto.getAssignedTo());
        task.setCreatedBy(userId);
        task.setStatus(TaskStatus.CREATED);
        task.setDueDate(taskCreateDto.getDueDate());
        task.setOwnerId(taskCreateDto.getOwnerId());
        task.setType(TaskType.valueOf(taskCreateDto.getType()));
        task.setDescription(taskCreateDto.getDescription());

        task = taskRepository.save(task);

        request.setTask(task);

        taskLogService.create(new TaskLogDto("Создание новой задачи", task.getId()), taskCreateDto);

        return task;
    }
}
