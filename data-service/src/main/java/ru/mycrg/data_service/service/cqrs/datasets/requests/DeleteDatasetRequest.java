package ru.mycrg.data_service.service.cqrs.datasets.requests;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.dto.ResourceType.DATASET;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

public class DeleteDatasetRequest implements IRequest<Voidy>, Auditable {

    private final ResourceQualifier datasetQualifier;

    public DeleteDatasetRequest(ResourceQualifier datasetQualifier) {
        this.datasetQualifier = datasetQualifier;
    }

    @Override
    public String getType() {
        return DeleteDatasetRequest.class.getSimpleName();
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(mapper.convertValue(datasetQualifier, JsonNode.class),
                                 "DELETE",
                                 datasetQualifier.getQualifier(),
                                 DATASET.name(),
                                 datasetQualifier.getRecordIdAsLong());
    }

    public ResourceQualifier getDatasetQualifier() {
        return datasetQualifier;
    }
}
