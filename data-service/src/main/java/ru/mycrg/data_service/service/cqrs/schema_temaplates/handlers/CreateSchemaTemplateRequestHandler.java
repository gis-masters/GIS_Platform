package ru.mycrg.data_service.service.cqrs.schema_temaplates.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.entity.SchemaTemplate;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service.repository.SchemaTemplateRepository;
import ru.mycrg.data_service.service.cqrs.schema_temaplates.requests.CreateSchemaTemplateRequest;
import ru.mycrg.data_service.service.schemas.SchemaLogicValidator;
import ru.mycrg.data_service.service.schemas.SchemaPrintingTemplatesValidator;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import java.util.ArrayList;
import java.util.Set;

import static ru.mycrg.data_service.mappers.SchemaEntityMapper.mapToEntity;

@Component
public class CreateSchemaTemplateRequestHandler implements IRequestHandler<CreateSchemaTemplateRequest, Voidy> {

    private final SchemaLogicValidator schemaLogicValidator;
    private final SchemaPrintingTemplatesValidator schemaPrintingTemplatesValidator;
    private final SchemaTemplateRepository schemaRepository;

    public CreateSchemaTemplateRequestHandler(SchemaLogicValidator schemaLogicValidator,
                                              SchemaPrintingTemplatesValidator schemaPrintingTemplatesValidator,
                                              SchemaTemplateRepository schemaRepository) {
        this.schemaLogicValidator = schemaLogicValidator;
        this.schemaPrintingTemplatesValidator = schemaPrintingTemplatesValidator;
        this.schemaRepository = schemaRepository;
    }

    @Override
    public Voidy handle(CreateSchemaTemplateRequest request) {
        SchemaDto newSchema = request.getSchema();
        if (!schemaRepository.findByName(newSchema.getName()).isEmpty()) {
            throw new ConflictException("Схема: '" + newSchema.getName() + "' уже существует");
        }

        Set<ErrorInfo> validationMismatches = schemaLogicValidator.validate(newSchema);
        validationMismatches.addAll(
                schemaPrintingTemplatesValidator.checkTemplateAvailability(newSchema.getPrintTemplates()));
        if (!validationMismatches.isEmpty()) {
            throw new BadRequestException("В схеме найдены ошибки", new ArrayList<>(validationMismatches));
        }

        SchemaTemplate newSchemaTemplate = mapToEntity(new SchemaTemplate(), newSchema);

        schemaRepository.save(newSchemaTemplate);

        return new Voidy();
    }
}
