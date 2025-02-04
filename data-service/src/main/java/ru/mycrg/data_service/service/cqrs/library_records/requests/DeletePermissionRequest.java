package ru.mycrg.data_service.service.cqrs.library_records.requests;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.dto.ResourceType.PERMISSION;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

public class DeletePermissionRequest implements IRequest<Voidy>, Auditable {

    private ResourceQualifier rQualifier;
    private Long permissionId;

    public DeletePermissionRequest(ResourceQualifier rQualifier, Long permissionId) {
        this.rQualifier = rQualifier;
        this.permissionId = permissionId;
    }

    @Override
    public String getType() {
        return "DeleteLibraryRecordPermissionRequest";
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(mapper.convertValue(rQualifier, JsonNode.class),
                                 "DELETE",
                                 "acl_permissions",
                                 PERMISSION.name(),
                                 permissionId);
    }

    public ResourceQualifier getrQualifier() {
        return rQualifier;
    }

    public void setrQualifier(ResourceQualifier rQualifier) {
        this.rQualifier = rQualifier;
    }

    public Long getPermissionId() {
        return permissionId;
    }
}
