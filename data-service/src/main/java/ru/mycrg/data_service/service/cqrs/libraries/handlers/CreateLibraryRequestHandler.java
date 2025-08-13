package ru.mycrg.data_service.service.cqrs.libraries.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.ddl.tables.DdlTablesBase;
import ru.mycrg.data_service.dao.ddl.tables.DdlTriggers;
import ru.mycrg.data_service.dto.LibraryCreateDto;
import ru.mycrg.data_service.dto.LibraryModel;
import ru.mycrg.data_service.entity.DocumentLibrary;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.DocumentLibraryRepository;
import ru.mycrg.data_service.service.cqrs.libraries.requests.CreateLibraryRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.DocLibraryProtector;
import ru.mycrg.data_service.service.schemas.ISchemaTemplateService;
import ru.mycrg.data_service.util.SystemLibraryAttributes;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.ValueType;
import ru.mycrg.mediator.IRequestHandler;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;
import static ru.mycrg.data_service.dao.config.DaoProperties.ID;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.libraryQualifier;
import static ru.mycrg.data_service.service.schemas.SchemaUtil.getFtsProperties;
import static ru.mycrg.data_service.util.JsonConverter.toJsonNode;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.*;

@Component
public class CreateLibraryRequestHandler implements IRequestHandler<CreateLibraryRequest, LibraryModel> {

    private static final Logger log = LoggerFactory.getLogger(CreateLibraryRequestHandler.class);

    private final DdlTriggers ddlTriggers;
    private final DdlTablesBase ddlTablesBase;
    private final ISchemaTemplateService schemaService;
    private final DocLibraryProtector docLibraryProtector;
    private final IAuthenticationFacade authenticationFacade;
    private final DocumentLibraryRepository libraryRepository;

    public CreateLibraryRequestHandler(DdlTriggers ddlTriggers,
                                       ISchemaTemplateService schemaService,
                                       DdlTablesBase ddlTablesBase,
                                       DocumentLibraryRepository libraryRepository,
                                       IAuthenticationFacade authenticationFacade,
                                       DocLibraryProtector docLibraryProtector) {
        this.ddlTriggers = ddlTriggers;
        this.schemaService = schemaService;
        this.libraryRepository = libraryRepository;
        this.authenticationFacade = authenticationFacade;
        this.ddlTablesBase = ddlTablesBase;
        this.docLibraryProtector = docLibraryProtector;
    }

    @Override
    @Transactional
    public LibraryModel handle(CreateLibraryRequest request) {
        LibraryCreateDto dto = request.getLibraryCreateDto();

        SchemaDto schema = schemaService
                .getSchemaByName(dto.getSchemaId())
                .orElseThrow(() -> new NotFoundException("Не найдена схема библиотеки: " + dto.getSchemaId()));
        ResourceQualifier dlQualifier = libraryQualifier(schema.getTableName().toLowerCase());

        docLibraryProtector.throwIfExists(dlQualifier);

        List<SimplePropertyDto> schemaProperties = schema.getProperties();
        generateSystemAttributes(schemaProperties);

        validationSchema(schema);

        DocumentLibrary library = new DocumentLibrary();
        library.setTitle(schema.getTitle());
        library.setSchema(toJsonNode(schema));
        library.setDetails(dto.getDetails());
        library.setTableName(dlQualifier.getTable());
        library.setCreatedBy(authenticationFacade.getLogin());
        library.setPath(ROOT_FOLDER_PATH);
        library.setVersioned(dto.isVersioned());
        library.setReadyForFts(dto.isReadyForFts());

        libraryRepository.save(library);

        generateSystemBackAttributes(schemaProperties);

        ddlTablesBase.create(SYSTEM_SCHEMA_NAME, library.getTableName(), schemaProperties, ID);

        // Create FTS triggers
        List<String> ftsProperties = getFtsProperties(schema);
        ddlTriggers.createInsertTrigger(dlQualifier, ftsProperties);
        ddlTriggers.createUpdateTrigger(dlQualifier, ftsProperties);
        ddlTriggers.createDeleteTrigger(dlQualifier);

        LibraryModel libraryModel = new LibraryModel(library);
        request.setLibraryModel(libraryModel);

        return libraryModel;
    }

    private void generateSystemAttributes(List<SimplePropertyDto> schemaProperties) {
        List<String> schemaPropertyName = schemaProperties.stream().map(SimplePropertyDto::getName)
                                                          .collect(Collectors.toList());
        if (!schemaPropertyName.contains(IS_FOLDER.getName())) {
            SimplePropertyDto isFolder = new SimplePropertyDto();
            isFolder.setName(IS_FOLDER.getName());
            isFolder.setTitle("Папка/Документ");
            isFolder.setDescription("Папка или Документ");
            isFolder.setValueType(ValueType.BOOLEAN);
            isFolder.setDefaultValue(false);

            schemaProperties.add(isFolder);
        }

        if (!schemaPropertyName.contains(PATH.getName())) {
            SimplePropertyDto path = new SimplePropertyDto();
            path.setName(PATH.getName());
            path.setTitle("Путь");
            path.setDescription("Полный путь, отражающий иерархию объектов");
            path.setValueType(ValueType.TEXT);
            path.setMinWidth(250);
            path.setDefaultValue(ROOT_FOLDER_PATH);

            schemaProperties.add(path);
        }

        log.debug("{} поле '№', как системное поле библиотек",
                  schemaPropertyName.contains(ID) ? "Заменяем" : "Доносим");

        SimplePropertyDto id = new SimplePropertyDto();
        id.setName(ID);
        id.setTitle("Номер");
        id.setDescription("Заполняется автоматически");
        id.setReadOnly(true);
        id.setMaxDefaultWidth(105);
        id.setValueType(ValueType.LONG);

        schemaProperties.removeIf(prop -> ID.equals(prop.getName()));

        schemaProperties.add(0, id);
    }

    private void generateSystemBackAttributes(List<SimplePropertyDto> schemaProperties) {
        List<String> schemaPropertyName = schemaProperties.stream().map(SimplePropertyDto::getName)
                                                          .collect(Collectors.toList());
        if (!schemaPropertyName.contains(SystemLibraryAttributes.VERSIONS.getName())) {
            SimplePropertyDto versions = new SimplePropertyDto();
            versions.setName(SystemLibraryAttributes.VERSIONS.getName());
            versions.setValueType(ValueType.VERSIONS);

            schemaProperties.add(versions);
        }

        if (!schemaPropertyName.contains(IS_DELETED.getName())) {
            SimplePropertyDto isDeleted = new SimplePropertyDto();
            isDeleted.setName(IS_DELETED.getName());
            isDeleted.setValueType(ValueType.BOOLEAN);
            isDeleted.setDefaultValue(false);

            schemaProperties.add(isDeleted);
        }
    }

    private void validationSchema(SchemaDto schema) {
        if (Objects.isNull(schema.getTitle()) || schema.getTitle().isEmpty()) {
            throw new DataServiceException("Обязательное поле title отсутствует в в схеме " + schema.getName());
        }

        if (Objects.isNull(schema.getTableName()) || schema.getTableName().isEmpty()) {
            throw new DataServiceException("Обязательное поле tableName отсутствует в в схеме " + schema.getName());
        }
    }
}
