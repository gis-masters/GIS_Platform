package ru.mycrg.data_service.service.schemas;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service.service.document_library.DocumentLibraryService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.Optional;

import static ru.mycrg.data_service.dto.ResourceType.*;
import static ru.mycrg.data_service.mappers.SchemaMapper.jsonToDto;
import static ru.mycrg.data_service.service.TaskService.TASKS_SCHEMA;

@Component
public class SchemaExtractor {

    private final Logger log = LoggerFactory.getLogger(SchemaExtractor.class);

    private final ISchemaTemplateService schemaTemplateService;
    private final DocumentLibraryService libraryService;
    private final SchemasAndTablesRepository schemasAndTablesRepository;

    public SchemaExtractor(ISchemaTemplateService schemaTemplateService,
                           DocumentLibraryService documentLibraryService,
                           SchemasAndTablesRepository schemasAndTablesRepository) {
        this.schemaTemplateService = schemaTemplateService;
        this.libraryService = documentLibraryService;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
    }

    public Optional<SchemaDto> get(ResourceQualifier qualifier) {
        try {
            ResourceType type = qualifier.getType();
            if (LIBRARY.equals(type) || LIBRARY_RECORD.equals(type)) {
                return Optional.ofNullable(libraryService.getSchema(qualifier.getTable()));
            } else if (TABLE.equals(type) || FEATURE.equals(type)) {
                SchemasAndTables schemasAndTables = schemasAndTablesRepository
                        .findByIdentifier(qualifier.getTable())
                        .orElseThrow(() -> new NotFoundException(qualifier.getQualifier()));

                return Optional.ofNullable(jsonToDto(schemasAndTables.getSchema()));
            } else if (TASK.equals(type)) {
                return schemaTemplateService.getSchemaByName(TASKS_SCHEMA);
            } else {
                log.warn("Не удалось достать схему. Unknown resource type: [{}]", qualifier.getQualifier());

                return Optional.empty();
            }
        } catch (Exception e) {
            log.warn("Не удалось достать схему. Причина: {}", e.getMessage(), e);

            return Optional.empty();
        }
    }
}
