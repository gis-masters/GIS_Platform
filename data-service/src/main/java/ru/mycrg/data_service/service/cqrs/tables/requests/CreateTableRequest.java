package ru.mycrg.data_service.service.cqrs.tables.requests;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.audit_service_contract.Auditable;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.data_service.dto.TableCreateDto;
import ru.mycrg.data_service.dto.TableModel;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.mediator.IRequest;

import static ru.mycrg.data_service.dto.ResourceType.TABLE;
import static ru.mycrg.data_service.util.JsonConverter.mapper;

public class CreateTableRequest implements IRequest<TableModel>, Auditable {

    private SchemasAndTables entity;

    private final ResourceQualifier qualifier;
    private final TableCreateDto tableCreateDto;

    public CreateTableRequest(TableCreateDto tableCreateDto, ResourceQualifier qualifier) {
        this.tableCreateDto = tableCreateDto;
        this.qualifier = qualifier;
    }

    @Override
    public String getType() {
        return CreateTableRequest.class.getSimpleName();
    }

    @Override
    public CrgAuditEvent getEvent() {
        return new CrgAuditEvent(mapper.convertValue(tableCreateDto, JsonNode.class),
                                 "CREATE",
                                 entity.getIdentifier() == null ? "unknown" : entity.getIdentifier(),
                                 TABLE.name(),
                                 entity.getId());
    }

    public TableCreateDto getTableCreateDto() {
        return tableCreateDto;
    }

    public ResourceQualifier getQualifier() {
        return qualifier;
    }

    public void setEntity(SchemasAndTables entity) {
        this.entity = entity;
    }
}
