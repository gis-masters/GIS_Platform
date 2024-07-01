package ru.mycrg.data_service.service.cqrs.srs.requests;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.common_contracts.generated.SpatialReferenceSystem;
import ru.mycrg.mediator.IRequest;

import static ru.mycrg.data_service.dto.ResourceType.TABLE;
import static ru.mycrg.data_service.service.srs.SpatialReferenceSystemService.spatialTableQualifier;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

public class AddCustomSrsRequest implements IRequest<SpatialReferenceSystem>, Auditable {

    private final SpatialReferenceSystem srs;

    public AddCustomSrsRequest(SpatialReferenceSystem srs) {
        this.srs = srs;
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(mapper.convertValue(srs, JsonNode.class),
                                 "CREATE",
                                 spatialTableQualifier.getTable(),
                                 TABLE.name(),
                                 -1L);
    }

    @Override
    public String getType() {
        return AddCustomSrsRequest.class.getSimpleName();
    }

    public SpatialReferenceSystem getSrs() {
        return srs;
    }
}
