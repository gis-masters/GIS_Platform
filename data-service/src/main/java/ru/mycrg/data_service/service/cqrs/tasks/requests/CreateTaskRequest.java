package ru.mycrg.data_service.service.cqrs.tasks.requests;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.common_contracts.generated.ecp.VerifyEcpResponse;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.dto.record.RecordEntity;
import ru.mycrg.data_service.dto.record.ResponseWithReport;
import ru.mycrg.data_service.service.cqrs.files.ICreateFilesRelation;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;
import ru.mycrg.mediator.IRequest;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static ru.mycrg.data_service.dto.ResourceType.TASK;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

public class CreateTaskRequest implements IRequest<IRecord>, Auditable, ICreateFilesRelation {

    private final SchemaDto schema;
    private final RecordEntity record;
    private final ResourceQualifier qualifier;

    private Long id;

    public CreateTaskRequest(SchemaDto schema, ResourceQualifier qualifier, RecordEntity record) {
        this.schema = schema;
        this.record = record;
        this.qualifier = qualifier;
    }

    @Override
    public String getType() {
        return CreateTaskRequest.class.getSimpleName();
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(mapper.convertValue(record, JsonNode.class),
                                 "CREATE",
                                 qualifier.getTable() == null ? "unknown" : qualifier.getTable(),
                                 TASK.name(),
                                 record.getId() == null ? -1 : record.getId());
    }

    @Override
    public SchemaDto getSchema() {
        return schema;
    }

    @Override
    public RecordEntity getRecord() {
        return record;
    }

    @Override
    public Feature getFeature() {
        return null;
    }

    @Override
    public ResponseWithReport getResponseWithReport() {
        return null;
    }

    @Override
    public void addEcpReport(Map<UUID, List<VerifyEcpResponse>> ecpReport) {

    }

    @Override
    public ResourceQualifier getQualifier() {
        return qualifier;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
