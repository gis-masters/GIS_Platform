package ru.mycrg.data_service.service.cqrs.tasks.requests;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.common_contracts.generated.ecp.VerifyEcpResponse;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.dto.record.ResponseWithReport;
import ru.mycrg.data_service.service.cqrs.files.IUpdateFilesRelation;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static ru.mycrg.data_service.dto.ResourceType.TASK;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

public class UpdateTaskRequest implements IRequest<Voidy>, Auditable, IUpdateFilesRelation {

    private final IRecord newTask;
    private final ResourceQualifier qualifier;
    private final SchemaDto schema;
    private final ResponseWithReport responseWithReport = new ResponseWithReport();

    private IRecord oldRecord;

    public UpdateTaskRequest(IRecord newTask, ResourceQualifier qualifier, SchemaDto schema) {
        this.newTask = newTask;
        this.qualifier = qualifier;
        this.schema = schema;
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

    @Override
    public IRecord getNewRecord() {
        return newTask;
    }

    @Override
    public IRecord getOldRecord() {
        return oldRecord;
    }

    @Override
    public void setOldRecord(IRecord oldRecord) {
        this.oldRecord = oldRecord;
    }

    @Override
    public ResponseWithReport getResponseWithReport() {
        return responseWithReport;
    }

    @Override
    public void addEcpReport(Map<UUID, List<VerifyEcpResponse>> ecpReport) {
        this.responseWithReport.setEcpReport(ecpReport);
    }

    @Override
    public ResourceQualifier getQualifier() {
        return qualifier;
    }

    @Override
    public SchemaDto getSchema() {
        return schema;
    }
}
