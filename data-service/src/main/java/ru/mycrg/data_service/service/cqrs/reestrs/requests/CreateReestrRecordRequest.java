package ru.mycrg.data_service.service.cqrs.reestrs.requests;

import org.jetbrains.annotations.NotNull;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.dto.record.RecordEntity;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequest;

public class CreateReestrRecordRequest implements IRequest<IRecord> {

    private final SchemaDto schema;
    private final String tableName;
    private final RecordEntity record;

    public CreateReestrRecordRequest(String tableName,
                                     SchemaDto schemaDto,
                                     RecordEntity record) {
        this.record = record;
        this.schema = schemaDto;
        this.tableName = tableName;
    }

    @Override
    public String getType() {
        return CreateReestrRecordRequest.class.getSimpleName();
    }

    public @NotNull SchemaDto getSchema() {
        return this.schema;
    }

    public IRecord getRecord() {
        return record;
    }

    public String getTableName() {
        return tableName;
    }
}
