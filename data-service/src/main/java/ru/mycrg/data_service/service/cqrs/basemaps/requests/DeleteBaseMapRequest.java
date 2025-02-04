package ru.mycrg.data_service.service.cqrs.basemaps.requests;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.dto.ResourceType.BASEMAP;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

public class DeleteBaseMapRequest implements IRequest<Voidy>, Auditable {

    private final Long id;

    public DeleteBaseMapRequest(Long id) {
        this.id = id;
    }

    @Override
    public String getType() {
        return DeleteBaseMapRequest.class.getSimpleName();
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(BASEMAP.name(),
                                 "DELETE",
                                 BASEMAP.name(),
                                 mapper.convertValue(id, JsonNode.class));
    }

    public Long getId() {
        return id;
    }
}
