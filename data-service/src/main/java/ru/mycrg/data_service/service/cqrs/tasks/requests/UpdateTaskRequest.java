package ru.mycrg.data_service.service.cqrs.tasks.requests;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.entity.Task;
import ru.mycrg.data_service_contract.dto.TaskUpdateDto;
import ru.mycrg.mediator.IRequest;

import static ru.mycrg.data_service.dto.ResourceType.TASK;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

public class UpdateTaskRequest implements IRequest<Task>, Auditable {

    private final TaskUpdateDto taskUpdateDto;
    private final Long taskId;
    private Task task;

    public UpdateTaskRequest(TaskUpdateDto taskUpdateDto, Long taskId) {
        this.taskUpdateDto = taskUpdateDto;
        this.taskId = taskId;
    }

    @Override
    public String getType() {
        return "UpdateTaskRequest";
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(mapper.convertValue(taskUpdateDto, JsonNode.class),
                "UPDATE",
                task.getDescription() == null ? "unknown" : task.getDescription(),
                TASK.name(),
                task.getId());
    }

    public TaskUpdateDto getTaskUpdateDto() {
        return taskUpdateDto;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTask(Task task) {
        this.task = task;
    }
}
