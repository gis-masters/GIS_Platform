package ru.mycrg.data_service.service.cqrs.srs.requests;

import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.dto.ResourceType.TABLE;
import static ru.mycrg.data_service.service.srs.SpatialReferenceSystemService.spatialTableQualifier;

public class DeleteCustomSrsRequest implements IRequest<Voidy>, Auditable {

    private final int authSrid;
    private boolean isNeedToReloadGeoserver = true;

    public DeleteCustomSrsRequest(int authSrid) {
        this.authSrid = authSrid;
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent("PROJECTION",
                                 "DELETE",
                                 spatialTableQualifier.getTable(),
                                 TABLE.name(),
                                 -1L);
    }

    @Override
    public String getType() {
        return DeleteCustomSrsRequest.class.getSimpleName();
    }

    public int getAuthSrid() {
        return authSrid;
    }

    public boolean getIsNeedToReloadGeoserver() {
        return isNeedToReloadGeoserver;
    }

    public void setIsNeedToReloadGeoserver(boolean isNeedToReloadGeoserver) {
        this.isNeedToReloadGeoserver = isNeedToReloadGeoserver;
    }
}
