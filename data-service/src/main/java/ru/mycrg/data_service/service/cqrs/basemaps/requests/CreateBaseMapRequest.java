package ru.mycrg.data_service.service.cqrs.basemaps.requests;

import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.common_contracts.generated.data_service.BaseMapRequestModel;
import ru.mycrg.data_service.entity.BaseMap;
import ru.mycrg.mediator.IRequest;

import static ru.mycrg.data_service.dto.ResourceType.TABLE;
import static ru.mycrg.http_client.JsonConverter.toJsonNode;

public class CreateBaseMapRequest implements IRequest<BaseMap>, Auditable {

    private final BaseMapRequestModel baseMapCreateDto;
    private BaseMap entity;

    public CreateBaseMapRequest(BaseMapRequestModel baseMapCreateDto) {
        this.baseMapCreateDto = baseMapCreateDto;
    }

    @Override
    public String getType() {
        return CreateBaseMapRequest.class.getSimpleName();
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(toJsonNode(baseMapCreateDto),
                                 "CREATE",
                                 String.valueOf(entity.getId()),
                                 TABLE.name(),
                                 entity.getId());
    }

    public BaseMapRequestModel getBaseMapCreateDto() {
        return baseMapCreateDto;
    }

    public void setEntity(BaseMap entity) {
        this.entity = entity;
    }
}
