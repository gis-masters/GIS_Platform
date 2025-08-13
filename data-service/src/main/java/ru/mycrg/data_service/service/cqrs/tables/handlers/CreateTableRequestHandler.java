package ru.mycrg.data_service.service.cqrs.tables.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.ddl.tables.DdlTablesSpecial;
import ru.mycrg.data_service.dao.ddl.tables.DdlTriggers;
import ru.mycrg.data_service.dao.utils.wellknown_formula_generator.IWellKnownFormulaGenerator;
import ru.mycrg.data_service.dto.TableCreateDto;
import ru.mycrg.data_service.dto.TableModel;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service.service.PermissionsService;
import ru.mycrg.data_service.service.cqrs.tables.requests.CreateTableRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.IResourceProtector;
import ru.mycrg.data_service.service.schemas.ISchemaTemplateService;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.ValueType;
import ru.mycrg.mediator.IRequestHandler;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;
import static java.util.stream.Collectors.toMap;
import static ru.mycrg.data_service.dao.config.DaoProperties.*;
import static ru.mycrg.data_service.dto.ResourceType.TABLE;
import static ru.mycrg.data_service.dto.Roles.OWNER;
import static ru.mycrg.data_service.service.resources.DatasetService.SCHEMAS_AND_TABLES_QUALIFIER;
import static ru.mycrg.data_service.service.schemas.SchemaUtil.getFtsProperties;
import static ru.mycrg.data_service.util.DetailedLogger.logError;
import static ru.mycrg.data_service.util.JsonConverter.toJsonNode;

@Component
public class CreateTableRequestHandler implements IRequestHandler<CreateTableRequest, TableModel> {

    private final Logger log = LoggerFactory.getLogger(CreateTableRequestHandler.class);

    private final DdlTriggers ddlTriggers;
    private final ISchemaTemplateService schemaService;
    private final DdlTablesSpecial ddlTablesSpecial;
    private final IResourceProtector datasetProtector;
    private final PermissionsService permissionsService;
    private final SchemasAndTablesRepository schemasAndTablesRepository;
    private final Map<String, IWellKnownFormulaGenerator> wellKnownFormulaGenerators;

    public CreateTableRequestHandler(DdlTriggers ddlTriggers,
                                     ISchemaTemplateService schemaService,
                                     DdlTablesSpecial ddlTablesSpecial,
                                     IResourceProtector datasetProtector,
                                     PermissionsService permissionsService,
                                     SchemasAndTablesRepository schemasAndTablesRepository,
                                     List<IWellKnownFormulaGenerator> generators) {
        this.ddlTriggers = ddlTriggers;
        this.ddlTablesSpecial = ddlTablesSpecial;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
        this.permissionsService = permissionsService;
        this.schemaService = schemaService;
        this.datasetProtector = datasetProtector;
        this.wellKnownFormulaGenerators = generators.stream()
                                                    .collect(toMap(IWellKnownFormulaGenerator::getType,
                                                                   Function.identity()));
    }

    @Override
    @Transactional
    public TableModel handle(CreateTableRequest request) {
        TableCreateDto dto = request.getTableCreateDto();

        SchemaDto schema = schemaService
                .getSchemaByName(dto.getSchemaId())
                .orElseThrow(() -> new BadRequestException(
                        "Не возможно создать таблицу. Не существует схемы: " + dto.getSchemaId()));

        validateSchema(schema);

        SchemasAndTables dataset = getDataset(request);

        String tableName = buildTableName(schema.getTableName(), dataset.getId(), dto.getName());
        dto.setName(tableName);

        createTable(schema, dataset.getIdentifier(), dto);

        // Create FTS triggers
        ResourceQualifier qualifier = new ResourceQualifier(dataset.getIdentifier(), tableName);
        List<String> ftsProperties = getFtsProperties(schema);
        ddlTriggers.createInsertTrigger(qualifier, ftsProperties);
        ddlTriggers.createUpdateTrigger(qualifier, ftsProperties);
        ddlTriggers.createDeleteTrigger(qualifier);

        // Add record to schemasAndTables table
        String pathToParent = dataset.getPath() + "/" + dataset.getId();
        SchemasAndTables table = new SchemasAndTables(dto, pathToParent, TABLE, toJsonNode(schema));
        SchemasAndTables newEntity = schemasAndTablesRepository.save(table);
        request.setEntity(newEntity);

        // Create OWNER permission
        permissionsService.addOwnerPermission(SCHEMAS_AND_TABLES_QUALIFIER, newEntity.getId());

        return new TableModel(newEntity, OWNER.name(), dataset.getIdentifier());
    }

    private SchemasAndTables getDataset(CreateTableRequest request) {
        ResourceQualifier datasetQualifier = request.getQualifier();
        if (!datasetProtector.isEditAllowed(new ResourceQualifier(datasetQualifier.getSchema()))) {
            throw new ForbiddenException(
                    "Недостаточно прав для редактирования набора: " + datasetQualifier.getQualifier());
        }

        String datasetId = datasetQualifier.getSchema();
        return schemasAndTablesRepository
                .findByIdentifier(datasetId)
                .orElseThrow(() -> new NotFoundException("Не найден набор данных: " + datasetId));
    }

    private void createTable(SchemaDto schema, String datasetId, TableCreateDto dto) {
        try {
            List<SimplePropertyDto> schemaProperties = schema.getProperties();
            generateSystemAttributes(schemaProperties);

            ddlTablesSpecial.create(datasetId, dto, schemaProperties);
        } catch (BadSqlGrammarException e) {
            String msg = String.format("Не удалось создать таблицу: %s, по схеме: %s. Причина: %s",
                                       dto.getName(), schema.getName(), e.getMessage());
            logError(msg, e);

            throw new BadRequestException(msg);
        }
    }

    private void validateSchema(SchemaDto schema) {
        long geomField = schema.getProperties().stream().filter(SimplePropertyDto::isGeometry).count();
        if (isNull(schema.getGeometryType()) || geomField < 1) {
            throw new BadRequestException(
                    "Отсутствует описание геометрии. Невозможно создать таблицу по схеме: " + schema.getName());
        }

        List<ErrorInfo> errors = new ArrayList<>();
        schema.getProperties().forEach(property -> {
            String formulaName = property.getCalculatedValueWellKnownFormula();
            if (formulaName == null) {
                return;
            }

            IWellKnownFormulaGenerator formulaGenerator = wellKnownFormulaGenerators.get(formulaName);
            if (nonNull(formulaGenerator)) {
                String message = formulaGenerator.validate(schema);
                if (!message.isEmpty()) {
                    ErrorInfo error = new ErrorInfo();
                    error.setField(property.getName());
                    error.setMessage(message);

                    errors.add(error);
                }
            } else {
                ErrorInfo error = new ErrorInfo();
                error.setField(property.getName());
                error.setMessage("Неизвестная valueWellKnownFormula: " + formulaName);

                errors.add(error);
            }
        });

        if (!errors.isEmpty()) {
            errors.forEach(errorInfo -> log.error("For field '{}': {}", errorInfo.getField(), errorInfo.getMessage()));

            throw new BadRequestException("Argument validation exception", errors);
        }
    }

    private void generateSystemAttributes(List<SimplePropertyDto> schemaProperties) {
        List<String> schemaPropertyName = schemaProperties.stream().map(SimplePropertyDto::getName)
                                                          .collect(Collectors.toList());
        if (!schemaPropertyName.contains(RULE_ID)) {
            SimplePropertyDto ruleId = new SimplePropertyDto();
            ruleId.setName(RULE_ID);
            ruleId.setTitle("Идентификатор стиля");
            ruleId.setValueType(ValueType.STRING);

            schemaProperties.add(ruleId);
        }

        log.debug("{} поле '№', как системное поле векторных таблиц",
                  schemaPropertyName.contains(ID) ? "Заменяем" : "Доносим");

        SimplePropertyDto objectId = new SimplePropertyDto();
        objectId.setName(PRIMARY_KEY);
        objectId.setTitle("№");
        objectId.setDescription("Идентификатор объекта (Заполняется автоматически)");
        objectId.setReadOnly(true);
        objectId.setMaxDefaultWidth(105);
        objectId.setValueType(ValueType.LONG);

        schemaProperties.removeIf(prop -> PRIMARY_KEY.equals(prop.getName()));

        schemaProperties.add(0, objectId);
    }

    private String buildTableName(String nameFromSchema, long datasetId, String requiredName) {
        if (requiredName != null && !requiredName.isBlank()) {
            return requiredName;
        }

        return String.format("%s_%d_%s", nameFromSchema, datasetId, UUID.randomUUID().toString().substring(0, 5));
    }
}
