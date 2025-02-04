package ru.mycrg.data_service.service.cqrs.table_records.requests;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import java.util.List;

import static ru.mycrg.data_service.dto.ResourceType.FEATURE;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

public class CopyTableRecordsRequest implements IRequest<Voidy>, Auditable {

    private final SchemaDto schemaSource;
    private final SchemaDto schemaTarget;
    private final ResourceQualifier sourceQualifier;
    private final ResourceQualifier targetQualifier;
    private final List<Long> featureIds;

    public CopyTableRecordsRequest(SchemaDto schemaSource, SchemaDto schemaTarget, ResourceQualifier sourceQualifier,
                                   ResourceQualifier targetQualifier, List<Long> featureIds) {
        this.schemaSource = schemaSource;
        this.schemaTarget = schemaTarget;
        this.sourceQualifier = sourceQualifier;
        this.targetQualifier = targetQualifier;
        this.featureIds = featureIds;
    }

    @Override
    public String getType() {
        return CopyTableRecordsRequest.class.getSimpleName();
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent("COPYING",
                                 targetQualifier.getTable(),
                                 FEATURE.name(),
                                 mapper.convertValue(featureIds, JsonNode.class));
    }

    public SchemaDto getSchemaSource() {
        return schemaSource;
    }

    public SchemaDto getSchemaTarget() {
        return schemaTarget;
    }

    public ResourceQualifier getSourceQualifier() {
        return sourceQualifier;
    }

    public ResourceQualifier getTargetQualifier() {
        return targetQualifier;
    }

    public List<Long> getFeatureIds() {
        return featureIds;
    }
}
