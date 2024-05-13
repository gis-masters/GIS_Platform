package ru.mycrg.data_service.service.cqrs.library_records.handlers.move_records;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.BaseWriteDao;
import ru.mycrg.data_service.dao.SchemableRecordsDao;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import static java.sql.Types.VARCHAR;
import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;

@Component
public class FolderMover implements IRecordMover {

    private final Logger log = LoggerFactory.getLogger(RecordMover.class);

    private final SchemableRecordsDao recordsDao;
    private final BaseWriteDao baseWriteDao;

    public FolderMover(SchemableRecordsDao recordsDao,
                       BaseWriteDao baseWriteDao) {
        this.recordsDao = recordsDao;
        this.baseWriteDao = baseWriteDao;
    }

    @Override
    @Transactional
    public void move(ResourceQualifier folderToMoveQualifier,
                     ResourceQualifier targetFolderQualifier) {
        String folderToMovePath = recordsDao
                .findById(folderToMoveQualifier)
                .orElseThrow(() -> new NotFoundException(targetFolderQualifier.getRecordIdAsLong()))
                .getPath();

        String targetFolderPath = ROOT_FOLDER_PATH;
        if (targetFolderQualifier != null) {
            targetFolderPath = recordsDao
                    .findById(targetFolderQualifier)
                    .orElseThrow(() -> new NotFoundException(targetFolderQualifier.getRecordIdAsLong()))
                    .getPathToMe();
        }

        try {
            baseWriteDao.update(
                    "UPDATE " + targetFolderQualifier.getTableQualifier() + " " +
                            "  SET path = replace(path, :folderToMovePath, :targetPath)" +
                            "  WHERE path like :folderToMovePathLike",
                    new MapSqlParameterSource()
                            .addValue("targetPath", targetFolderPath, VARCHAR)
                            .addValue("folderToMovePath", folderToMovePath, VARCHAR)
                            .addValue("folderToMovePathLike", folderToMovePath + "%", VARCHAR));
        } catch (Exception e) {
            String msg = "Не удалось выполнить перемещение каталога: " + folderToMoveQualifier.getRecordId();
            log.error("{} => {}", msg, e.getMessage(), e);

            throw new DataServiceException(msg);
        }
    }
}
