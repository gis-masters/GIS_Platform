package ru.mycrg.data_service.service.cqrs.table_records.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.SchemableRecordsDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.cqrs.table_records.requests.MoveRecordToNewParentRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.DocLibraryRecordsProtector;
import ru.mycrg.data_service.service.resources.protectors.IResourceProtector;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import java.util.HashMap;
import java.util.Map;

import static ru.mycrg.data_service.util.SystemLibraryAttributes.PATH;

@Component
public class MoveRecordToNewParentHandler implements IRequestHandler<MoveRecordToNewParentRequest, Voidy> {

    private final Logger log = LoggerFactory.getLogger(MoveRecordToNewParentHandler.class);

    private final SchemableRecordsDao recordsDao;
    private final IResourceProtector resourceProtector;

    public MoveRecordToNewParentHandler(DocLibraryRecordsProtector resourceProtector,
                                        SchemableRecordsDao recordsDao) {
        this.recordsDao = recordsDao;
        this.resourceProtector = resourceProtector;
    }

    @Override
    public Voidy handle(MoveRecordToNewParentRequest request) {
        ResourceQualifier recordQualifier = request.getRecordQualifier();
        ResourceQualifier parentQualifier = new ResourceQualifier(recordQualifier, request.getParentId());

        if (!resourceProtector.isEditAllowed(recordQualifier)) {
            String msg = "Нет прав на перенос записи: " + recordQualifier.getRecord();
            log.warn(msg);

            throw new ForbiddenException(msg);
        }

        if (!resourceProtector.isEditAllowed(parentQualifier)) {
            String msg = "Нет прав на редактирование каталога: " + parentQualifier.getRecord();
            log.warn(msg);

            throw new ForbiddenException(msg);
        }

        IRecord resource = recordsDao
                .findById(recordQualifier)
                .orElseThrow(() -> new NotFoundException(recordQualifier.getRecord()));

        if (resource.isFolder()) {
            throw new BadRequestException("Перемещение каталогов не доступно");
        }

        String parentPath = recordsDao
                .findById(parentQualifier)
                .orElseThrow(() -> new NotFoundException(parentQualifier.getRecord()))
                .getAsString(PATH.getName());

        Map<String, Object> properties = new HashMap<>();
        properties.put(PATH.getName(),
                       parentPath + "/" + parentQualifier.getRecord());

        try {
            recordsDao.updateRecordById(recordQualifier, properties);
        } catch (CrgDaoException e) {
            String msg = "Не удалось обновить path для записи: " + recordQualifier.getRecord();
            log.error(msg, e);

            throw new DataServiceException(msg);
        }

        return new Voidy();
    }
}
