package ru.mycrg.data_service.service.cqrs.table_records.requests;

import com.fasterxml.jackson.databind.JsonNode;
import org.jetbrains.annotations.NotNull;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.common_contracts.generated.ecp.VerifyEcpResponse;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.dto.record.RecordEntity;
import ru.mycrg.data_service.dto.record.ResponseWithReport;
import ru.mycrg.data_service.service.cqrs.files.IUpdateFilesRelation;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static ru.mycrg.data_service.dto.ResourceType.FEATURE;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

public class UpdateTableRecordRequest implements IRequest<Voidy>, Auditable, IUpdateFilesRelation {

    private final ResourceQualifier rQualifier;
    private final Feature newFeature;
    private final SchemaDto schema;
    private final ResponseWithReport responseWithReport = new ResponseWithReport();

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
        return UpdateTableRecordRequest.class.getSimpleName();
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

    @Override
    public ResponseWithReport getResponseWithReport() {
        return this.responseWithReport;
    }

    @Override
    public void addEcpReport(Map<UUID, List<VerifyEcpResponse>> ecpReport) {
        this.responseWithReport.setEcpReport(ecpReport);
    }

    public Feature getNewFeature() {
        return newFeature;
    }

    public void setOldFeature(Feature oldFeature) {
        this.oldFeature = oldFeature;
    }

    public Feature getOldFeature() {
        return oldFeature;
    }
}
