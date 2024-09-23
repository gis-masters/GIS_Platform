package ru.mycrg.data_service.service.cqrs.tasks.requests;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.dto.ResourceType.TASK;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

public class UpdateTaskRequest implements IRequest<Voidy>, Auditable {

    private final Long taskId;
    private final IRecord newTask;

    public UpdateTaskRequest(Long taskId, IRecord newTask) {
        this.taskId = taskId;
        this.newTask = newTask;
    }

    @Override
    public String getType() {
        return UpdateTaskRequest.class.getSimpleName();
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(mapper.convertValue(newTask, JsonNode.class),
                                 "UPDATE",
                                 newTask.getTitle() == null ? "unknown" : newTask.getTitle(),
                                 TASK.name(),
                                 newTask.getId());
    }

    public IRecord getNewTask() {
        return newTask;
    }

    public Long getTaskId() {
        return taskId;
    }
}
