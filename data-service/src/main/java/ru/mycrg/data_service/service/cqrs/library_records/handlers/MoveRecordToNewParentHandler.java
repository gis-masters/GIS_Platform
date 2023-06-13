package ru.mycrg.data_service.service.cqrs.library_records.handlers;

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
import ru.mycrg.data_service.service.cqrs.library_records.requests.MoveRecordToNewParentRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.IMasterResourceProtector;
import ru.mycrg.data_service.service.resources.protectors.MasterResourceProtector;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import java.util.HashMap;
import java.util.Map;

import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.PATH;

@Component
public class MoveRecordToNewParentHandler implements IRequestHandler<MoveRecordToNewParentRequest, Voidy> {

    private final Logger log = LoggerFactory.getLogger(MoveRecordToNewParentHandler.class);

    private final SchemableRecordsDao recordsDao;
    private final IMasterResourceProtector resourceProtector;

    public MoveRecordToNewParentHandler(MasterResourceProtector resourceProtector,
                                        SchemableRecordsDao recordsDao) {
        this.recordsDao = recordsDao;
        this.resourceProtector = resourceProtector;
    }

    @Override
    public Voidy handle(MoveRecordToNewParentRequest request) {
        ResourceQualifier recordQualifier = request.getRecordQualifier();
        if (!resourceProtector.isEditAllowed(recordQualifier)) {
            String msg = "Нет прав на перенос записи: " + recordQualifier.getRecordIdAsLong();
            log.warn(msg);

            throw new ForbiddenException(msg);
        }

        Map<String, Object> properties = new HashMap<>();
        if (request.getParentId() == null) {
            ResourceQualifier lQualifier = new ResourceQualifier(recordQualifier.getSchema(),
                                                                 recordQualifier.getTable(),
                                                                 LIBRARY);

            if (!resourceProtector.isEditAllowed(lQualifier)) {
                String msg = "Нет прав на редактирование библиотеки: " + lQualifier.getTable();
                log.warn(msg);

                throw new ForbiddenException(msg);
            }

            properties.put(PATH.getName(), ROOT_FOLDER_PATH);
        } else {
            ResourceQualifier parentQualifier = new ResourceQualifier(recordQualifier, request.getParentId());
            if (!resourceProtector.isEditAllowed(parentQualifier)) {
                String msg = "Нет прав на редактирование каталога: " + parentQualifier.getRecordIdAsLong();
                log.warn(msg);

                throw new ForbiddenException(msg);
            }

            IRecord resource = recordsDao
                    .findById(recordQualifier)
                    .orElseThrow(() -> new NotFoundException(recordQualifier.getRecordIdAsLong()));

            if (resource.isFolder()) {
                throw new BadRequestException("Перемещение каталогов недоступно");
            }

            String parentPath = recordsDao
                    .findById(parentQualifier)
                    .orElseThrow(() -> new NotFoundException(parentQualifier.getRecordIdAsLong()))
                    .getAsString(PATH.getName());

            properties.put(PATH.getName(),
                           parentPath + "/" + parentQualifier.getRecordIdAsLong());
        }

        try {
            recordsDao.updateRecordById(recordQualifier, properties);
        } catch (CrgDaoException e) {
            String msg = "Не удалось обновить path для записи: " + recordQualifier.getRecordIdAsLong();
            log.error(msg, e);

            throw new DataServiceException(msg);
        }

        return new Voidy();
    }
}
