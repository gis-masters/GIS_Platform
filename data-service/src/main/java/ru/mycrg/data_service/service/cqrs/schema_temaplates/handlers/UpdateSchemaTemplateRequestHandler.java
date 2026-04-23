package ru.mycrg.data_service.service.cqrs.schema_temaplates.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.entity.SchemaTemplate;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.SchemaTemplateRepository;
import ru.mycrg.data_service.service.cqrs.schema_temaplates.requests.UpdateSchemaTemplateRequest;
import ru.mycrg.data_service.service.schemas.SchemaLogicValidator;
import ru.mycrg.data_service.service.schemas.SchemaPrintingTemplatesValidator;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static java.time.LocalDateTime.now;
import static ru.mycrg.data_service.mappers.SchemaEntityMapper.mapToEntity;
import static ru.mycrg.data_service.service.schemas.SchemaTemplateServiceProtected.throwIfHaveNoAccess;
import static ru.mycrg.data_service.service.schemas.SchemaTemplateServiceProtected.throwIfSchemaSystem;

@Component
public class UpdateSchemaTemplateRequestHandler implements IRequestHandler<UpdateSchemaTemplateRequest, Voidy> {

    private final SchemaLogicValidator schemaLogicValidator;
    private final SchemaPrintingTemplatesValidator schemaPrintingTemplatesValidator;
    private final SchemaTemplateRepository schemaTemplateRepository;
    private final IAuthenticationFacade authenticationFacade;

    public UpdateSchemaTemplateRequestHandler(SchemaLogicValidator schemaLogicValidator,
                                              SchemaPrintingTemplatesValidator schemaPrintingTemplatesValidator,
                                              SchemaTemplateRepository schemaTemplateRepository,
                                              IAuthenticationFacade authenticationFacade) {
        this.schemaLogicValidator = schemaLogicValidator;
        this.schemaPrintingTemplatesValidator = schemaPrintingTemplatesValidator;
        this.schemaTemplateRepository = schemaTemplateRepository;
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public Voidy handle(UpdateSchemaTemplateRequest request) {
        SchemaDto schema = request.getSchema();

        Set<ErrorInfo> validationMismatches = schemaLogicValidator.validate(schema);
        validationMismatches.addAll(
                schemaPrintingTemplatesValidator.checkTemplateAvailability(schema.getPrintTemplates()));

        if (!validationMismatches.isEmpty()) {
            throw new BadRequestException("В схеме найдены ошибки", new ArrayList<>(validationMismatches));
        }

        List<SchemaTemplate> schemaTemplates = schemaTemplateRepository.findByName(schema.getName());
        if (schemaTemplates.isEmpty()) {
            throw new NotFoundException("Схема: '" + schema.getName() + "' не найдена");
        }

        SchemaTemplate schemaTemplate = schemaTemplates.getFirst();

        throwIfSchemaSystem(schemaTemplate.getName(), schemaTemplate.getIsSystem());
        String currentUserLogin = authenticationFacade.getLogin();
        throwIfHaveNoAccess(authenticationFacade.isOrganizationAdmin(),
                            schemaTemplate.getCreatedBy(),
                            currentUserLogin);

        request.setSchemaEntity(schemaTemplate);

        SchemaTemplate updatedSchemaTemplate = mapToEntity(schemaTemplate, schema);
        updatedSchemaTemplate.setLastModified(now());
        updatedSchemaTemplate.setModifiedBy(currentUserLogin);

        schemaTemplateRepository.save(updatedSchemaTemplate);

        return new Voidy();
    }
}
