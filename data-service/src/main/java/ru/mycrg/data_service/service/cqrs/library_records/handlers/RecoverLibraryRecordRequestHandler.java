package ru.mycrg.data_service.service.cqrs.library_records.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.SchemableRecordsDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.cqrs.library_records.requests.RecoverLibraryRecordRequest;
import ru.mycrg.data_service.service.records.RecordServiceFactory;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.IMasterResourceProtector;
import ru.mycrg.data_service.service.resources.protectors.MasterResourceProtector;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.PATH;

@Component
public class RecoverLibraryRecordRequestHandler implements IRequestHandler<RecoverLibraryRecordRequest, Voidy> {

    private final Logger log = LoggerFactory.getLogger(RecoverLibraryRecordRequestHandler.class);

    private final RecordServiceFactory recordServiceFactory;
    private final IMasterResourceProtector resourceProtector;
    private final SchemableRecordsDao recordsDao;

    public RecoverLibraryRecordRequestHandler(RecordServiceFactory recordServiceFactory,
                                              MasterResourceProtector resourceProtector,
                                              SchemableRecordsDao recordsDao) {
        this.recordServiceFactory = recordServiceFactory;
        this.resourceProtector = resourceProtector;
        this.recordsDao = recordsDao;
    }

    @Override
    public Voidy handle(RecoverLibraryRecordRequest request) {
        ResourceQualifier rQualifier = request.getQualifier();
        Long parentFolderId = request.getParentFolderId();
        String recoverPath;

        if (parentFolderId == null) {
            ResourceQualifier lQualifier = new ResourceQualifier(rQualifier.getSchema(),
                                                                 rQualifier.getTable(),
                                                                 LIBRARY);

            if (!resourceProtector.isEditAllowed(lQualifier)) {
                String msg = "Нет прав на редактирование библиотеки: " + lQualifier.getTable();
                log.warn(msg);

                throw new ForbiddenException(msg);
            }

            recoverPath = ROOT_FOLDER_PATH;
        } else {
            ResourceQualifier parentQualifier = new ResourceQualifier(rQualifier, parentFolderId);
            if (!resourceProtector.isEditAllowed(parentQualifier)) {
                String msg = "Нет прав на восстановление документа в этот каталог: " + parentQualifier.getRecordIdAsLong();
                log.warn(msg);

                throw new ForbiddenException(msg);
            }

            String parentPath = recordsDao
                    .findById(parentQualifier)
                    .orElseThrow(() -> new NotFoundException(parentQualifier.getRecordIdAsLong()))
                    .getAsString(PATH.getName());

            recoverPath = parentPath + "/" + parentQualifier.getRecordIdAsLong();
        }

        try {
            recordServiceFactory.get().recoverRecord(rQualifier, recoverPath);
        } catch (CrgDaoException e) {
            throw new DataServiceException("Не удалось восстановить документ ", e.getCause());
        }

        return new Voidy();
    }
}
