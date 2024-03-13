package ru.mycrg.data_service.service.cqrs.libraries.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.FtsDao;
import ru.mycrg.data_service.dao.ddl.tables.DdlTriggers;
import ru.mycrg.data_service.dto.LibraryUpdateDto;
import ru.mycrg.data_service.entity.DocumentLibrary;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.DocumentLibraryRepository;
import ru.mycrg.data_service.service.cqrs.libraries.requests.UpdateLibraryRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.IMasterResourceProtector;
import ru.mycrg.data_service.service.resources.protectors.MasterResourceProtector;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;

import static java.util.Objects.nonNull;
import static ru.mycrg.data_service.mappers.SchemaMapper.jsonToDto;
import static ru.mycrg.data_service.service.schemas.SchemaUtil.getFtsProperties;

@Component
public class UpdateLibraryRequestHandler implements IRequestHandler<UpdateLibraryRequest, Voidy> {

    private final Logger log = LoggerFactory.getLogger(UpdateLibraryRequestHandler.class);

    private final FtsDao ftsDao;
    private final DdlTriggers ddlTriggers;
    private final IMasterResourceProtector resourceProtector;
    private final DocumentLibraryRepository libraryRepository;

    public UpdateLibraryRequestHandler(FtsDao ftsDao,
                                       DdlTriggers ddlTriggers,
                                       MasterResourceProtector resourceProtector,
                                       DocumentLibraryRepository libraryRepository) {
        this.ftsDao = ftsDao;
        this.ddlTriggers = ddlTriggers;
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

            if (updateDto.isReadyForFts()) {
                log.debug("Добавляем библиотеку: '{}' к полнотекстовому поиску", qualifier.getQualifier());

                SchemaDto schema = jsonToDto(library.getSchema());
                if (schema == null) {
                    throw new BadRequestException(
                            "Не возможно обновить библиотеку. Не существует схемы для: " + qualifier.getQualifier());
                }

                List<String> ftsProperties = getFtsProperties(schema);
                ddlTriggers.createInsertTrigger(qualifier, ftsProperties);
                ddlTriggers.createUpdateTrigger(qualifier, ftsProperties);
                ddlTriggers.createDeleteTrigger(qualifier);

                ftsDao.copySourceData(qualifier, schema);
            } else {
                log.debug("Удаляем библиотеку: '{}' из полнотекстового поиска", qualifier.getQualifier());

                ddlTriggers.dropInsertTrigger(qualifier);
                ddlTriggers.dropUpdateTrigger(qualifier);
                ddlTriggers.dropDeleteTrigger(qualifier);

                ftsDao.dropSourceData(qualifier);
            }
        }

        if (updateDto.isVersioned() != null) {
            library.setVersioned(updateDto.isVersioned());
        }

        library.setLastModified(LocalDateTime.now());

        libraryRepository.save(library);

        return new Voidy();
    }
}
