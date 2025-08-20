package ru.mycrg.data_service.service.cqrs.library_records.handlers.move_records;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.SchemableRecordsDao;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.Map;

import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.PATH;

@Component
public class RecordMover implements IRecordMover {

    private final Logger log = LoggerFactory.getLogger(RecordMover.class);

    private final SchemableRecordsDao recordsDao;

    public RecordMover(SchemableRecordsDao recordsDao) {
        this.recordsDao = recordsDao;
    }

    @Override
    @Transactional
    public void move(ResourceQualifier recordToMoveQualifier,
                     ResourceQualifier targetFolderQualifier) {
        String targetFolderPath = ROOT_FOLDER_PATH;
        if (targetFolderQualifier != null) {
            targetFolderPath = recordsDao
                    .findById(targetFolderQualifier)
                    .orElseThrow(() -> new NotFoundException(targetFolderQualifier.getRecordIdAsLong()))
                    .getPathToMe();
        }

        try {
            recordsDao.updateById(recordToMoveQualifier,
                                  Map.of(PATH.getName(), targetFolderPath));
        } catch (Exception e) {
            String msg = "Не удалось переместить объект: " + recordToMoveQualifier.getRecordId();
            log.error(msg, e);

            throw new DataServiceException(msg);
        }
    }
}
