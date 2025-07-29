package ru.mycrg.data_service.service.cqrs.srs.requests;

import org.jetbrains.annotations.NotNull;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.common_contracts.generated.SpatialReferenceSystem;
import ru.mycrg.mediator.IRequest;

import static ru.mycrg.data_service.dto.ResourceType.TABLE;
import static ru.mycrg.data_service.service.srs.SpatialReferenceSystemService.spatialTableQualifier;

public class UpdateCustomSrsRequest implements IRequest<SpatialReferenceSystem>, Auditable {

    private final Integer authSrid;
    private final SpatialReferenceSystem srs;

    public UpdateCustomSrsRequest(@NotNull Integer authSrid, SpatialReferenceSystem srs) {
        this.authSrid = authSrid;
        this.srs = srs;
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent("PROJECTION",
                                 "UPDATE",
                                 spatialTableQualifier.getTable(),
                                 TABLE.name(),
                                 -1L);
    }

    @Override
    public String getType() {
        return UpdateCustomSrsRequest.class.getSimpleName();
    }

    public Integer getAuthSrid() {
        return authSrid;
    }

    public SpatialReferenceSystem getSrs() {
        return srs;
    }
}
