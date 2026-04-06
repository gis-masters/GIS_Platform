package ru.mycrg.data_service.service.cqrs.tasks.requests;

import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service_contract.enums.TaskStatus;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.dto.ResourceType.TASK;
import static ru.mycrg.http_client.JsonConverter.toJsonNode;

public class UpdateTaskStatusRequest implements IRequest<Voidy>, Auditable {

    private final Long taskId;
    private final TaskStatus taskStatus;

    public UpdateTaskStatusRequest(TaskStatus taskStatus, Long taskId) {
        this.taskStatus = taskStatus;
        this.taskId = taskId;
    }

    @Override
    public String getType() {
        return UpdateTaskStatusRequest.class.getSimpleName();
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent("UPDATE",
                                 taskId.toString(),
                                 TASK.name(),
                                 toJsonNode(taskId));
    }

    public TaskStatus getTaskStatus() {
        return taskStatus;
    }

    public Long getTaskId() {
        return taskId;
    }
}
