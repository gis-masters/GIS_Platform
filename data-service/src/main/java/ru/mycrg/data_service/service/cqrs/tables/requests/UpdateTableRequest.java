package ru.mycrg.data_service.service.cqrs.tables.requests;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.dto.TableUpdateDto;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.dto.ResourceType.TABLE;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

public class UpdateTableRequest implements IRequest<Voidy>, Auditable {

    private ResourceQualifier qualifier;
    private TableUpdateDto dto;
    private SchemasAndTables tableModel;

    public UpdateTableRequest(ResourceQualifier qualifier, TableUpdateDto dto) {
        this.qualifier = qualifier;
        this.dto = dto;
    }

    @Override
    public String getType() {
        return UpdateTableRequest.class.getSimpleName();
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(mapper.convertValue(tableModel, JsonNode.class),
                                 "UPDATE",
                                 tableModel.getIdentifier(),
                                 TABLE.name(),
                                 tableModel.getId());
    }

    public ResourceQualifier getQualifier() {
        return qualifier;
    }

    public void setQualifier(ResourceQualifier qualifier) {
        this.qualifier = qualifier;
    }

    public TableUpdateDto getDto() {
        return dto;
    }

    public void setDto(TableUpdateDto dto) {
        this.dto = dto;
    }

    public void setTableModel(SchemasAndTables tableModel) {
        this.tableModel = tableModel;
    }
}
