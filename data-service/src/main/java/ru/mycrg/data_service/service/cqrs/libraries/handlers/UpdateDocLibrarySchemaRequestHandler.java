package ru.mycrg.data_service.service.cqrs.libraries.handlers;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.entity.DocumentLibrary;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.DocumentLibraryRepository;
import ru.mycrg.data_service.service.cqrs.libraries.requests.UpdateDocLibrarySchemaRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.IMasterResourceProtector;
import ru.mycrg.data_service.service.resources.protectors.MasterResourceProtector;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import static java.time.LocalDateTime.now;
import static ru.mycrg.data_service.util.JsonConverter.toJsonNode;

@Component
public class UpdateDocLibrarySchemaRequestHandler implements IRequestHandler<UpdateDocLibrarySchemaRequest, Voidy> {

    private final IMasterResourceProtector resourceProtector;
    private final DocumentLibraryRepository libraryRepository;

    public UpdateDocLibrarySchemaRequestHandler(MasterResourceProtector resourceProtector,
                                                DocumentLibraryRepository libraryRepository) {
        this.resourceProtector = resourceProtector;
        this.libraryRepository = libraryRepository;
    }

    @Override
    @Transactional
    public Voidy handle(UpdateDocLibrarySchemaRequest request) {
        ResourceQualifier qualifier = request.getQualifier();
        SchemaDto newSchema = request.getSchema();

        if (!resourceProtector.isEditAllowed(qualifier)) {
            throw new ForbiddenException(
                    "Недостаточно прав для редактирования схемы библиотеки документов: " + qualifier.getQualifier());
        }

        DocumentLibrary library = libraryRepository
                .findByTableName(qualifier.getTable())
                .orElseThrow(() -> new NotFoundException(qualifier.getQualifier()));

        library.setLastModified(now());
        library.setSchema(toJsonNode(newSchema));

        libraryRepository.save(library);

        return new Voidy();
    }
}
