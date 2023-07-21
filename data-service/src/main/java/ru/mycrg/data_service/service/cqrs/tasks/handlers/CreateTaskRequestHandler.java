package ru.mycrg.data_service.service.cqrs.tasks.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.auth_facade.UserDetails;
import ru.mycrg.data_service.dto.TaskLogDto;
import ru.mycrg.data_service.entity.Task;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.repository.TaskRepository;
import ru.mycrg.data_service.service.TaskLogService;
import ru.mycrg.data_service.service.cqrs.tasks.requests.CreateTaskRequest;
import ru.mycrg.data_service_contract.dto.TaskCreateDto;
import ru.mycrg.data_service_contract.enums.TaskType;
import ru.mycrg.mediator.IRequestHandler;

import java.util.List;
import java.util.Objects;

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
        TaskCreateDto taskCreateDto = request.getTaskCreateDto();
        Long ownerId = taskCreateDto.getOwnerId();

        UserDetails userDetails = authenticationFacade.getUserDetails();
        List<Long> directMinions = userDetails.getDirectMinions();

        if (!userDetails.getUserId().equals(ownerId) && !directMinions.contains(ownerId)) {
            throw new BadRequestException("Задачу можно назначить только на своего непосредственного подчиненного");
        }

        Task task = new Task(TaskType.valueOf(taskCreateDto.getType()),
                             ownerId,
                             taskCreateDto.getAssignedTo(),
                             taskCreateDto.getDueDate(),
                             taskCreateDto.getDescription(),
                             userDetails.getUserId());

        Task newTask = taskRepository.save(task);

        request.setTask(newTask);

        taskLogService.create(new TaskLogDto("Создание новой задачи", newTask.getId()), newTask);

        return task;
    }
}
