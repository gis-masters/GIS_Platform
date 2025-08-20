package ru.mycrg.data_service.service.cqrs.schema_temaplates.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.entity.SchemaTemplate;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.repository.SchemaTemplateRepository;
import ru.mycrg.data_service.service.cqrs.schema_temaplates.requests.CreateSchemaTemplateRequest;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.mappers.SchemaEntityMapper.mapToEntity;

@Component
public class CreateSchemaTemplateRequestHandler implements IRequestHandler<CreateSchemaTemplateRequest, Voidy> {

    private final SchemaTemplateRepository schemaRepository;

    public CreateSchemaTemplateRequestHandler(SchemaTemplateRepository schemaRepository) {
        this.schemaRepository = schemaRepository;
    }

    @Override
    public Voidy handle(CreateSchemaTemplateRequest request) {
        SchemaDto dto = request.getSchema();
        if (!schemaRepository.findByName(dto.getName()).isEmpty()) {
            throw new ConflictException("Schema: '" + dto.getName() + "' already exist");
        }

        SchemaTemplate newSchemaTemplate = mapToEntity(new SchemaTemplate(), dto);

        schemaRepository.save(newSchemaTemplate);

        return new Voidy();
    }
}
