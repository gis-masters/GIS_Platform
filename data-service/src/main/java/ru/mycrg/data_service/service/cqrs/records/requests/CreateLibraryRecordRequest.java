package ru.mycrg.data_service.service.cqrs.records.requests;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.RecordEntity;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.mediator.IRequest;

import static ru.mycrg.data_service.service.JsonConverter.mapper;

public class CreateLibraryRecordRequest implements IRequest<IRecord>, Auditable {

    private final ResourceQualifier rQualifier;
    private final RecordEntity record;
    private final MultipartFile file;
    private final String accessToken;

    public CreateLibraryRecordRequest(ResourceQualifier rQualifier,
                                      RecordEntity record,
                                      MultipartFile file,
                                      String accessToken) {
        this.rQualifier = rQualifier;
        this.record = record;
        this.file = file;
        this.accessToken = accessToken;
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
