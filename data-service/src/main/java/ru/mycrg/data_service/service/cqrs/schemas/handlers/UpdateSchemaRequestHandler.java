package ru.mycrg.data_service.service.cqrs.schemas.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.entity.Schema;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.DataSchemaRepository;
import ru.mycrg.data_service.service.cqrs.schemas.requests.UpdateSchemaRequest;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import java.util.List;

import static ru.mycrg.data_service.mappers.SchemaEntityMapper.mapToEntity;

@Component
public class UpdateSchemaRequestHandler implements IRequestHandler<UpdateSchemaRequest, Voidy> {

    private final DataSchemaRepository schemaRepository;

    public UpdateSchemaRequestHandler(DataSchemaRepository schemaRepository) {
        this.schemaRepository = schemaRepository;
    }

    @Override
    public Voidy handle(UpdateSchemaRequest request) {
        SchemaDto dto = request.getSchema();
        List<Schema> schemas = schemaRepository.findByName(dto.getName());
        if (schemas.isEmpty()) {
            throw new NotFoundException("Schema: '" + dto.getName() + "' not found");
        } else {
            Schema schemaEntity = schemas.get(0);
            request.setSchemaEntity(schemaEntity);

            Schema updatedSchema = mapToEntity(schemaEntity, dto);

            schemaRepository.save(updatedSchema);
        }

        return new Voidy();
    }
}
