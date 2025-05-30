package ru.mycrg.data_service.service.cqrs.library_records.requests;

import com.fasterxml.jackson.databind.JsonNode;
import org.jetbrains.annotations.NotNull;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.common_contracts.generated.ecp.VerifyEcpResponse;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.dto.record.ResponseWithReport;
import ru.mycrg.data_service.service.cqrs.files.IUpdateFilesRelation;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequest;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static ru.mycrg.data_service.dto.ResourceType.LIBRARY_RECORD;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

public class UpdateLibraryRecordRequest implements IRequest<ResponseWithReport>, Auditable, IUpdateFilesRelation {

    private final ResourceQualifier rQualifier;
    private final IRecord newRecord;
    private final SchemaDto schema;
    private final ResponseWithReport responseWithReport = new ResponseWithReport();

    private IRecord oldRecord;

    public UpdateLibraryRecordRequest(SchemaDto schema,
                                      ResourceQualifier rQualifier,
                                      IRecord newRecord) {
        this.schema = schema;
        this.rQualifier = rQualifier;
        this.newRecord = newRecord;
    }

    @Override
    public String getType() {
        return UpdateLibraryRecordRequest.class.getSimpleName();
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
        return new CrgAuditEvent(mapper.convertValue(newRecord, JsonNode.class),
                                 "UPDATE",
                                 rQualifier.getTable() == null ? "unknown" : rQualifier.getTable(),
                                 LIBRARY_RECORD.name(),
                                 rQualifier.getRecordIdAsLong());
    }

    @Override
    public IRecord getNewRecord() {
        return newRecord;
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
        return this.responseWithReport;
    }

    @Override
    public void addEcpReport(Map<UUID, List<VerifyEcpResponse>> ecpReport) {
        this.responseWithReport.setEcpReport(ecpReport);
    }
}
