package ru.mycrg.data_service.service.cqrs.library_records.handlers.move_records;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.BaseWriteDao;
import ru.mycrg.data_service.dao.SchemableRecordsDao;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import static java.sql.Types.BIGINT;
import static java.sql.Types.VARCHAR;
import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;

@Component
public class FolderMover implements IRecordMover {

    private final Logger log = LoggerFactory.getLogger(FolderMover.class);

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
        IRecord movedFolder = recordsDao
                .findById(folderToMoveQualifier)
                .orElseThrow(() -> new NotFoundException(folderToMoveQualifier.getRecordIdAsLong()));
        Long movedFolderId = movedFolder.getId();
        String movedFolderSelfPath = movedFolder.getPathToMe();

        String targetFolderSelfPath = ROOT_FOLDER_PATH;
        if (targetFolderQualifier != null) {
            targetFolderSelfPath = recordsDao
                    .findById(targetFolderQualifier)
                    .orElseThrow(() -> new NotFoundException(targetFolderQualifier.getRecordIdAsLong()))
                    .getPathToMe();
        }

        try {
            String newParentForChildren = targetFolderSelfPath + "/" + movedFolderId;

            String query = "" +
                    "UPDATE " + folderToMoveQualifier.getTableQualifier() + " " +
                    "  SET path = CASE " +
                    "                WHEN id = :movedFolderId THEN :targetFolderSelfPath " +
                    "                ELSE REPLACE(path, :movedFolderSelfPath, :newParentForChildren)" +
                    "  END" +
                    "  WHERE id = :movedFolderId OR path LIKE :movedFolderSelfPathLike";

            log.debug("Запрос на перемещение папки документов: [{}]", query);

            baseWriteDao.update(
                    query,
                    new MapSqlParameterSource()
                            .addValue("movedFolderId", movedFolderId, BIGINT)
                            .addValue("targetFolderSelfPath", targetFolderSelfPath, VARCHAR)
                            .addValue("newParentForChildren", newParentForChildren, VARCHAR)
                            .addValue("movedFolderSelfPath", movedFolderSelfPath, VARCHAR)
                            .addValue("movedFolderSelfPathLike", movedFolderSelfPath + "%", VARCHAR));
        } catch (Exception e) {
            String msg = "Не удалось выполнить перемещение каталога: " + folderToMoveQualifier.getRecordId();
            log.error("{} => {}", msg, e.getMessage(), e);

            throw new DataServiceException(msg);
        }
    }
}
