package ru.mycrg.data_service.service.cqrs.schema_temaplates.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.entity.SchemaTemplate;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.SchemaTemplateRepository;
import ru.mycrg.data_service.service.cqrs.schema_temaplates.requests.UpdateSchemaTemplateRequest;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import java.util.List;

import static ru.mycrg.data_service.mappers.SchemaEntityMapper.mapToEntity;

@Component
public class UpdateSchemaTemplateRequestHandler implements IRequestHandler<UpdateSchemaTemplateRequest, Voidy> {

    private final SchemaTemplateRepository schemaRepository;

    public UpdateSchemaTemplateRequestHandler(SchemaTemplateRepository schemaRepository) {
        this.schemaRepository = schemaRepository;
    }

    @Override
    public Voidy handle(UpdateSchemaTemplateRequest request) {
        SchemaDto dto = request.getSchema();
        List<SchemaTemplate> schemaTemplates = schemaRepository.findByName(dto.getName());
        if (schemaTemplates.isEmpty()) {
            throw new NotFoundException("Schema: '" + dto.getName() + "' not found");
        } else {
            SchemaTemplate schemaTemplate = schemaTemplates.get(0);
            request.setSchemaEntity(schemaTemplate);

            SchemaTemplate updatedSchemaTemplate = mapToEntity(schemaTemplate, dto);

            schemaRepository.save(updatedSchemaTemplate);
        }

        return new Voidy();
    }
}
