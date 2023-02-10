package ru.mycrg.data_service.service.cqrs.table_records.requests;

import com.fasterxml.jackson.databind.JsonNode;
import org.jetbrains.annotations.NotNull;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.RecordEntity;
import ru.mycrg.data_service.service.cqrs.files.IUpdateFilesRelation;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.dto.ResourceType.FEATURE;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

public class UpdateTableRecordRequest implements IRequest<Voidy>, Auditable, IUpdateFilesRelation {

    private final ResourceQualifier rQualifier;
    private final Feature newFeature;
    private final SchemaDto schema;

    private Feature oldFeature = new Feature();

    public UpdateTableRecordRequest(SchemaDto schema,
                                    ResourceQualifier rQualifier,
                                    Feature newFeature) {
        this.schema = schema;
        this.rQualifier = rQualifier;
        this.newFeature = newFeature;
    }

    @Override
    public String getType() {
        return "UpdateTableRecordRequest";
    }

    @Override
    public @NotNull SchemaDto getSchema() {
        return schema;
    }

    @Override
    public @NotNull ResourceQualifier getQualifier() {
        return rQualifier;
    }

    @Override
    public CrgAuditEvent getEvent() {
        String entityName = "unknown";
        if (rQualifier.getTable() != null) {
            entityName = rQualifier.getTable();
        }

        return new CrgAuditEvent(mapper.convertValue(newFeature, JsonNode.class),
                                 "UPDATE",
                                 entityName,
                                 FEATURE.name(),
                                 rQualifier.getRecordIdAsLong());
    }

    @Override
    public IRecord getNewRecord() {
        return new RecordEntity(newFeature.getProperties());
    }

    @Override
    public IRecord getOldRecord() {
        return new RecordEntity(oldFeature.getProperties());
    }

    @Override
    public void setOldRecord(IRecord oldRecord) {
        this.oldFeature.setProperties(oldRecord.getContent());
    }

    public Feature getNewFeature() {
        return newFeature;
    }

    public Feature getOldFeature() {
        return oldFeature;
    }

    public void setOldFeature(Feature oldFeature) {
        this.oldFeature = oldFeature;
    }
}
