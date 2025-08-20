package ru.mycrg.data_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dao.detached.TasksDetachedDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.LibraryModel;
import ru.mycrg.common_contracts.generated.data_service.TaskLogDto;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.repository.DocumentLibraryRepository;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.config.CrgCommonConfig.SYSTEM_USER_ID;
import static ru.mycrg.data_service.service.import_.kpt.KptSourceFilesService.KPT_LIBRARY_ID;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.libraryQualifier;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.libraryRecordQualifier;
import static ru.mycrg.data_service.service.import_.kpt.ImportKptService.KPT_IMPORT_CONTENT_TYPE;
import static ru.mycrg.data_service.service.smev3.request.get_cadastrial_plan.GetCadastrialPlanRequestService.KPT_ORDER_CONTENT_TYPE;

import java.util.ArrayList;

import static ru.mycrg.data_service.util.SystemLibraryAttributes.TITLE;
import static ru.mycrg.data_service_contract.enums.TaskStatus.CANCELED;

@Service
public class CancelKptTaskService {

    private final Logger log = LoggerFactory.getLogger(CancelKptTaskService.class);

    private static final String FILE_ATTRIBUTE = "file";
    private static final String NOTE_ATTRIBUTE = "note";
    private static final String CAD_KVARTAL_ATTRIBUTE = "cad_kvartal";
    private static final String DESCRIPTION_ATTRIBUTE = "description";

    private final RecordsDao recordsDao;
    private final TasksDetachedDao tasksDao;
    private final DocumentLibraryRepository libraryRepository;
    private final TaskLogService taskLogService;

    public CancelKptTaskService(RecordsDao recordsDao,
                                TasksDetachedDao tasksDao,
                                DocumentLibraryRepository libraryRepository,
                                TaskLogService taskLogService) {
        this.recordsDao = recordsDao;
        this.tasksDao = tasksDao;
        this.libraryRepository = libraryRepository;
        this.taskLogService = taskLogService;
    }

    @Transactional
    public void cancelOldKptTasks(String databaseName, int deadlineTime) {
        try {
            List<Long> tasksForCancel = new ArrayList<>();
            tasksForCancel.addAll(tasksDao.findTasksForCancel(databaseName, deadlineTime, KPT_ORDER_CONTENT_TYPE));
            tasksForCancel.addAll(tasksDao.findTasksForCancel(databaseName, deadlineTime, KPT_IMPORT_CONTENT_TYPE));
            log.debug("Задачи к отмене: {}", tasksForCancel);

            tasksForCancel.forEach(taskId -> {
                ResourceQualifier kptQualifier = libraryQualifier(KPT_LIBRARY_ID);
                String byOrderTaskNumber = String.format("order_task_number like '%s'", taskId);
                IRecord folder = recordsDao
                        .findBy(kptQualifier, byOrderTaskNumber)
                        .orElseThrow(
                                () -> new SmevRequestException("Не найдена папка с order_task_number: " + taskId));

                LibraryModel libraryModel = libraryRepository
                        .findByTableName(KPT_LIBRARY_ID)
                        .map(LibraryModel::new)
                        .orElseThrow(() -> new NotFoundException(
                                "Не найдена библиотека КПТ: " + kptQualifier.getQualifier()));
                SchemaDto schema = libraryModel.getSchema();
                String folderFilter = String.format("path like '%s'", "/root/" + folder.getId());
                List<String> cadastrialNumbers = recordsDao
                        .findAll(kptQualifier, folderFilter, schema).stream()
                        .filter(record -> record.getContent().get(FILE_ATTRIBUTE) == null)
                        .map(record -> record.getAsString(CAD_KVARTAL_ATTRIBUTE))
                        .collect(Collectors.toList());

                Map<String, Object> folderPayload = folder.getContent();
                folderPayload.remove(TITLE.getName());
                folderPayload.put(NOTE_ATTRIBUTE,
                                  "Не пришли ответы на кадастровые номера: " + cadastrialNumbers);
                try {
                    recordsDao.updateRecordById(libraryRecordQualifier(KPT_LIBRARY_ID, folder.getId()),
                                                folderPayload,
                                                schema);
                } catch (CrgDaoException e) {
                    log.error("Не удалось обновить папку с id: {}. По причине: {}", folder.getId(),
                              e.getMessage());
                }

                Map<String, Object> logMap = new HashMap<>();
                logMap.put(DESCRIPTION_ATTRIBUTE, "Срок ожидания ответа истёк. " +
                        "Задача отменена. Если ответ всё-таки поступит, файлы будут прикреплены в библиотеке.");

                taskLogService.create(new TaskLogDto("Отмена задачи", taskId, SYSTEM_USER_ID), logMap);

                tasksDao.updateStatus(databaseName, taskId, CANCELED);
            });
        } catch (Exception e) {
            String msg = "Не удалось выполнить процесс закрытия старых КПТ задач. Причина: " + e.getMessage();
            log.error(msg);
            throw new DataServiceException(msg);
        }
    }
}
