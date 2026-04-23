package ru.mycrg.data_service.service.cqrs.schema_temaplates.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.entity.SchemaTemplate;
import ru.mycrg.data_service.repository.SchemaTemplateRepository;
import ru.mycrg.data_service.service.cqrs.schema_temaplates.requests.DeleteSchemaTemplateRequest;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import java.util.List;

import static ru.mycrg.data_service.service.schemas.SchemaTemplateServiceProtected.throwIfHaveNoAccess;
import static ru.mycrg.data_service.service.schemas.SchemaTemplateServiceProtected.throwIfSchemaSystem;

@Component
public class DeleteSchemaTemplateRequestHandler implements IRequestHandler<DeleteSchemaTemplateRequest, Voidy> {

    private final SchemaTemplateRepository schemaTemplateRepository;
    private final IAuthenticationFacade authenticationFacade;

    public DeleteSchemaTemplateRequestHandler(SchemaTemplateRepository schemaTemplateRepository,
                                              IAuthenticationFacade authenticationFacade) {

        this.schemaTemplateRepository = schemaTemplateRepository;
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public Voidy handle(DeleteSchemaTemplateRequest request) {
        String name = request.getSchemaTemplateName();

        List<SchemaTemplate> schemaTemplates = schemaTemplateRepository.findByName(name);

        if (schemaTemplates.isEmpty()) {
            return new Voidy();
        }

        SchemaTemplate schemaTemplate = schemaTemplates.getFirst();

        throwIfSchemaSystem(schemaTemplate.getName(), schemaTemplate.getIsSystem());
        throwIfHaveNoAccess(authenticationFacade.isOrganizationAdmin(),
                            schemaTemplate.getCreatedBy(),
                            authenticationFacade.getLogin());

        schemaTemplateRepository.delete(schemaTemplate);

        return new Voidy();
    }
}