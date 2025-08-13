package ru.mycrg.data_service.service.cqrs.tasks.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.ddl.tables.DdlConstraints;
import ru.mycrg.data_service.dao.ddl.tables.DdlTablesBase;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.cqrs.tasks.requests.CreateTaskTableRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.schemas.ISchemaTemplateService;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.ValueType;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.dao.config.DaoProperties.ID;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;

@Component
public class CreateTaskTableRequestHandler implements IRequestHandler<CreateTaskTableRequest, Voidy> {

    private static final Logger log = LoggerFactory.getLogger(CreateTaskTableRequestHandler.class);

    private final DdlTablesBase ddlTablesBase;
    private final ISchemaTemplateService schemaService;
    private final DdlConstraints ddl;

    public CreateTaskTableRequestHandler(ISchemaTemplateService schemaService,
                                         DdlTablesBase ddlTablesBase,
                                         DdlConstraints ddl) {
        this.schemaService = schemaService;
        this.ddlTablesBase = ddlTablesBase;
        this.ddl = ddl;
    }

    @Override
    @Transactional
    public Voidy handle(CreateTaskTableRequest request) {
        String schemaId = request.getSchemaId();

        SchemaDto schema = schemaService
                .getSchemaByName(schemaId)
                .orElseThrow(() -> new NotFoundException("Не найдена схема задачи: " + schemaId));

        ResourceQualifier taskQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME,
                                                                schema.getTableName().toLowerCase(),
                                                                ResourceType.TASK);

        log.debug("TaskQualifier = {}", taskQualifier);
        log.debug("TaskTableQualifier = {}", taskQualifier.getTable());

        List<SimplePropertyDto> schemaProperties = schema.getProperties();
        generateIdIfNeed(schemaProperties);

        validationSchema(schema);

        ddlTablesBase.create(SYSTEM_SCHEMA_NAME, taskQualifier.getTable(), schemaProperties, ID);
        log.debug("Успешно создали таблицу задач");

        //после того как мы create data.tasks мы можем создать foreign key constraint
        ddl.makeConstraints("data.tasks_log", "data.tasks", "tasks", "task_id", "id", "ON UPDATE NO ACTION");
        log.debug("Успешно создали foreign key constraint между tasks_log и tasks");

        return new Voidy();
    }

    private void generateIdIfNeed(List<SimplePropertyDto> schemaProperties) {
        List<String> schemaPropertyName = schemaProperties
                .stream()
                .map(SimplePropertyDto::getName)
                .collect(Collectors.toList());

        log.debug("{} поле 'Номер', как системное поле задач",
                  schemaPropertyName.contains(ID) ? "Заменяем" : "Доносим");

        SimplePropertyDto id = new SimplePropertyDto();
        id.setName(ID);
        id.setTitle("Номер");
        id.setDescription("Заполняется автоматически");
        id.setMaxDefaultWidth(105);
        id.setReadOnly(true);
        id.setValueType(ValueType.LONG);

        schemaProperties.removeIf(prop -> ID.equals(prop.getName()));

        schemaProperties.add(0, id);
    }

    private void validationSchema(SchemaDto schema) {
        if (Objects.isNull(schema.getTitle()) || schema.getTitle().isEmpty()) {
            throw new DataServiceException("Обязательное поле title отсутствует в схеме " + schema.getName());
        }

        if (Objects.isNull(schema.getTableName()) || schema.getTableName().isEmpty()) {
            throw new DataServiceException("Обязательное поле tableName отсутствует в схеме " + schema.getName());
        }
    }
}
