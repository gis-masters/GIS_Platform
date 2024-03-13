package ru.mycrg.data_service.service.cqrs.schemas.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.entity.Schema;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.repository.DataSchemaRepository;
import ru.mycrg.data_service.service.cqrs.schemas.requests.CreateSchemaRequest;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.mappers.SchemaEntityMapper.mapToEntity;

@Component
public class CreateSchemaRequestHandler implements IRequestHandler<CreateSchemaRequest, Voidy> {

    private final DataSchemaRepository schemaRepository;

    public CreateSchemaRequestHandler(DataSchemaRepository schemaRepository) {
        this.schemaRepository = schemaRepository;
    }

    @Override
    public Voidy handle(CreateSchemaRequest request) {
        SchemaDto dto = request.getSchema();
        if (!schemaRepository.findByName(dto.getName()).isEmpty()) {
            throw new ConflictException("Schema: '" + dto.getName() + "' already exist");
        }

        Schema newSchema = mapToEntity(new Schema(), dto);

        schemaRepository.save(newSchema);

        return new Voidy();
    }
}
