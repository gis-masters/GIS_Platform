package ru.mycrg.data_service.service.cqrs.tasks.requests;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.entity.Task;
import ru.mycrg.data_service_contract.dto.TaskCreateDto;
import ru.mycrg.mediator.IRequest;

import static ru.mycrg.data_service.dto.ResourceType.TASK;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

public class CreateTaskRequest implements IRequest<Task>, Auditable {

    private Task task;
    private final TaskCreateDto taskCreateDto;

    public CreateTaskRequest(TaskCreateDto taskCreateDto) {
        this.taskCreateDto = taskCreateDto;
    }

    @Override
    public String getType() {
        return "CreateTaskRequest";
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(mapper.convertValue(taskCreateDto, JsonNode.class),
                "CREATE",
                task.getDescription() == null ? "unknown" : task.getDescription(),
                TASK.name(),
                task.getId());
    }

    public TaskCreateDto getTaskCreateDto() {
        return taskCreateDto;
    }

    public void setTask(Task task) {
        this.task = task;
    }
}
