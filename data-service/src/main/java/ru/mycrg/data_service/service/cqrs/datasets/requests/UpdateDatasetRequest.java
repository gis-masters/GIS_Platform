package ru.mycrg.data_service.service.cqrs.datasets.requests;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.dto.ResourceUpdateDto;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.dto.ResourceType.DATASET;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

public class UpdateDatasetRequest implements IRequest<Voidy>, Auditable {

    private final ResourceQualifier dQualifier;
    private final ResourceUpdateDto dto;
    private SchemasAndTables datasetModel;

    public UpdateDatasetRequest(ResourceQualifier tQualifier, ResourceUpdateDto dto) {
        this.dQualifier = tQualifier;
        this.dto = dto;
    }

    @Override
    public String getType() {
        return UpdateDatasetRequest.class.getSimpleName();
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(mapper.convertValue(datasetModel, JsonNode.class),
                                 "UPDATE",
                                 datasetModel.getIdentifier(),
                                 DATASET.name(),
                                 datasetModel.getId());
    }

    public ResourceQualifier getdQualifier() {
        return dQualifier;
    }

    public ResourceUpdateDto getDto() {
        return dto;
    }

    public SchemasAndTables getDatasetModel() {
        return datasetModel;
    }

    public void setDatasetModel(SchemasAndTables datasetModel) {
        this.datasetModel = datasetModel;
    }
}
