package ru.mycrg.data_service.service.cqrs.records.requests;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.RecordEntity;
import ru.mycrg.data_service.service.cqrs.files.IFilesRelation;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequest;

import static ru.mycrg.data_service.service.JsonConverter.mapper;

public class CreateLibraryRecordRequest implements IRequest<IRecord>, Auditable, IFilesRelation {

    private final ResourceQualifier rQualifier;
    private final RecordEntity record;
    private final MultipartFile file;
    private final String accessToken;
    private final SchemaDto schema;

    public CreateLibraryRecordRequest(SchemaDto schemaDto,
                                      ResourceQualifier rQualifier,
                                      RecordEntity record,
                                      MultipartFile file,
                                      String accessToken) {
        this.schema = schemaDto;
        this.rQualifier = rQualifier;
        this.record = record;
        this.file = file;
        this.accessToken = accessToken;
    }

    @Override
    public String getType() {
        return "CreateLibraryRecordRequest";
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(accessToken,
                                 "CREATE",
                                 record.getTitle() == null ? "unknown" : record.getTitle(),
                                 "LIBRARY_RECORD",
                                 record.getId() == null ? -1 : record.getId(),
                                 mapper.convertValue(record, JsonNode.class));
    }

    @Override
    public SchemaDto getSchema() {
        return this.schema;
    }

    @Override
    public ResourceQualifier getQualifier() {
        return rQualifier;
    }

    public ResourceQualifier getRecordQualifier() {
        return rQualifier;
    }

    public RecordEntity getRecord() {
        return record;
    }

    public MultipartFile getFile() {
        return file;
    }
}
