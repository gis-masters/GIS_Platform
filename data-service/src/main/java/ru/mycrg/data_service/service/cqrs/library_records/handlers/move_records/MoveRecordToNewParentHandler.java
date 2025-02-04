package ru.mycrg.data_service.service.cqrs.library_records.handlers.move_records;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.SchemableRecordsDao;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.cqrs.library_records.requests.MoveRecordToNewParentRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.IMasterResourceProtector;
import ru.mycrg.data_service.service.resources.protectors.MasterResourceProtector;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import static ru.mycrg.data_service.service.resources.ResourceQualifier.libraryQualifier;

@Component
public class MoveRecordToNewParentHandler implements IRequestHandler<MoveRecordToNewParentRequest, Voidy> {

    private final Logger log = LoggerFactory.getLogger(MoveRecordToNewParentHandler.class);

    private final IRecordMover recordMover;
    private final IRecordMover folderMover;
    private final SchemableRecordsDao recordsDao;
    private final IMasterResourceProtector resourceProtector;

    public MoveRecordToNewParentHandler(IRecordMover recordMover,
                                        IRecordMover folderMover,
                                        SchemableRecordsDao recordsDao,
                                        MasterResourceProtector resourceProtector) {
        this.recordsDao = recordsDao;
        this.recordMover = recordMover;
        this.folderMover = folderMover;
        this.resourceProtector = resourceProtector;
    }

    @Override
    public Voidy handle(MoveRecordToNewParentRequest request) {
        ResourceQualifier recordToMoveQualifier = request.getRecordToMoveQualifier();

        ResourceQualifier libraryQualifier = libraryQualifier(recordToMoveQualifier.getTable());
        if (!resourceProtector.isAllowed(libraryQualifier)) {
            String msg = "Нет прав на редактирование библиотеки: " + libraryQualifier.getQualifier();
            log.warn(msg);

            throw new ForbiddenException(msg);
        }

        inspectRecordToMove(recordToMoveQualifier);

        ResourceQualifier targetRecordQualifier = request.getTargetRecordQualifier();
        if (targetRecordQualifier == null) {
            // Перемещение в корень библиотеки требует прав на редактирование
            if (!resourceProtector.isEditAllowed(libraryQualifier)) {
                String msg = "Нет прав на редактирование библиотеки: " + libraryQualifier.getQualifier();
                log.warn(msg);

                throw new ForbiddenException(msg);
            }
        } else {
            inspectTarget(targetRecordQualifier);
        }

        getMover(recordToMoveQualifier).move(recordToMoveQualifier, targetRecordQualifier);

        return new Voidy();
    }

    private void inspectTarget(ResourceQualifier targetRecordQualifier) {
        if (targetRecordQualifier == null) {
            return;
        }

        Object targetFolderId = targetRecordQualifier.getRecordId();
        if (!resourceProtector.isEditAllowed(targetRecordQualifier)) {
            String msg = "Нет прав на редактирование каталога: " + targetFolderId;
            log.warn(msg);

            throw new ForbiddenException(msg);
        }

        IRecord targetFolder = recordsDao
                .findById(targetRecordQualifier)
                .orElseThrow(() -> new NotFoundException("Не найден каталог: " + targetFolderId));
        if (!targetFolder.isFolder()) {
            throw new BadRequestException("Перемещение возможно только в каталог");
        }
    }

    private void inspectRecordToMove(ResourceQualifier recordToMoveQualifier) {
        if (!resourceProtector.isEditAllowed(recordToMoveQualifier)) {
            String msg = "Нет прав на перенос записи: " + recordToMoveQualifier.getRecordId();
            log.warn(msg);

            throw new ForbiddenException(msg);
        }
    }

    private IRecordMover getMover(ResourceQualifier recordToMoveQualifier) {
        IRecord recordToMove = recordsDao
                .findById(recordToMoveQualifier)
                .orElseThrow(() -> new NotFoundException("Не найден объект: " + recordToMoveQualifier.getRecordId()));

        return recordToMove.isFolder()
                ? folderMover
                : recordMover;
    }
}
