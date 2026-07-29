package ru.mycrg.data_service.service.cqrs.schema_temaplates.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.entity.SchemaTemplate;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service.repository.SchemaTemplateRepository;
import ru.mycrg.data_service.service.cqrs.schema_temaplates.requests.CreateSchemaTemplateRequest;
import ru.mycrg.data_service.service.schemas.SchemaLogicValidator;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Set;

import static java.time.LocalDateTime.now;
import static ru.mycrg.data_service.mappers.SchemaEntityMapper.mapToEntity;

@Component
public class CreateSchemaTemplateRequestHandler implements IRequestHandler<CreateSchemaTemplateRequest, Voidy> {

    private final SchemaLogicValidator schemaLogicValidator;
    private final SchemaTemplateRepository schemaTemplateRepository;
    private final IAuthenticationFacade authenticationFacade;

    public CreateSchemaTemplateRequestHandler(SchemaLogicValidator schemaLogicValidator,
                                              SchemaTemplateRepository schemaTemplateRepository,
                                              IAuthenticationFacade authenticationFacade) {
        this.schemaLogicValidator = schemaLogicValidator;
        this.schemaTemplateRepository = schemaTemplateRepository;
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public Voidy handle(CreateSchemaTemplateRequest request) {
        SchemaDto newSchema = request.getSchema();
        if (!schemaTemplateRepository.findByName(newSchema.getName()).isEmpty()) {
            throw new ConflictException("Схема: '" + newSchema.getName() + "' уже существует");
        }

        Set<ErrorInfo> validationMismatches = schemaLogicValidator.validate(newSchema);

        if (!validationMismatches.isEmpty()) {
            throw new BadRequestException("В схеме найдены ошибки", new ArrayList<>(validationMismatches));
        }

        SchemaTemplate newSchemaTemplate = mapToEntity(new SchemaTemplate(), newSchema);
        fillTemplateSystemData(newSchemaTemplate);

        schemaTemplateRepository.save(newSchemaTemplate);

        return new Voidy();
    }

    private void fillTemplateSystemData(SchemaTemplate newSchemaTemplate) {
        String login = authenticationFacade.getLogin();

        newSchemaTemplate.setCreatedBy(login);
        newSchemaTemplate.setModifiedBy(login);

        LocalDateTime now = now();

        newSchemaTemplate.setCreatedAt(now);
        newSchemaTemplate.setLastModified(now);

        newSchemaTemplate.setIsSystem(Boolean.FALSE);
        newSchemaTemplate.setFromJson(Boolean.FALSE);
    }
}
