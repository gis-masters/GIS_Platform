package ru.mycrg.data_service.service.cqrs.basemaps.requests;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.dto.BaseMapCreateDto;
import ru.mycrg.data_service.entity.BaseMap;
import ru.mycrg.mediator.IRequest;

import static ru.mycrg.data_service.dto.ResourceType.TABLE;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

public class CreateBaseMapRequest implements IRequest<BaseMap>, Auditable {

    private final BaseMapCreateDto baseMapCreateDto;
    private BaseMap entity;

    public CreateBaseMapRequest(BaseMapCreateDto baseMapCreateDto) {
        this.baseMapCreateDto = baseMapCreateDto;
    }

    @Override
    public String getType() {
        return CreateBaseMapRequest.class.getSimpleName();
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(mapper.convertValue(baseMapCreateDto, JsonNode.class),
                                 "CREATE",
                                 String.valueOf(entity.getId()),
                                 TABLE.name(),
                                 entity.getId());
    }

    public BaseMapCreateDto getBaseMapCreateDto() {
        return baseMapCreateDto;
    }

    public void setEntity(BaseMap entity) {
        this.entity = entity;
    }
}
