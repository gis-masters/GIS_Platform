package ru.mycrg.data_service.service.cqrs.library_records.requests;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.dto.PermissionCreateDto;
import ru.mycrg.data_service.dto.PermissionProjection;
import ru.mycrg.data_service.entity.Permission;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.mediator.IRequest;

import static ru.mycrg.data_service.dto.ResourceType.PERMISSION;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

public class CreatePermissionRequest implements IRequest<PermissionProjection>, Auditable {

    private ResourceQualifier rQualifier;
    private Long resourceId;
    private PermissionCreateDto dto;
    private Permission newPermission;

    public CreatePermissionRequest(ResourceQualifier rQualifier,
                                   Long resourceId,
                                   PermissionCreateDto dto) {
        this.rQualifier = rQualifier;
        this.resourceId = resourceId;
        this.dto = dto;
    }

    @Override
    public String getType() {
        return "CreateLibraryRecordPermissionRequest";
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(mapper.convertValue(dto, JsonNode.class),
                                 "CREATE",
                                 "acl_permissions",
                                 PERMISSION.name(),
                                 newPermission.getId());
    }

    public ResourceQualifier getrQualifier() {
        return rQualifier;
    }

    public void setrQualifier(ResourceQualifier rQualifier) {
        this.rQualifier = rQualifier;
    }

    public Long getResourceId() {
        return resourceId;
    }

    public PermissionCreateDto getDto() {
        return dto;
    }

    public void setDto(PermissionCreateDto dto) {
        this.dto = dto;
    }

    public void setNewPermission(Permission newPermission) {
        this.newPermission = newPermission;
    }
}
