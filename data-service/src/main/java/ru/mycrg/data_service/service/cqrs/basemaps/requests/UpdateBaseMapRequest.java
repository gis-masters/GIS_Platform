package ru.mycrg.data_service.service.cqrs.basemaps.requests;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.dto.BaseMapUpdateDto;
import ru.mycrg.data_service.entity.BaseMap;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.dto.ResourceType.BASEMAP;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

public class UpdateBaseMapRequest implements IRequest<Voidy>, Auditable {

    private final Long id;
    private final BaseMapUpdateDto baseMapUpdate;
    private BaseMap baseMapModel;

    public UpdateBaseMapRequest(Long id, BaseMapUpdateDto baseMapUpdate) {
        this.id = id;
        this.baseMapUpdate = baseMapUpdate;
    }

    @Override
    public String getType() {
        return UpdateBaseMapRequest.class.getSimpleName();
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(mapper.convertValue(baseMapModel, JsonNode.class),
                                 "UPDATE",
                                 baseMapModel.getTitle(),
                                 BASEMAP.name(),
                                 baseMapModel.getId());
    }

    public Long getId() {
        return id;
    }

    public BaseMapUpdateDto getBaseMapUpdate() {
        return baseMapUpdate;
    }

    public void setBaseMapModel(BaseMap baseMapModel) {
        this.baseMapModel = baseMapModel;
    }
}
