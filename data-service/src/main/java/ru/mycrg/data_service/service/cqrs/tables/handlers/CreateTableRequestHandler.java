package ru.mycrg.data_service.service.cqrs.tables.handlers;

import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.ddl.DdlTables;
import ru.mycrg.data_service.dto.TableCreateDto;
import ru.mycrg.data_service.dto.TableModel;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service.service.PermissionsService;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service.service.cqrs.tables.requests.CreateTableRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequestHandler;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;

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

    public CreateTableRequestHandler(DdlTables ddlTables,
                                     SchemasAndTablesRepository schemasAndTablesRepository,
                                     PermissionsService permissionsService,
                                     SchemaService schemaService) {
        this.ddlTables = ddlTables;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
        this.permissionsService = permissionsService;
        this.schemaService = schemaService;
    }

    @Override
    public TableModel handle(CreateTableRequest request) {
        TableCreateDto dto = request.getTableCreateDto();
        ResourceQualifier tQualifier = request.gettQualifier();

        String datasetId = tQualifier.getSchema();
        SchemasAndTables dataset = schemasAndTablesRepository
                .findByIdentifier(datasetId)
                .orElseThrow(() -> new NotFoundException("Not found dataset: " + datasetId));

        Optional<SchemaDto> schemaByName = schemaService.getSchemaByName(dto.getSchemaId());
        if (schemaByName.isPresent()) {
            try {
                ddlTables.create(datasetId, dto, schemaByName.get().getProperties());
            } catch (BadSqlGrammarException e) {
                String msg = "Не удалось создать таблицу: " + dto;
                logError(msg, e);

                throw new DataServiceException(msg);
            }

            // Add record to schemasAndTables table
            LocalDateTime approveDate = Objects.nonNull(dto.getDocApproveDate())
                    ? dto.getDocApproveDate().atStartOfDay()
                    : null;

            LocalDateTime docTerminationDate = Objects.nonNull(dto.getDocTerminationDate())
                    ? dto.getDocTerminationDate().atStartOfDay()
                    : null;

            String path = dataset.getPath() + "/" + dataset.getId();
            SchemasAndTables table = new SchemasAndTables(TABLE, dto, tQualifier.getTable(), path);
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
        } else {
            throw new BadRequestException("Schema for table doesn't exist!");
        }
    }
}
