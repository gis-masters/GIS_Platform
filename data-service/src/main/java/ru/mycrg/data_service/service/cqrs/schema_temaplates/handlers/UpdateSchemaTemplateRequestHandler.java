package ru.mycrg.data_service.service.cqrs.schema_temaplates.handlers;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.entity.SchemaTemplate;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.SchemaTemplateRepository;
import ru.mycrg.data_service.service.cqrs.schema_temaplates.requests.UpdateSchemaTemplateRequest;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import java.util.List;

import static ru.mycrg.data_service.mappers.SchemaEntityMapper.mapToEntity;
import static ru.mycrg.data_service.service.schemas.SchemaUtil.SYSTEM_TAG_NAME;

@Component
public class UpdateSchemaTemplateRequestHandler implements IRequestHandler<UpdateSchemaTemplateRequest, Voidy> {

    private final static String TAG = "tags";

    private final SchemaTemplateRepository schemaRepository;
    private final IAuthenticationFacade authenticationFacade;

    public UpdateSchemaTemplateRequestHandler(SchemaTemplateRepository schemaRepository,
                                              IAuthenticationFacade authenticationFacade) {
        this.schemaRepository = schemaRepository;
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public Voidy handle(UpdateSchemaTemplateRequest request) {
        SchemaDto dto = request.getSchema();
        List<SchemaTemplate> schemaTemplates = schemaRepository.findByName(dto.getName());

        if (schemaTemplates.isEmpty()) {
            throw new NotFoundException("Schema: '" + dto.getName() + "' not found");
        } else {
            SchemaTemplate schemaTemplate = schemaTemplates.get(0);

            validateSystemTagAccess(schemaTemplate);

            request.setSchemaEntity(schemaTemplate);

            SchemaTemplate updatedSchemaTemplate = mapToEntity(schemaTemplate, dto);

            schemaRepository.save(updatedSchemaTemplate);
        }

        return new Voidy();
    }

    public void validateSystemTagAccess(SchemaTemplate schemaTemplate) {
        JsonNode classRule = schemaTemplate.getClassRule();

        if (!containsSystemTag(classRule)) {
            return;
        }

        if (!authenticationFacade.isOrganizationAdmin()) {
            throw new BadRequestException(String.format(
                    "Схема «%s» включает тег «%s» — изменять её может только администратор.",
                    schemaTemplate.getName(), SYSTEM_TAG_NAME
            ));
        }
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
