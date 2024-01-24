package ru.mycrg.data_service.service.cqrs.table_records.requests;

import com.fasterxml.jackson.databind.JsonNode;
import org.jetbrains.annotations.NotNull;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.RecordEntity;
import ru.mycrg.data_service.service.cqrs.files.ICreateFilesRelation;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;
import ru.mycrg.mediator.IRequest;

import java.util.HashMap;
import java.util.Map;

import static ru.mycrg.data_service.dto.ResourceType.FEATURE;
import static ru.mycrg.data_service.util.JsonConverter.mapper;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.ID;

public class CreateTableRecordRequest implements IRequest<Feature>, Auditable, ICreateFilesRelation {

    private final SchemaDto schema;

    private Feature feature;
    private ResourceQualifier rQualifier;
    private final boolean strictMode;

    public CreateTableRecordRequest(SchemaDto schemaDto,
                                    ResourceQualifier rQualifier,
                                    Feature feature,
                                    boolean strictMode) {
        this.schema = schemaDto;
        this.rQualifier = rQualifier;
        this.feature = feature;
        this.strictMode = strictMode;
    }

    @Override
    public String getType() {
        return "CreateTableRecordRequest";
    }

    @Override
    public CrgAuditEvent getEvent() {
        String entityName = "unknown";
        if (rQualifier.getTable() != null) {
            entityName = rQualifier.getTable();
        }

        return new CrgAuditEvent(mapper.convertValue(feature, JsonNode.class),
                                 "CREATE",
                                 entityName,
                                 FEATURE.name(),
                                 feature.getId() != null ? feature.getId() : 1L);
    }

    @Override
    public @NotNull SchemaDto getSchema() {
        return this.schema;
    }

    @Override
    public @NotNull ResourceQualifier getQualifier() {
        return rQualifier;
    }

    @Override
    public IRecord getRecord() {
        Map<String, Object> properties = feature.getProperties();
        if (feature.getId() != null) {
            properties.put(ID.getName(), feature.getId());
        }

        return new RecordEntity((properties != null) ? properties : new HashMap<>());
    }

    @Override
    public Feature getFeature() {
        return feature;
    }

    public void setFeature(Feature feature) {
        this.feature = feature;

        rQualifier = new ResourceQualifier(rQualifier, feature.getId(), FEATURE);
    }

    public boolean isStrictMode() {
        return strictMode;
    }
}
