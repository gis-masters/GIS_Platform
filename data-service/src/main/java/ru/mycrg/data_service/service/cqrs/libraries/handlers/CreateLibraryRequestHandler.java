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
import ru.mycrg.mediator.IRequestHandler;

import java.util.Objects;

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

        ddlLibrary.create(library.getTableName(), schema.getProperties());

        LibraryModel libraryModel = new LibraryModel(library);
        request.setLibraryModel(libraryModel);

        return libraryModel;
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
