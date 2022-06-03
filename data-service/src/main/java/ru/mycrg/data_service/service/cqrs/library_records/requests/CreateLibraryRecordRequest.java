package ru.mycrg.data_service.service.cqrs.library_records.requests;

import com.fasterxml.jackson.databind.JsonNode;
import org.jetbrains.annotations.NotNull;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.RecordEntity;
import ru.mycrg.data_service.service.cqrs.files.ICreateFilesRelation;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;
import ru.mycrg.mediator.IRequest;

import static ru.mycrg.data_service.dto.ResourceType.LIBRARY_RECORD;
import static ru.mycrg.data_service.service.JsonConverter.mapper;

public class CreateLibraryRecordRequest implements IRequest<IRecord>, Auditable, ICreateFilesRelation {

    private final ResourceQualifier rQualifier;
    private final RecordEntity record;
    private final MultipartFile file;
    private final SchemaDto schema;

    public CreateLibraryRecordRequest(SchemaDto schemaDto,
                                      ResourceQualifier rQualifier,
                                      RecordEntity record,
                                      MultipartFile file) {
        this.schema = schemaDto;
        this.rQualifier = rQualifier;
        this.record = record;
        this.file = file;
    }

    @Override
    public String getType() {
        return "CreateLibraryRecordRequest";
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(mapper.convertValue(record, JsonNode.class),
                                 "CREATE",
                                 rQualifier.getTable() == null ? "unknown" : rQualifier.getTable(),
                                 LIBRARY_RECORD.name(),
                                 record.getId() == null ? -1 : record.getId());
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
        return record;
    }

    @Override
    public Feature getFeature() {
        return null;
    }

    public MultipartFile getFile() {
        return file;
    }
}
