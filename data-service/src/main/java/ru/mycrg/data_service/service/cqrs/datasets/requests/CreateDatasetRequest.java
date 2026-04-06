package ru.mycrg.data_service.service.cqrs.datasets.requests;

import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.dto.DatasetModel;
import ru.mycrg.data_service.dto.ResourceCreateDto;
import ru.mycrg.mediator.IRequest;

import static ru.mycrg.data_service.dto.ResourceType.DATASET;
import static ru.mycrg.http_client.JsonConverter.toJsonNode;

public class CreateDatasetRequest implements IRequest<DatasetModel>, Auditable {

    private ResourceCreateDto datasetDto;
    private DatasetModel datasetModel;

    public CreateDatasetRequest(ResourceCreateDto resourceCreateDto) {
        this.datasetDto = resourceCreateDto;
    }

    @Override
    public String getType() {
        return CreateDatasetRequest.class.getSimpleName();
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(toJsonNode(datasetDto),
                                 "CREATE",
                                 datasetModel.getIdentifier() == null ? "unknown" : datasetModel.getIdentifier(),
                                 DATASET.name(),
                                 datasetModel.getId() == null ? -1 : datasetModel.getId());
    }

    public ResourceCreateDto getDatasetDto() {
        return datasetDto;
    }

    public void setDatasetModel(DatasetModel datasetModel) {
        this.datasetModel = datasetModel;
    }
}
