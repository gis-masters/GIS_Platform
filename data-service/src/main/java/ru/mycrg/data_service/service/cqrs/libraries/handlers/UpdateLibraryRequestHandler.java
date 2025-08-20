package ru.mycrg.data_service.service.cqrs.libraries.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.ddl.columns.DdlColumnBase;
import ru.mycrg.data_service.dto.LibraryUpdateDto;
import ru.mycrg.data_service.entity.DocumentLibrary;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.DocumentLibraryRepository;
import ru.mycrg.data_service.service.cqrs.libraries.requests.UpdateLibraryRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.IMasterResourceProtector;
import ru.mycrg.data_service.service.resources.protectors.MasterResourceProtector;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import javax.transaction.Transactional;
import java.time.LocalDateTime;

import static java.util.Objects.nonNull;

@Component
public class UpdateLibraryRequestHandler implements IRequestHandler<UpdateLibraryRequest, Voidy> {

    private final Logger log = LoggerFactory.getLogger(UpdateLibraryRequestHandler.class);

    private final DdlColumnBase ddlColumnBase;
    private final IMasterResourceProtector resourceProtector;
    private final DocumentLibraryRepository libraryRepository;

    public UpdateLibraryRequestHandler(DdlColumnBase ddlColumnBase,
                                       MasterResourceProtector resourceProtector,
                                       DocumentLibraryRepository libraryRepository) {
        this.ddlColumnBase = ddlColumnBase;
        this.resourceProtector = resourceProtector;
        this.libraryRepository = libraryRepository;
    }

    @Override
    @Transactional
    public Voidy handle(UpdateLibraryRequest request) {
        ResourceQualifier qualifier = request.getLibraryQualifier();
        LibraryUpdateDto updateDto = request.getLibraryUpdateDto();

        resourceProtector.throwIfNotExist(qualifier);
        if (!resourceProtector.isEditAllowed(qualifier)) {
            throw new ForbiddenException(
                    "Недостаточно прав для редактирования библиотеки документов: " + qualifier.getQualifier());
        }

        DocumentLibrary library = libraryRepository
                .findByTableName(qualifier.getTable())
                .orElseThrow(() -> new NotFoundException(qualifier.getQualifier()));

        if (nonNull(updateDto.getTitle())) {
            library.setTitle(updateDto.getTitle());
        }

        if (nonNull(updateDto.getDetails())) {
            library.setDetails(updateDto.getDetails());
        }

        if (updateDto.isReadyForFts() != null) {
            library.setReadyForFts(updateDto.isReadyForFts());
        }

        Boolean versioned = updateDto.isVersioned();
        if (versioned != null) {
            if (versioned) {
                library.setVersioned(true);

                ddlColumnBase.add(qualifier, "versions", "jsonb");
            } else {
                library.setVersioned(false);
            }
        }

        library.setLastModified(LocalDateTime.now());

        libraryRepository.save(library);

        return new Voidy();
    }
}
