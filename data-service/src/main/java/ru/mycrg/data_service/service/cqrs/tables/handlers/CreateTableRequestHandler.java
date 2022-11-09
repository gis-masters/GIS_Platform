package ru.mycrg.data_service.service.cqrs.tables.handlers;

import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.ddl.DdlTables;
import ru.mycrg.data_service.dto.TableCreateDto;
import ru.mycrg.data_service.dto.TableModel;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service.service.PermissionsService;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service.service.cqrs.tables.requests.CreateTableRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.IResourceProtector;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.mediator.IRequestHandler;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import static java.util.Objects.isNull;
import static ru.mycrg.data_service.dto.ResourceType.TABLE;
import static ru.mycrg.data_service.dto.Roles.OWNER;
import static ru.mycrg.data_service.service.resources.DatasetService.SCHEMAS_AND_TABLES_QUALIFIER;
import static ru.mycrg.data_service.util.DetailedLogger.logError;

@Component
public class CreateTableRequestHandler implements IRequestHandler<CreateTableRequest, TableModel> {

    private final DdlTables ddlTables;
    private final SchemasAndTablesRepository schemasAndTablesRepository;
    private final PermissionsService permissionsService;
    private final SchemaService schemaService;
    private final IResourceProtector datasetProtector;

    public CreateTableRequestHandler(DdlTables ddlTables,
                                     SchemasAndTablesRepository schemasAndTablesRepository,
                                     PermissionsService permissionsService,
                                     SchemaService schemaService,
                                     IResourceProtector datasetProtector) {
        this.ddlTables = ddlTables;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
        this.permissionsService = permissionsService;
        this.schemaService = schemaService;
        this.datasetProtector = datasetProtector;
    }

    @Override
    public TableModel handle(CreateTableRequest request) {
        TableCreateDto dto = request.getTableCreateDto();
        ResourceQualifier tQualifier = request.gettQualifier();

        if (!datasetProtector.isEditAllowed(new ResourceQualifier(tQualifier.getSchema()))) {
            throw new ForbiddenException("Недостаточно прав для редактирования набора: " + tQualifier.getQualifier());
        }

        String datasetId = tQualifier.getSchema();
        SchemasAndTables dataset = schemasAndTablesRepository
                .findByIdentifier(datasetId)
                .orElseThrow(() -> new NotFoundException("Not found dataset: " + datasetId));

        Optional<SchemaDto> schemaByName = schemaService.getSchemaByName(dto.getSchemaId());
        if (schemaByName.isEmpty()) {
            throw new BadRequestException("Схема для таблицы не существует!");
        }

        SchemaDto schema = schemaByName.get();

        throwIfNoGeometryInSchema(schema);
        String tableName = buildTableName(schema.getTableName(), dataset.getId(), dto.getName());
        dto.setName(tableName);

        try {
            ddlTables.create(datasetId, dto, schema.getProperties());
        } catch (BadSqlGrammarException e) {
            String msg = String.format("Не удалось создать таблицу: %s, по схеме: %s. Причина: %s",
                                       dto.getName(), schema.getName(), e.getMessage());
            logError(msg, e);

            throw new BadRequestException(msg);
        }

        // Add record to schemasAndTables table
        LocalDateTime approveDate = Objects.nonNull(dto.getDocApproveDate())
                ? dto.getDocApproveDate().atStartOfDay()
                : null;

        LocalDateTime docTerminationDate = Objects.nonNull(dto.getDocTerminationDate())
                ? dto.getDocTerminationDate().atStartOfDay()
                : null;

        String path = dataset.getPath() + "/" + dataset.getId();
        SchemasAndTables table = new SchemasAndTables(TABLE, dto, tableName, path);
        table.setCrs(dto.getCrs());
        table.setSchemaId(dto.getSchemaId());
        table.setStatus(dto.getStatus());
        table.setIsPublic(dto.getIsPublic());
        table.setDocApproveDate(approveDate);
        table.setDocTerminationDate(docTerminationDate);
        table.setFiasId(dto.getFias__id());
        table.setFiasAdress(dto.getFias__address());
        table.setFiasOktmo(dto.getFias__oktmo());

        SchemasAndTables newEntity = schemasAndTablesRepository.save(table);
        request.setEntity(newEntity);

        // Create OWNER permission
        permissionsService.addOwnerPermission(SCHEMAS_AND_TABLES_QUALIFIER, newEntity.getId());

        return new TableModel(newEntity, OWNER.name());
    }

    private String buildTableName(String sTableName, long datasetId, String nameFromDto) {
        if (nameFromDto == null || nameFromDto.isEmpty()) {
            return String.format("%s_%d_%s", sTableName, datasetId, UUID.randomUUID().toString().substring(0, 4));
        } else {
            return nameFromDto;
        }
    }

    private void throwIfNoGeometryInSchema(SchemaDto schema) {
        long geomField = schema.getProperties().stream().filter(SimplePropertyDto::isGeometry).count();
        if (isNull(schema.getGeometryType()) || geomField < 1) {
            throw new BadRequestException(String.format("Невозможно создать таблицу по схеме: %s. " +
                                                                "Причина: отсутствует поле для геометрии.",
                                                        schema.getName()));
        }
    }
}
