package ru.mycrg.data_service.service.smev3.request;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import io.minio.Result;
import io.minio.messages.Item;
import org.apache.commons.io.FilenameUtils;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.common_contracts.generated.data_service.TaskLogDto;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dao.detached.TasksDetachedDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.FileResourceQualifier;
import ru.mycrg.data_service.dto.LibraryModel;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.dto.record.RecordEntity;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.repository.DocumentLibraryRepository;
import ru.mycrg.data_service.repository.FileRepository;
import ru.mycrg.data_service.service.MinioService;
import ru.mycrg.data_service.service.TaskLogService;
import ru.mycrg.data_service.service.binary_analyzers.SimpleIntentHandler;
import ru.mycrg.data_service.service.files.FileService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.schemas.ISchemaTemplateService;
import ru.mycrg.data_service.service.smev3.SmevMessageSenderService;
import ru.mycrg.data_service.service.smev3.SmevMessageService;
import ru.mycrg.data_service.service.smev3.config.Smev3Config;
import ru.mycrg.data_service.service.smev3.model.CustomMultipartFile;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service.util.JsonConverter;
import ru.mycrg.data_service.util.xml.XmlMarshaller;
import ru.mycrg.data_service_contract.dto.FileDescription;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.TypeDocumentData;
import ru.mycrg.data_service_contract.enums.TaskStatus;

import javax.xml.bind.JAXBException;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import static java.nio.charset.StandardCharsets.UTF_8;
import static ru.mycrg.data_service.config.CrgCommonConfig.SYSTEM_DATETIME_PATTERN;
import static ru.mycrg.data_service.config.CrgCommonConfig.SYSTEM_USER_ID;
import static ru.mycrg.data_service.dto.Roles.OWNER;
import static ru.mycrg.data_service.service.TaskService.*;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.*;
import static ru.mycrg.data_service.service.smev3.fields.FieldsSection.DL_DATA_SECTION_DELIVERY_DATA_TABLE;
import static ru.mycrg.data_service.service.smev3.fields.FieldsSection.TABLE_13;
import static ru.mycrg.data_service.service.storage.FileStorageUtil.generateFileName;
import static ru.mycrg.data_service.util.JsonConverter.mapper;
import static ru.mycrg.data_service.util.JsonConverter.toJsonNode;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.*;
import static ru.mycrg.data_service_contract.enums.TaskIntermediateStatus.*;
import static ru.mycrg.data_service_contract.enums.TaskStatus.*;
import static ru.mycrg.data_service_contract.enums.TaskType.CUSTOM;

public abstract class AcceptServiceBase {

    private static final Logger log = LoggerFactory.getLogger(AcceptServiceBase.class);

    protected static final String DATA_SECTION_KEY_DATA_CONNECTION_ATTRIBUTE = "data_section_key_data_connection";
    public static final String INBOX_DATA_KEY_DATA_CONNECTION_ATTRIBUTE = "inbox_data_key_data_connection";
    public static final String INBOX_LIBRARY_ID = "dl_data_inbox_data";
    public static final String TASK_ALLOCATION_LIBRARY_ID = "dl_data_task_allocation";
    protected static final String DATE_ATTRIBUTE = "date";
    protected static final String DUE_DATE_ATTRIBUTE = "due_date";
    protected static final String NUMBER_ATTRIBUTE = "number";
    protected static final String GOAL = "goal";
    protected static final String CADASTRAL_NUMBER = "cadastral_number";
    protected static final String PERMIT_NUMBER = "permits_data_number";
    protected static final String FILE_ATTRIBUTE = "file";
    protected static final String RECORD_STATUS_ATTRIBUTE = "record_status";
    protected static final String USER_NAME_ATTRIBUTE = "user_name";
    protected static final String LIBRARY_DOC_ATTRIBUTE = "library_doc";
    protected static final String PERSON_NAME_ATTRIBUTE = "person_name";
    protected static final String PERFORMER_ATTRIBUTE = "performer";
    protected static final String REQUEST_TYPE_ATTRIBUTE = "request_type";
    protected static final String REQUEST_TYPE = "0B.5";
    protected static final String DATA_TYPE_ATTRIBUTE = "data_type";
    protected static final String DATA_TYPE = "0Е.2";
    protected static final String EPGU_STATUS_CODE_ATTRIBUTE = "epgu_status_code";
    protected static final String DESCRIPTION_ATTRIBUTE = "description";
    protected static final String SMEV_CLIENT_ID_ATTRIBUTE = "smev_client_id";
    protected static final String SMEV_MESSAGE_ID_ATTRIBUTE = "smev_message_id";
    protected static final String PGUID_ATTRIBUTE = "pguid";
    protected static final String DEFAULT_USER_LOGIN = "arh_grad_rk@mail.ru";
    protected static final String DEFAULT_PATH = "organization_1/library_record/dl_data_inbox_data/";
    protected static final String DEFAULT_XML_FILENAME = "result.xml";
    protected static final String DEFAULT_XML_CONTENT_TYPE = "application/xml";
    protected static final String DEFAULT_WORD_FILENAME = "result.doc";
    protected static final String DEFAULT_WORD_CONTENT_TYPE = "application/msword";
    protected static final String PDF_CONTENT_TYPE = "application/pdf";
    protected static final String PDF_EXTENSION = ".pdf";
    protected static final String DOCUMENT_CODE = "electrSigFile";
    protected static final String BUILDING_PERMIT_FILENAME = "Разрешение_на_строительство";
    protected static final String MOTIVATED_DECLINE_FILENAME = "Мотивированный_отказ";
    protected final long ORGANIZATION_ID = Long.parseLong(
            DEFAULT_PATH.substring(DEFAULT_PATH.indexOf("_") + 1, DEFAULT_PATH.indexOf("/")));

    @Value("${crg-options.taskDb}")
    protected String dbName;

    @Value("${crg-options.taskManagementFolderId}")
    protected String folderId;

    protected final TaskLogService taskLogService;
    protected final TasksDetachedDao tasksDao;
    protected final SmevMessageService smevMessageService;
    protected final ISchemaTemplateService schemaService;
    protected final FileStorageService fileStorageService;
    protected final RecordsDao recordsDao;
    protected final DocumentLibraryRepository libraryRepository;
    protected final FileRepository fileRepository;
    protected final SimpleIntentHandler simpleIntentHandler;
    protected final MinioService minioService;
    protected final Smev3Config smev3Config;
    protected final FileService fileService;
    protected final SmevMessageSenderService smevMessageSenderService;
    protected final DocumentCreationService documentCreationService;

    public AcceptServiceBase(TaskLogService taskLogService,
                             TasksDetachedDao tasksDao,
                             SmevMessageService smevMessageService,
                             ISchemaTemplateService schemaService,
                             FileStorageService fileStorageService,
                             RecordsDao recordsDao,
                             DocumentLibraryRepository libraryRepository,
                             FileRepository fileRepository,
                             SimpleIntentHandler simpleIntentHandler,
                             MinioService minioService,
                             Smev3Config smev3Config,
                             FileService fileService,
                             SmevMessageSenderService smevMessageSenderService,
                             DocumentCreationService documentCreationService) {
        this.taskLogService = taskLogService;
        this.tasksDao = tasksDao;
        this.smevMessageService = smevMessageService;
        this.schemaService = schemaService;
        this.fileStorageService = fileStorageService;
        this.recordsDao = recordsDao;
        this.libraryRepository = libraryRepository;
        this.fileRepository = fileRepository;
        this.simpleIntentHandler = simpleIntentHandler;
        this.minioService = minioService;
        this.smev3Config = smev3Config;
        this.fileService = fileService;
        this.smevMessageSenderService = smevMessageSenderService;
        this.documentCreationService = documentCreationService;
    }

    @Transactional
    public <T> void acceptRequest(String body, Class<T> resultClass) throws CrgDaoException, IOException {
        T queryResult;
        try {
            queryResult = XmlMarshaller.unmarshall(body, resultClass);
        } catch (JAXBException ex) {
            log.error("Не удалось распарсить сообщение: {}", body);
            throw new BadRequestException("Не удалось распарсить сообщение: " + body);
        }

        smevMessageService.saveIncoming(body);

        List<IRecord> docRecords = getDocRecords();
        Long performerId = getPerformerId(docRecords, queryResult);
        Map<String, Object> taskContent = prepareTaskContent(performerId);

        long taskId = tasksDao.createTask(dbName, taskContent);

        createLog(getEventTypeLog(), getDescriptionLog(), taskId);

        createDocumentAndLinkToTask(queryResult, taskContent, taskId);
    }

    @Transactional
    public void updateTablesAndSendStatusMessageToSmev(Map<String, Object> task, TaskStatus taskStatus, Long taskId) {
        if (task.get(INBOX_DATA_KEY_DATA_CONNECTION_ATTRIBUTE) == null) {
            throw new BadRequestException("Блок " + INBOX_DATA_KEY_DATA_CONNECTION_ATTRIBUTE + " у задачи не заполнен");
        }

        Optional<List<TypeDocumentData>> oInboxDocs = JsonConverter.fromJson(
                String.valueOf(task.get(INBOX_DATA_KEY_DATA_CONNECTION_ATTRIBUTE)),
                new TypeReference<List<TypeDocumentData>>() {
                });
        if (oInboxDocs.isEmpty()) {
            throw new BadRequestException(
                    "Не удалось распарсить блок " + INBOX_DATA_KEY_DATA_CONNECTION_ATTRIBUTE + " у задачи");
        }

        List<TypeDocumentData> inboxDocuments = oInboxDocs.get();
        if (inboxDocuments.isEmpty()) {
            throw new BadRequestException(
                    "Пустой массив в блоке " + INBOX_DATA_KEY_DATA_CONNECTION_ATTRIBUTE + " у задачи");
        }

        Long docId = inboxDocuments.get(0).getId();
        ResourceQualifier libraryQualifier = libraryRecordQualifier(INBOX_LIBRARY_ID, docId);
        SchemaDto rnvSchema = libraryRepository
                .findByTableName(INBOX_LIBRARY_ID)
                .map(documentLibrary -> new LibraryModel(documentLibrary, OWNER.name()))
                .orElseThrow(() -> new NotFoundException("Библиотека не найдена по идентификатору: " + INBOX_LIBRARY_ID))
                .getSchema();

        IRecord docRecord = recordsDao
                .findById(libraryQualifier, rnvSchema)
                .orElseThrow(() -> new SmevRequestException("Не найден документ с id: " + docId));

        String statusMesage = null;
        if (taskStatus == IN_PROGRESS) {
            statusMesage = getStatusMessage(docRecord, taskStatus, null, null, false);
            updateTaskAndDocument(libraryQualifier, rnvSchema, taskId, taskStatus, task, false);
        }

        if (taskStatus == CANCELED) {
            statusMesage = getStatusMessage(docRecord, taskStatus, null, null, true);
            updateTaskAndDocument(libraryQualifier, rnvSchema, taskId, taskStatus, task, true);
        }

        if (taskStatus == DONE) {
            if (task.get(DATA_SECTION_KEY_DATA_CONNECTION_ATTRIBUTE) == null) {
                throw new BadRequestException("Блок data_key_data_connection у задачи не заполнен");
            }

            Optional<List<TypeDocumentData>> oDataSectionDocs = JsonConverter.fromJson(
                    String.valueOf(task.get(DATA_SECTION_KEY_DATA_CONNECTION_ATTRIBUTE)),
                    new TypeReference<List<TypeDocumentData>>() {
                    });

            if (oDataSectionDocs.isEmpty()) {
                throw new BadRequestException("Не удалось распарсить блок data_key_data_connection у задачи");
            }

            List<TypeDocumentData> dataSectionDocs = oDataSectionDocs.get();
            if (dataSectionDocs.isEmpty()) {
                throw new BadRequestException("Вы не можете поменять статус без приложенного документа");
            }

            TypeDocumentData firstDocument = dataSectionDocs.get(0);
            Long inboxDocId = firstDocument.getId();
            ResourceQualifier inboxLibraryQualifier = libraryRecordQualifier(firstDocument.getLibraryTableName(),
                                                                             inboxDocId);
            SchemaDto inboxRnvSchema = libraryRepository
                    .findByTableName(firstDocument.getLibraryTableName())
                    .map(documentLibrary -> new LibraryModel(documentLibrary, OWNER.name()))
                    .orElseThrow(() -> new NotFoundException("Библиотека не найдена по идентификатору: " +
                                                                     firstDocument.getLibraryTableName()))
                    .getSchema();
            IRecord inboxDocRecord = recordsDao
                    .findById(inboxLibraryQualifier, inboxRnvSchema)
                    .orElseThrow(() -> new SmevRequestException("Не найден документ с id: " + docId));

            if (inboxDocRecord.getAsString(FILE_ATTRIBUTE) == null) {
                throw new BadRequestException("Поле File у связанного документа не заполнено");
            }

            Optional<List<FileDescription>> oFileDescriptions = JsonConverter.fromJson(
                    inboxDocRecord.getAsString(FILE_ATTRIBUTE),
                    new TypeReference<List<FileDescription>>() {
                    });
            if (oFileDescriptions.isEmpty()) {
                throw new BadRequestException("Не удалось получить файлы для отправки");
            }

            Set<UUID> fileUUIDs = oFileDescriptions.get().stream()
                                                   .map(FileDescription::getId)
                                                   .collect(Collectors.toSet());
            File file = fileRepository.findAllByIdIn(fileUUIDs).stream()
                                      .findFirst()
                                      .orElseThrow(() -> new BadRequestException("Не найдены файлы: " + fileUUIDs));
            if (file.getEcp() == null) {
                throw new BadRequestException("Файл не подписан, id: " + file.getId());
            }

            byte[] bytes;
            String fileName = null;
            try {
                Resource resource = fileStorageService.loadFromMainStorage(file.getPath());
                String fileExtension = "." + FilenameUtils.getExtension(resource.getFile().getPath());
                if (firstDocument.getLibraryTableName().equalsIgnoreCase(TABLE_13)) {
                    fileName = getFileName() + fileExtension;
                }
                if (firstDocument.getLibraryTableName().equalsIgnoreCase(DL_DATA_SECTION_DELIVERY_DATA_TABLE)) {
                    fileName = MOTIVATED_DECLINE_FILENAME + fileExtension;
                }

                bytes = Files.readAllBytes(resource.getFile().toPath());
            } catch (Exception e) {
                throw new BadRequestException("Не удалось подготовить ресурс для загрузки в минио: " + e.getMessage());
            }

            minioService.uploadFile(fileName, bytes, smev3Config.getS3bucketOutgoing());

            if (firstDocument.getLibraryTableName().equalsIgnoreCase(TABLE_13)) {
                statusMesage = getStatusMessage(docRecord, taskStatus, fileName, file.getEcp(), false);
                updateTaskAndDocument(libraryQualifier, rnvSchema, taskId, taskStatus, task, false);
            }

            if (firstDocument.getLibraryTableName().equalsIgnoreCase(DL_DATA_SECTION_DELIVERY_DATA_TABLE)) {
                statusMesage = getStatusMessage(docRecord, CANCELED, fileName, file.getEcp(), false);
                updateTaskAndDocument(libraryQualifier, rnvSchema, taskId, CANCELED, task, false);
            }
        }

        smevMessageSenderService.sendMessage(statusMesage);
    }

    private void updateTaskAndDocument(ResourceQualifier libraryQualifier,
                                       SchemaDto rnvSchema,
                                       Long taskId,
                                       TaskStatus taskStatus,
                                       Map<String, Object> task,
                                       boolean isCanceledByUser) {
        Map<String, Object> docPayload = new HashMap<>();
        Map<String, Object> taskPayload = new HashMap<>();
        SchemaDto tasksSchema = this.schemaService
                .getSchemaByName(TASKS_SCHEMA)
                .orElseThrow(() -> new NotFoundException("Не найдена схема задач: " + TASKS_SCHEMA));

        if (taskStatus == IN_PROGRESS) {
            docPayload.put(EPGU_STATUS_CODE_ATTRIBUTE, "Заявление зарегистрировано");
            taskPayload.put(DESCRIPTION_ATTRIBUTE,
                            "Статусное Сообщение \"Заявление зарегистрировано\" отправлено в СМЭВ-3");
            taskPayload.put(TASK_STATUS_PROPERTY, IN_PROGRESS.name());
            try {
                recordsDao.updateRecordById(libraryQualifier, docPayload, rnvSchema);
                recordsDao.updateRecordById(recordQualifier(TASK_QUALIFIER, taskId), taskPayload, tasksSchema);
            } catch (Exception e) {
                throw new BadRequestException("Не удалось обновить запись в БД");
            }

            createLog("Статусное Сообщение \"Заявление зарегистрировано\" отправлено в СМЭВ-3",
                      "Статусное Сообщение \"Заявление зарегистрировано\" отправлено в СМЭВ-3", taskId);
        }

        if (taskStatus == DONE) {
            docPayload.put(EPGU_STATUS_CODE_ATTRIBUTE, "Выполнено");
            docPayload.put(USER_NAME_ATTRIBUTE, "Губченко Андрей Владимирович");
            docPayload.put(RECORD_STATUS_ATTRIBUTE, "1.А.2");

            taskPayload.put(DESCRIPTION_ATTRIBUTE, " Ответ отправлен в ГосУслуги");
            taskPayload.put(TASK_INTERMEDIATE_STATUS_PROPERTY,
                            APPLICATION_REVIEW_ENDED_AND_ALLOWED.getIntermediateStatus());
            taskPayload.put(TASK_STATUS_PROPERTY, DONE.name());
            addCompleteDatesToTask(taskPayload, task);
            try {
                recordsDao.updateRecordById(libraryQualifier, docPayload, rnvSchema);
                recordsDao.updateRecordById(recordQualifier(TASK_QUALIFIER, taskId), taskPayload, tasksSchema);
            } catch (Exception e) {
                throw new BadRequestException("Не удалось обновить запись в БД");
            }

            createLog("Формируем сообщение в СМЭВ", "Формируем сообщение в СМЭВ", taskId);
        }

        if (taskStatus != CANCELED) {
            return;
        }

        if (isCanceledByUser) {
            docPayload.put(EPGU_STATUS_CODE_ATTRIBUTE, "Заявление отменено");
            docPayload.put(USER_NAME_ATTRIBUTE, "Губченко Андрей Владимирович");
            docPayload.put(RECORD_STATUS_ATTRIBUTE, "1.А.3");

            taskPayload.put(DESCRIPTION_ATTRIBUTE, "\"Заявление отменено\" отправлено в СМЭВ-3");
            taskPayload.put(TASK_STATUS_PROPERTY, CANCELED.name());

            addCompleteDatesToTask(taskPayload, task);
            try {
                recordsDao.updateRecordById(libraryQualifier, docPayload, rnvSchema);
                recordsDao.updateRecordById(recordQualifier(TASK_QUALIFIER, taskId), taskPayload, tasksSchema);
            } catch (Exception e) {
                throw new BadRequestException("Не удалось обновить запись в БД");
            }

            createLog("Статусное Сообщение \"Заявление отменено\" отправлено в СМЭВ-3",
                      "Статусное Сообщение \"Заявление отменено\" отправлено в СМЭВ-3", taskId);
        } else {
            docPayload.put(EPGU_STATUS_CODE_ATTRIBUTE, "Отказано в предоставлении услуги");
            docPayload.put(USER_NAME_ATTRIBUTE, "Губченко Андрей Владимирович");
            docPayload.put(RECORD_STATUS_ATTRIBUTE, "1.А.3");

            taskPayload.put(TASK_INTERMEDIATE_STATUS_PROPERTY,
                            APPLICATION_REVIEW_ENDED_AND_DECLINED.getIntermediateStatus());
            taskPayload.put(TASK_STATUS_PROPERTY, DONE.name());
            taskPayload.put(DESCRIPTION_ATTRIBUTE, "\"Отказано в предоставлении услуги\" отправлено в СМЭВ-3");

            addCompleteDatesToTask(taskPayload, task);
            try {
                recordsDao.updateRecordById(libraryQualifier, docPayload, rnvSchema);
                recordsDao.updateRecordById(recordQualifier(TASK_QUALIFIER, taskId), taskPayload, tasksSchema);
            } catch (Exception e) {
                throw new BadRequestException("Не удалось обновить запись в БД");
            }

            createLog("Статусное Сообщение \"Отказано в предоставлении услуги\" отправлено в СМЭВ-3",
                      "Статусное Сообщение \"Отказано в предоставлении услуги\" отправлено в СМЭВ-3", taskId);
        }
        createLog("Задача выполнена", "Задача выполнена", taskId);
    }

    private void createLog(String eventType, String description, Long taskId) {
        Map<String, Object> taskProps = new HashMap<>();
        taskProps.put(TASK_DESCRIPTION_PROPERTY, description);
        taskProps.put(CONTENT_TYPE_ID.getName(), getContentType());
        taskProps.put(TASK_TYPE_PROPERTY, CUSTOM.name());
        taskProps.put(TASK_STATUS_PROPERTY, TaskStatus.CREATED);
        taskProps.put(TASK_OWNER_ID_PROPERTY, Long.valueOf("2"));

        taskLogService.create(new TaskLogDto(eventType, taskId, SYSTEM_USER_ID), taskProps);
    }

    protected abstract List<IRecord> getDocRecords();

    protected abstract <T> Long getPerformerId(List<IRecord> docRecords, T queryResult);

    protected abstract String getContentType();

    protected abstract String getDocumentPath();

    protected abstract String getTitle();

    protected abstract String getFileName();

    protected abstract String getEventTypeLog();

    protected abstract String getDescriptionLog();

    protected abstract <T> void addAdditionalFields(T queryResult, Map<String, Object> documentPayload);

    protected abstract void addDueDateToTask(Map<String, Object> taskPayload);

    protected abstract <T> String getPermitNumber(T queryResult);

    protected abstract <T> String getFullFio(T queryResult);

    protected abstract <T> String getCurrentDate(T queryResult);

    protected abstract <T> String getMessageId(T queryResult);

    protected abstract <T> String getClientId(T queryResult);

    protected abstract <T> long getOrderId(T queryResult);

    protected abstract <T> String marshallQueryResult(T queryResult);

    protected abstract <T> XWPFDocument getWordDocument(T queryResult);

    protected abstract String getStatusMessage(IRecord docRecord, TaskStatus taskStatus, String fileName,
                                               byte[] ecp, boolean isCanceledByUser);

    protected abstract <T> List<String> getAttachIds(T queryResult);

    protected abstract <T> List<MultipartFile> getFiles(T queryResult,
                                                        Map<String, byte[]> map);

    private void collectFilesToFileDescriptionList(List<MultipartFile> files,
                                                   FileResourceQualifier fileResQualifier,
                                                   ResourceQualifier resourceQualifier,
                                                   List<FileDescription> fileDescriptions) {
        List<File> filesAndSignatures = new ArrayList<>();
        for (MultipartFile multipartFile: files) {
            String filename = generateFileName(multipartFile.getOriginalFilename());
            String path = fileStorageService.copyToTrash(multipartFile, filename);
            String intents = simpleIntentHandler.defineIntent(multipartFile);

            JsonNode jsonNode = toJsonNode(fileResQualifier);
            path = fileStorageService
                    .moveToMainStorage(Paths.get(path),
                                       Paths.get(DEFAULT_PATH + filename),
                                       ORGANIZATION_ID)
                    .normalize().toString();
            File file = new File(multipartFile, intents, path, DEFAULT_USER_LOGIN);
            File savedEntity = fileRepository.save(file);
            UUID savedEntityId = savedEntity.getId();

            String type = resourceQualifier.getType().name();
            fileRepository.setQualifier(type, jsonNode, Set.of(savedEntityId));
            savedEntity.setResourceQualifier(jsonNode);
            savedEntity.setResourceType(type);
            filesAndSignatures.add(savedEntity);
        }

        List<File> baseFiles = fileService.checkSignatures(filesAndSignatures);
        for (File file: baseFiles) {
            FileDescription fileDescription = new FileDescription(file.getId(), file.getTitle(), file.getSize());
            fileDescriptions.add(fileDescription);
        }
    }

    private <T> Map<String, byte[]> uploadRequestAttaches(T queryResult) {
        Map<String, byte[]> filesAsBytes = new HashMap<>();

        try {
            for (String id: getAttachIds(queryResult)) {
                Iterable<Result<Item>> objects = minioService.getListObjects(id + "/",
                                                                             smev3Config.getS3bucketIncoming());
                String lowerFolderName = objects.iterator().next().get().objectName();
                Iterable<Result<Item>> results1 = minioService.getListObjects(lowerFolderName,
                                                                              smev3Config.getS3bucketIncoming());
                String fileName = results1.iterator().next().get().objectName();
                byte[] fileBytes = minioService.getFile(
                        fileName,
                        smev3Config.getS3bucketIncoming());

                try (ZipInputStream zis = new ZipInputStream(new ByteArrayInputStream(fileBytes))) {
                    ZipEntry entry;
                    while ((entry = zis.getNextEntry()) != null) {
                        ByteArrayOutputStream bos = new ByteArrayOutputStream();
                        byte[] buffer = new byte[1024];
                        int len;
                        while ((len = zis.read(buffer)) > 0) {
                            bos.write(buffer, 0, len);
                        }
                        filesAsBytes.put(entry.getName(), bos.toByteArray());
                        zis.closeEntry();
                    }
                }
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new SmevRequestException("Не удалось загрузить вложения");
        }

        return filesAsBytes;
    }

    private Map<String, Object> prepareTaskContent(Long performerId) {
        Map<String, Object> taskProps = new HashMap<>();
        taskProps.put(TASK_TYPE_PROPERTY, CUSTOM.name());
        taskProps.put(TASK_STATUS_PROPERTY, TaskStatus.CREATED.name());
        taskProps.put(TASK_INTERMEDIATE_STATUS_PROPERTY, APPLICATION_RECEIVED.getIntermediateStatus());
        taskProps.put(CONTENT_TYPE_ID.getName(), getContentType());
        taskProps.put(CREATED_AT.getName(), LocalDate.now());
        taskProps.put(TASK_OWNER_ID_PROPERTY, performerId);
        taskProps.put(TASK_ASSIGNED_TO_PROPERTY, performerId);
        addDueDateToTask(taskProps);

        return taskProps;
    }

    private <T> void createDocumentAndLinkToTask(T queryResult,
                                                 Map<String, Object> taskContent,
                                                 Long taskId) throws CrgDaoException, IOException {

        ResourceQualifier rnvLibraryQualifier = libraryQualifier(INBOX_LIBRARY_ID);
        LibraryModel rnvLibraryModel = libraryRepository
                .findByTableName(INBOX_LIBRARY_ID)
                .map(documentLibrary -> new LibraryModel(documentLibrary, OWNER.name()))
                .orElseThrow(() -> new NotFoundException("Библиотека не найдена по идентификатору: "
                                                                 + INBOX_LIBRARY_ID));
        SchemaDto rnvSchema = rnvLibraryModel.getSchema();
        if (rnvSchema == null) {
            throw new NotFoundException("Не удалось получить схему из библиотеки " + INBOX_LIBRARY_ID);
        }
        Map<String, Object> documentPayload = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");

        String fullFio = getFullFio(queryResult);
        documentPayload.put(RECORD_STATUS_ATTRIBUTE, "1.А.1");
        documentPayload.put(DATE_ATTRIBUTE, LocalDate.parse(getCurrentDate(queryResult), formatter));
        documentPayload.put(PERSON_NAME_ATTRIBUTE, fullFio);
        documentPayload.put(REQUEST_TYPE_ATTRIBUTE, REQUEST_TYPE);
        documentPayload.put(DATA_TYPE_ATTRIBUTE, DATA_TYPE);
        documentPayload.put(TITLE.getName(), getTitle() + " от " + fullFio);
        documentPayload.put(CONTENT_TYPE_ID.getName(), getContentType());
        documentPayload.put(IS_FOLDER.getName(), false);
        documentPayload.put(PATH.getName(), getDocumentPath());
        documentPayload.put(SMEV_MESSAGE_ID_ATTRIBUTE, getMessageId(queryResult));
        documentPayload.put(SMEV_CLIENT_ID_ATTRIBUTE, getClientId(queryResult));
        documentPayload.put(PGUID_ATTRIBUTE, String.valueOf(getOrderId(queryResult)));
        String permitNumber = getPermitNumber(queryResult);
        if (!permitNumber.equals("")) {
            documentPayload.put(LIBRARY_DOC_ATTRIBUTE, createLibraryDocJson(permitNumber));
        }
        addAdditionalFields(queryResult, documentPayload);

        RecordEntity document = new RecordEntity(documentPayload);
        IRecord savedDocument = recordsDao.addRecord(rnvLibraryQualifier, document, rnvSchema);
        Long savedDocumentId = savedDocument.getId();
        String savedDocumentTitle = savedDocument.getTitle();

        List<FileDescription> fileDescriptions = new ArrayList<>();
        FileResourceQualifier fileResQualifier = new FileResourceQualifier(rnvLibraryQualifier.getSchema(),
                                                                           rnvLibraryQualifier.getTable(),
                                                                           savedDocumentId,
                                                                           FILE_ATTRIBUTE);
        JsonNode jsonNode = toJsonNode(fileResQualifier);
        ResourceQualifier fileQualifier = fieldQualifier(rnvLibraryQualifier, savedDocumentId, FILE_ATTRIBUTE);
        String type = fileQualifier.getType().name();
        ByteArrayOutputStream wordDocumentOutputStream = null;
        XWPFDocument wordDocument = getWordDocument(queryResult);
        if (wordDocument != null) {
            wordDocumentOutputStream = new ByteArrayOutputStream();
            wordDocument.write(wordDocumentOutputStream);
        }

        if (wordDocumentOutputStream != null) {
            byte[] wordDocumentBytes = wordDocumentOutputStream.toByteArray();
            wordDocumentOutputStream.close();
            MultipartFile wordDocumentFile = new CustomMultipartFile(wordDocumentBytes,
                                                                     DEFAULT_WORD_FILENAME,
                                                                     DEFAULT_WORD_FILENAME,
                                                                     DEFAULT_WORD_CONTENT_TYPE);
            saveMultipartFile(fileDescriptions, jsonNode, type, wordDocumentFile);
        }
        MultipartFile xmlDocumentFile = new CustomMultipartFile(marshallQueryResult(queryResult).getBytes(UTF_8),
                                                                DEFAULT_XML_FILENAME,
                                                                DEFAULT_XML_FILENAME,
                                                                DEFAULT_XML_CONTENT_TYPE);
        saveMultipartFile(fileDescriptions, jsonNode, type, xmlDocumentFile);
        collectFileDescriptions(queryResult, fileResQualifier, fileQualifier, fileDescriptions);

        String jacksonData = JsonConverter.getJsonString(fileDescriptions);
        Map<String, Object> payload = savedDocument.getContent();
        payload.put(FILE_ATTRIBUTE, jacksonData);
        ResourceQualifier rnvResQualifier = ResourceQualifier.libraryRecordQualifier(INBOX_LIBRARY_ID, savedDocumentId);
        recordsDao.updateRecordById(rnvResQualifier, payload, rnvSchema);

        TypeDocumentData documentData = new TypeDocumentData(savedDocumentId, savedDocumentTitle, INBOX_LIBRARY_ID);
        taskContent.put(INBOX_DATA_KEY_DATA_CONNECTION_ATTRIBUTE, mapper.writeValueAsString(List.of(documentData)));
        SchemaDto tasksSchema = this.schemaService
                .getSchemaByName(TASKS_SCHEMA)
                .orElseThrow(() -> new NotFoundException("Не найдена схема задач: " + TASKS_SCHEMA));

        recordsDao.updateRecordById(recordQualifier(TASK_QUALIFIER, taskId), taskContent, tasksSchema);
    }

    private String createLibraryDocJson(String permitNumber) throws JsonProcessingException {
        ResourceQualifier libraryQualifier = libraryQualifier(TABLE_13);
        LibraryModel libraryModel = libraryRepository
                .findByTableName(TABLE_13)
                .map(documentLibrary -> new LibraryModel(documentLibrary, OWNER.name()))
                .orElseThrow(() -> new NotFoundException("Библиотека не найдена по идентификатору: "
                                                                 + TABLE_13));
        SchemaDto schema = libraryModel.getSchema();
        String docnumFilter = String.format("docnum = '%s'", "_fiz_" + permitNumber);
        List<TypeDocumentData> documentsData = recordsDao
                .findAll(libraryQualifier, docnumFilter, schema).stream()
                .map(iRecord -> new TypeDocumentData(iRecord.getId(), iRecord.getTitle(), TABLE_13))
                .collect(Collectors.toList());

        return JsonConverter.getJsonString(documentsData);
    }

    private <T> void collectFileDescriptions(T queryResult,
                                             FileResourceQualifier fileResQualifier,
                                             ResourceQualifier fileQualifier,
                                             List<FileDescription> fileDescriptions) {
        Map<String, byte[]> map = uploadRequestAttaches(queryResult);
        List<MultipartFile> files = getFiles(queryResult, map);
        collectFilesToFileDescriptionList(files, fileResQualifier, fileQualifier, fileDescriptions);
    }

    private void saveMultipartFile(List<FileDescription> fileDescriptions,
                                   JsonNode jsonNode,
                                   String type,
                                   MultipartFile wordDocumentFile) {
        String fileName = generateFileName(wordDocumentFile);
        String path = fileStorageService.copyToTrash(wordDocumentFile, fileName);
        String intents = simpleIntentHandler.defineIntent(wordDocumentFile);

        path = fileStorageService.moveToMainStorage(Paths.get(path),
                                                    Paths.get(DEFAULT_PATH + fileName),
                                                    ORGANIZATION_ID)
                                 .normalize().toString();
        File wordDocumentEntity = new File(wordDocumentFile, intents, path, DEFAULT_USER_LOGIN);
        File savedEntity = fileRepository.save(wordDocumentEntity);
        UUID savedEntityId = savedEntity.getId();
        String savedEntityTitle = savedEntity.getTitle();
        Long savedEntitySize = savedEntity.getSize();
        fileRepository.setQualifier(type, jsonNode, Set.of(savedEntityId));

        FileDescription fileDescription = new FileDescription(savedEntityId, savedEntityTitle, savedEntitySize);
        fileDescriptions.add(fileDescription);
    }

    private void addCompleteDatesToTask(Map<String, Object> taskPayload, Map<String, Object> oldTaskPayload) {
        String dueDateString = oldTaskPayload.get(DUE_DATE_ATTRIBUTE).toString();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(SYSTEM_DATETIME_PATTERN);
        LocalDate dueDate = LocalDateTime.parse(dueDateString, formatter).toLocalDate();
        taskPayload.put(RECORD_STATUS_ATTRIBUTE, getRecordStatus(dueDate));
        taskPayload.put(NUMBER_ATTRIBUTE, calculateOverdueDays(dueDate, LocalDate.now()));
        taskPayload.put(DATE_ATTRIBUTE, LocalDate.now());
    }

    protected LocalDate calculateDueDate(int daysForAdd) {
        LocalDate dueDate = LocalDate.now();
        int counter = 0;

        while (counter < daysForAdd) {
            dueDate = dueDate.plusDays(1);
            if (dueDate.getDayOfWeek() != DayOfWeek.SATURDAY && dueDate.getDayOfWeek() != DayOfWeek.SUNDAY) {
                counter++;
            }
        }

        return dueDate;
    }

    protected long calculateOverdueDays(LocalDate startDate, LocalDate endDate) {
        long workingDays = 0;
        LocalDate date = startDate;

        int step = startDate.isBefore(endDate) ? 1 : -1;

        while (!date.isEqual(endDate)) {
            if (date.getDayOfWeek() != DayOfWeek.SATURDAY && date.getDayOfWeek() != DayOfWeek.SUNDAY) {
                workingDays += step;
            }
            date = date.plusDays(step);
        }

        return workingDays;
    }

    protected String getRecordStatus(LocalDate dueDate) {
        return dueDate.isBefore(LocalDate.now()) ? "С нарушением срока" : "В установленный срок";
    }
}
