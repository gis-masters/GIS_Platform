package ru.mycrg.data_service.service.cqrs.libraries.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.FtsDao;
import ru.mycrg.data_service.dao.ddl.tables.DdlTablesBase;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.repository.DocumentLibraryRepository;
import ru.mycrg.data_service.service.cqrs.libraries.requests.DeleteLibraryRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.IMasterResourceProtector;
import ru.mycrg.data_service.service.resources.protectors.MasterResourceProtector;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import javax.transaction.Transactional;

@Component
public class DeleteLibraryRequestHandler implements IRequestHandler<DeleteLibraryRequest, Voidy> {

    private final FtsDao ftsDao;
    private final DdlTablesBase ddlTablesBase;
    private final IMasterResourceProtector resourceProtector;
    private final DocumentLibraryRepository documentLibraryRepository;

    public DeleteLibraryRequestHandler(FtsDao ftsDao,
                                       DdlTablesBase ddlTablesBase,
                                       MasterResourceProtector resourceProtector,
                                       DocumentLibraryRepository documentLibraryRepository) {
        this.ftsDao = ftsDao;
        this.ddlTablesBase = ddlTablesBase;
        this.resourceProtector = resourceProtector;
        this.documentLibraryRepository = documentLibraryRepository;
    }

    @Transactional
    @Override
    public Voidy handle(DeleteLibraryRequest request) {
        ResourceQualifier libraryQualifier = request.getLibraryQualifier();

        if (!resourceProtector.isOwner(libraryQualifier)) {
            throw new ForbiddenException(
                    "Недостаточно прав для удаления библиотеки документов: " + libraryQualifier.getQualifier());
        }

        // Delete library from information table
        documentLibraryRepository.deleteByTableName(libraryQualifier.getTable());

        // Delete from DB
        ddlTablesBase.drop(libraryQualifier);

        // Delete data from full text search table
        ftsDao.dropSourceData(libraryQualifier);

        return new Voidy();
    }
}
