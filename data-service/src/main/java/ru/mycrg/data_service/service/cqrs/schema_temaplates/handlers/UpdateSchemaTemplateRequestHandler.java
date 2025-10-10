package ru.mycrg.data_service.service.cqrs.schema_temaplates.handlers;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.entity.SchemaTemplate;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.SchemaTemplateRepository;
import ru.mycrg.data_service.service.cqrs.schema_temaplates.requests.UpdateSchemaTemplateRequest;
import ru.mycrg.data_service.service.schemas.SchemaLogicValidator;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static ru.mycrg.data_service.mappers.SchemaEntityMapper.mapToEntity;
import static ru.mycrg.data_service.service.schemas.SchemaUtil.SYSTEM_TAG_NAME;

@Component
public class UpdateSchemaTemplateRequestHandler implements IRequestHandler<UpdateSchemaTemplateRequest, Voidy> {

    private final static String TAG = "tags";

    private final SchemaLogicValidator schemaLogicValidator;
    private final SchemaTemplateRepository schemaRepository;
    private final IAuthenticationFacade authenticationFacade;

    public UpdateSchemaTemplateRequestHandler(SchemaLogicValidator schemaLogicValidator,
                                              SchemaTemplateRepository schemaRepository,
                                              IAuthenticationFacade authenticationFacade) {
        this.schemaLogicValidator = schemaLogicValidator;
        this.schemaRepository = schemaRepository;
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public Voidy handle(UpdateSchemaTemplateRequest request) {
        SchemaDto schema = request.getSchema();
        Set<ErrorInfo> validationMismatches = schemaLogicValidator.validate(schema);
        if (!validationMismatches.isEmpty()) {
            throw new BadRequestException("В схеме найдены ошибки", new ArrayList<>(validationMismatches));
        }

        List<SchemaTemplate> schemaTemplates = schemaRepository.findByName(schema.getName());
        if (schemaTemplates.isEmpty()) {
            throw new NotFoundException("Схема: '" + schema.getName() + "' не найдена");
        }

        SchemaTemplate schemaTemplate = schemaTemplates.get(0);

        validateSystemTagAccess(schemaTemplate);

        request.setSchemaEntity(schemaTemplate);

        SchemaTemplate updatedSchemaTemplate = mapToEntity(schemaTemplate, schema);

        schemaRepository.save(updatedSchemaTemplate);

        return new Voidy();
    }

    private void validateSystemTagAccess(SchemaTemplate schemaTemplate) {
        JsonNode classRule = schemaTemplate.getClassRule();
        if (!containsSystemTag(classRule) || authenticationFacade.isOrganizationAdmin()) {
            return;
        }

        throw new BadRequestException(
                String.format("Схема «%s» включает тег «%s» — изменять её может только администратор.",
                              schemaTemplate.getName(), SYSTEM_TAG_NAME));
    }

    private boolean containsSystemTag(JsonNode classRule) {
        JsonNode tagsNode = classRule.path(TAG);
        if (!tagsNode.isArray()) {
            return false;
        }

        for (JsonNode tag: tagsNode) {
            String text = tag.textValue();
            if (SYSTEM_TAG_NAME.equalsIgnoreCase(text)) {
                return true;
            }
        }

        return false;
    }
}
