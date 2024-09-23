package ru.mycrg.data_service.service.cqrs.table_records.requests;

import com.fasterxml.jackson.databind.JsonNode;
import org.jetbrains.annotations.NotNull;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.dto.record.RecordEntity;
import ru.mycrg.data_service.service.cqrs.files.IDeleteFilesRelation;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.dto.ResourceType.FEATURE;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

public class DeleteTableRecordRequest implements IRequest<Voidy>, Auditable, IDeleteFilesRelation {

    private final ResourceQualifier rQualifier;
    private final SchemaDto schema;
    private final Feature feature;

    public DeleteTableRecordRequest(ResourceQualifier rQualifier,
                                    Feature feature,
                                    SchemaDto schema) {
        this.rQualifier = rQualifier;
        this.feature = feature;
        this.schema = schema;
    }

    @Override
    public String getType() {
        return DeleteTableRecordRequest.class.getSimpleName();
    }

    @Override
    public CrgAuditEvent getEvent() {
        String entityName = "unknown";
        if (rQualifier.getTable() != null) {
            entityName = rQualifier.getTable();
        }

        return new CrgAuditEvent(mapper.convertValue(feature.getId(), JsonNode.class),
                                 "DELETE",
                                 entityName,
                                 FEATURE.name(),
                                 feature.getId());
    }

    @Override
    public @NotNull SchemaDto getSchema() {
        return schema;
    }

    @Override
    public IRecord getRecord() {
        return new RecordEntity(feature.getProperties());
    }

    @Override
    public ResourceQualifier getQualifier() {
        return rQualifier;
    }

    public Feature getFeature() {
        return feature;
    }
}
