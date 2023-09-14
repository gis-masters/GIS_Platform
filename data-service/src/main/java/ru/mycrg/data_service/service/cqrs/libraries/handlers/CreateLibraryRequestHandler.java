package ru.mycrg.data_service.service.cqrs.libraries.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.ddl.DdlLibrary;
import ru.mycrg.data_service.dto.LibraryCreateDto;
import ru.mycrg.data_service.dto.LibraryModel;
import ru.mycrg.data_service.entity.DocumentLibrary;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.DocumentLibraryRepository;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service.service.cqrs.libraries.requests.CreateLibraryRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.DocLibraryProtector;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.ValueType;
import ru.mycrg.mediator.IRequestHandler;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.util.SystemLibraryAttributes.IS_DELETED;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.VERSIONS;

@Component
public class CreateLibraryRequestHandler implements IRequestHandler<CreateLibraryRequest, LibraryModel> {

    private final SchemaService schemaService;
    private final DocumentLibraryRepository libraryRepository;
    private final IAuthenticationFacade authenticationFacade;
    private final DdlLibrary ddlLibrary;
    private final DocLibraryProtector docLibraryProtector;

    public CreateLibraryRequestHandler(SchemaService schemaService,
                                       DocumentLibraryRepository libraryRepository,
                                       IAuthenticationFacade authenticationFacade,
                                       DdlLibrary ddlLibrary,
                                       DocLibraryProtector docLibraryProtector) {
        this.schemaService = schemaService;
        this.libraryRepository = libraryRepository;
        this.authenticationFacade = authenticationFacade;
        this.ddlLibrary = ddlLibrary;
        this.docLibraryProtector = docLibraryProtector;
    }

    @Override
    public LibraryModel handle(CreateLibraryRequest request) {
        LibraryCreateDto dto = request.getLibraryCreateDto();

        String schemaId = dto.getSchemaId();
        SchemaDto schema = schemaService.getSchemaByName(schemaId)
                                        .orElseThrow(() -> new NotFoundException(
                                                "Не найдена схема библиотеки: " + schemaId));

        docLibraryProtector.throwIfExists(new ResourceQualifier(schemaId, schema.getTableName()));

        validationSchema(schema);

        DocumentLibrary library = new DocumentLibrary();
        library.setTitle(schema.getTitle());
        library.setSchemaId(schemaId);
        library.setDetails(dto.getDetails());
        library.setTableName(schema.getTableName());
        library.setCreatedBy(authenticationFacade.getLogin());
        library.setPath("/root");
        library.setVersioned(dto.isVersioned());

        libraryRepository.save(library);

        List<SimplePropertyDto> schemaProperties = schema.getProperties();
        generateSystemAttributes(schemaProperties);

        ddlLibrary.create(library.getTableName(), schemaProperties);

        LibraryModel libraryModel = new LibraryModel(library);
        request.setLibraryModel(libraryModel);

        return libraryModel;
    }

    private void generateSystemAttributes(List<SimplePropertyDto> schemaProperties) {
        List<String> schemaPropertyName = schemaProperties.stream().map(SimplePropertyDto::getName)
                                                          .collect(Collectors.toList());
        if (!schemaPropertyName.contains(VERSIONS.getName())) {
            SimplePropertyDto versions = new SimplePropertyDto();
            versions.setName(VERSIONS.getName());
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
