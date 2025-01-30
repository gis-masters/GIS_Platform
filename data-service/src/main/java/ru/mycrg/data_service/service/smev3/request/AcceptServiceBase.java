package ru.mycrg.data_service.service.smev3.request;

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
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dao.detached.TasksDetachedDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.FileResourceQualifier;
import ru.mycrg.data_service.dto.LibraryModel;
import ru.mycrg.data_service.dto.TaskLogDto;
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
import ru.mycrg.data_service.service.smev3.fields.CommonFields;
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
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import static java.nio.charset.StandardCharsets.UTF_8;
import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;
import static ru.mycrg.data_service.dto.Roles.OWNER;
import static ru.mycrg.data_service.service.TaskService.*;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.*;
import static ru.mycrg.data_service.service.smev3.fields.FieldsSection.TABLE_13;
import static ru.mycrg.data_service.service.smev3.fields.FieldsSection.TABLE_19;
import static ru.mycrg.data_service.service.storage.FileStorageUtil.generateFileName;
import static ru.mycrg.data_service.util.JsonConverter.mapper;
import static ru.mycrg.data_service.util.JsonConverter.toJsonNode;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.*;
import static ru.mycrg.data_service_contract.enums.TaskStatus.*;
import static ru.mycrg.data_service_contract.enums.TaskStatus.CANCELED;
import static ru.mycrg.data_service_contract.enums.TaskType.CUSTOM;

public abstract class AcceptServiceBase {

    private static final Logger log = LoggerFactory.getLogger(AcceptServiceBase.class);

    protected static final String DATA_SECTION_KEY_DATA_CONNECTION_ATTRIBUTE = "data_section_key_data_connection";
    protected static final String INBOX_DATA_KEY_DATA_CONNECTION_ATTRIBUTE = "inbox_data_key_data_connection";
    protected static final String LIBRARY_ID = "dl_data_inbox_data";
    protected static final String TASK_ALLOCATION_LIBRARY_ID = "dl_data_task_allocation";
    protected static final String DATE_ATTRIBUTE = "date";
    protected static final String GOAL = "goal";
    protected static final String CADASTRAL_NUMBER = "cadastral_number";
    protected static final String PERMIT_NUMBER = "permits_data_number";
    protected static final String FILE_ATTRIBUTE = "file";
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
    protected static final String BUILDING_PERMIT_FILENAME = "Разрешение_на_строительство_";
    protected static final String MOTIVATED_DECLINE_FILENAME = "Мотивированный_отказ_";

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

        createLog(getEventTypeLog(),
                  getDescriptionLog(),
                  taskId);

        createDocumentAndLinkToTask(queryResult, taskContent, taskId);
    }

    @Transactional
    public void updateTablesAndSendStatusMessageToSmev(Map<String, Object> task, TaskStatus taskStatus, Long taskId) {
        if (task.get(INBOX_DATA_KEY_DATA_CONNECTION_ATTRIBUTE) == null) {
            throw new BadRequestException("Блок inbox_data_key_data_connection у задачи не заполнен");
        }
        Optional<List<TypeDocumentData>> oInboxDocs = JsonConverter.fromJson(
                String.valueOf(task.get(INBOX_DATA_KEY_DATA_CONNECTION_ATTRIBUTE)),
                new TypeReference<List<TypeDocumentData>>() {
                });
        if (oInboxDocs.isEmpty()) {
            throw new BadRequestException("Не удалось распарсить блок inbox_data_key_data_connection у задачи");
        }

        List<TypeDocumentData> inboxDocuments = oInboxDocs.get();
        if (inboxDocuments.isEmpty()) {
            throw new BadRequestException("Пустой массив в блоке inbox_data_key_data_connection у задачи");
        }

        Long docId = inboxDocuments.get(0).getId();
        ResourceQualifier libraryQualifier = libraryRecordQualifier(LIBRARY_ID, docId);
        SchemaDto rnvSchema = libraryRepository
                .findByTableName(LIBRARY_ID)
                .map(documentLibrary -> new LibraryModel(documentLibrary, OWNER.name()))
                .orElseThrow(() -> new NotFoundException("Библиотека не найдена по идентификатору: " + LIBRARY_ID))
                .getSchema();

        IRecord docRecord = recordsDao
                .findById(libraryQualifier, rnvSchema)
                .orElseThrow(() -> new SmevRequestException("Не найден документ с id: " + docId));

        String statusMesage = null;
        if (taskStatus == IN_PROGRESS) {
            statusMesage = getStatusMessage(docRecord, taskStatus, null, null, null, false);
            updateTaskAndDocument(libraryQualifier, rnvSchema, taskId, taskStatus, false);
        }
        if (taskStatus == CANCELED) {
            statusMesage = getStatusMessage(docRecord, taskStatus, null, null, null, true);
            updateTaskAndDocument(libraryQualifier, rnvSchema, taskId, taskStatus, true);
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

            byte[] ecp;
            String fileName = null;
            String fileExtension;
            ecp = file.getEcp();
            try {
                Resource resource = fileStorageService.loadFromMainStorage(file.getPath());
                fileExtension = "." + FilenameUtils.getExtension(resource.getFile().getPath());
                if (firstDocument.getLibraryTableName().equalsIgnoreCase(TABLE_13)) {
                    fileName = BUILDING_PERMIT_FILENAME + UUID.randomUUID() + fileExtension;
                }
                if (firstDocument.getLibraryTableName().equalsIgnoreCase(TABLE_19)) {
                    fileName = MOTIVATED_DECLINE_FILENAME + UUID.randomUUID() + fileExtension;
                }

                minioService.uploadFile(fileName,
                                        Files.readAllBytes(resource.getFile().toPath()),
                                        smev3Config.getS3bucketOutgoing());
            } catch (Exception e) {
                throw new BadRequestException("Ошибка загрузки файла в минио: " + e.getMessage());
            }

            if (firstDocument.getLibraryTableName().equalsIgnoreCase(TABLE_13)) {
                statusMesage = getStatusMessage(docRecord, taskStatus, fileName, fileExtension, ecp, false);
                updateTaskAndDocument(libraryQualifier, rnvSchema, taskId, taskStatus, false);
            }

            if (firstDocument.getLibraryTableName().equalsIgnoreCase(TABLE_19)) {
                statusMesage = getStatusMessage(docRecord, CANCELED, fileName, fileExtension, ecp, false);
                updateTaskAndDocument(libraryQualifier, rnvSchema, taskId, CANCELED, false);
            }
        }

        smevMessageSenderService.sendMessage(statusMesage);
    }

    private void updateTaskAndDocument(ResourceQualifier libraryQualifier,
                                       SchemaDto rnvSchema,
                                       Long taskId,
                                       TaskStatus taskStatus,
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
            taskPayload.put(DESCRIPTION_ATTRIBUTE, " Ответ отправлен в ГосУслуги");
            try {
                recordsDao.updateRecordById(libraryQualifier, docPayload, rnvSchema);
                recordsDao.updateRecordById(recordQualifier(TASK_QUALIFIER, taskId), taskPayload, tasksSchema);
            } catch (Exception e) {
                throw new BadRequestException("Не удалось обновить запись в БД");
            }

            createLog("Формируем сообщение в СМЭВ", "Формируем сообщение в СМЭВ", taskId);
        }

        if (taskStatus == CANCELED) {
            if (isCanceledByUser) {
                docPayload.put(EPGU_STATUS_CODE_ATTRIBUTE, "Заявление отменено");
                taskPayload.put(DESCRIPTION_ATTRIBUTE, "\"Заявление отменено\" отправлено в СМЭВ-3");
                try {
                    recordsDao.updateRecordById(libraryQualifier, docPayload, rnvSchema);
                    recordsDao.updateRecordById(recordQualifier(TASK_QUALIFIER, taskId), taskPayload, tasksSchema);
                } catch (Exception e) {
                    throw new BadRequestException("Не удалось обновить запись в БД");
                }

                createLog("Статусное Сообщение \"Заявление отменено\" отправлено в СМЭВ-3",
                          "Статусное Сообщение \"Заявление отменено\" отправлено в СМЭВ-3", taskId);
            }
            docPayload.put(EPGU_STATUS_CODE_ATTRIBUTE, "Отказано в предоставлении услуги");
            taskPayload.put(DESCRIPTION_ATTRIBUTE, "\"Отказано в предоставлении услуги\" отправлено в СМЭВ-3");
            try {
                recordsDao.updateRecordById(libraryQualifier, docPayload, rnvSchema);
                recordsDao.updateRecordById(recordQualifier(TASK_QUALIFIER, taskId), taskPayload, tasksSchema);
            } catch (Exception e) {
                throw new BadRequestException("Не удалось обновить запись в БД");
            }

            createLog("Статусное Сообщение \"Отказано в предоставлении услуги\" отправлено в СМЭВ-3",
                      "Статусное Сообщение \"Отказано в предоставлении услуги\" отправлено в СМЭВ-3", taskId);
            createLog("Задача выполнена", "Задача выполнена", taskId);
        }
    }

    private void createLog(String eventType, String description, Long taskId) {
        Map<String, Object> propsMap = new HashMap<>();
        propsMap.put(TASK_DESCRIPTION_PROPERTY, description);
        propsMap.put(CONTENT_TYPE_ID.getName(), getContentType());
        propsMap.put(TASK_TYPE_PROPERTY, CUSTOM.name());
        propsMap.put(CommonFields.STATUS, TaskStatus.CREATED);
        propsMap.put(TASK_OWNER_ID_PROPERTY, Long.valueOf("2"));

        taskLogService.create(new TaskLogDto(eventType, taskId), propsMap);
    }

    protected abstract List<IRecord> getDocRecords();

    protected abstract <T> Long getPerformerId(List<IRecord> docRecords, T queryResult);

    protected abstract String getContentType();

    protected abstract String getDocumentPath();

    protected abstract String getTitle();

    protected abstract String getEventTypeLog();

    protected abstract String getDescriptionLog();

    protected abstract <T> void addAdditionalFields(T queryResult, Map<String, Object> documentPayload);

    protected abstract <T> String getFullFio(T queryResult);

    protected abstract <T> String getCurrentDate(T queryResult);

    protected abstract <T> String getMessageId(T queryResult);

    protected abstract <T> String getClientId(T queryResult);

    protected abstract <T> long getOrderId(T queryResult);

    protected abstract <T> String marshallQueryResult(T queryResult);

    protected abstract <T> XWPFDocument getWordDocument(T queryResult);

    protected abstract String getStatusMessage(IRecord docRecord, TaskStatus taskStatus, String fileName,
                                               String fileExtension, byte[] ecp, boolean isCanceledByUser);

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
                                       Paths.get(DEFAULT_PATH + filename))
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
        Map<String, Object> body = new HashMap<>();
        body.put(TASK_TYPE_PROPERTY, CUSTOM.name());
        body.put(CommonFields.STATUS, TaskStatus.CREATED.name());
        body.put(CONTENT_TYPE_ID.getName(), getContentType());
        body.put(CREATED_AT.getName(), LocalDate.now());
        body.put(TASK_OWNER_ID_PROPERTY, performerId);
        body.put(TASK_ASSIGNED_TO_PROPERTY, performerId);

        return body;
    }

    private <T> void createDocumentAndLinkToTask(T queryResult,
                                                 Map<String, Object> taskContent,
                                                 Long taskId) throws CrgDaoException, IOException {

        ResourceQualifier rnvLibraryQualifier = libraryQualifier(LIBRARY_ID);
        LibraryModel rnvLibraryModel = libraryRepository
                .findByTableName(LIBRARY_ID)
                .map(documentLibrary -> new LibraryModel(documentLibrary, OWNER.name()))
                .orElseThrow(() -> new NotFoundException("Библиотека не найдена по идентификатору: "
                                                                 + LIBRARY_ID));
        SchemaDto rnvSchema = rnvLibraryModel.getSchema();
        if (rnvSchema == null) {
            throw new NotFoundException("Не удалось получить схему из библиотеки " + LIBRARY_ID);
        }
        Map<String, Object> documentPayload = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");

        String fullfio = getFullFio(queryResult);
        documentPayload.put(DATE_ATTRIBUTE, LocalDate.parse(getCurrentDate(queryResult), formatter));
        documentPayload.put(PERSON_NAME_ATTRIBUTE, fullfio);
        documentPayload.put(REQUEST_TYPE_ATTRIBUTE, REQUEST_TYPE);
        documentPayload.put(DATA_TYPE_ATTRIBUTE, DATA_TYPE);
        documentPayload.put(TITLE.getName(), getTitle());
        documentPayload.put(CONTENT_TYPE_ID.getName(), getContentType());
        documentPayload.put(IS_FOLDER.getName(), false);
        documentPayload.put(PATH.getName(), getDocumentPath());
        documentPayload.put(SMEV_MESSAGE_ID_ATTRIBUTE, getMessageId(queryResult));
        documentPayload.put(SMEV_CLIENT_ID_ATTRIBUTE, getClientId(queryResult));
        documentPayload.put(PGUID_ATTRIBUTE, String.valueOf(getOrderId(queryResult)));
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
        ResourceQualifier rnvResQualifier = ResourceQualifier.libraryRecordQualifier(LIBRARY_ID, savedDocumentId);
        recordsDao.updateRecordById(rnvResQualifier, payload, rnvSchema);

        TypeDocumentData documentData = new TypeDocumentData(savedDocumentId, savedDocumentTitle, LIBRARY_ID);
        taskContent.put(INBOX_DATA_KEY_DATA_CONNECTION_ATTRIBUTE, mapper.writeValueAsString(List.of(documentData)));
        SchemaDto tasksSchema = this.schemaService
                .getSchemaByName(TASKS_SCHEMA)
                .orElseThrow(() -> new NotFoundException("Не найдена схема задач: " + TASKS_SCHEMA));
        recordsDao.updateRecordById(recordQualifier(TASK_QUALIFIER, taskId), taskContent, tasksSchema);
    }

    private <T> void collectFileDescriptions(T queryResult,
                                             FileResourceQualifier fileResQualifier,
                                             ResourceQualifier fileQualifier,
                                             List<FileDescription> fileDescriptions) {
        Map<String, byte[]> map = uploadRequestAttaches(queryResult);
        List<MultipartFile> files = getFiles(queryResult, map);
        collectFilesToFileDescriptionList(files, fileResQualifier, fileQualifier, fileDescriptions);
    }

    private void saveMultipartFile(List<FileDescription> fileDescriptions, JsonNode jsonNode, String type,
                                   MultipartFile wordDocumentFile) {
        String fileName = generateFileName(wordDocumentFile);
        String path = fileStorageService.copyToTrash(wordDocumentFile,
                                                     fileName);
        String intents = simpleIntentHandler.defineIntent(wordDocumentFile);

        path = fileStorageService
                .moveToMainStorage(Paths.get(path),
                                   Paths.get(DEFAULT_PATH + fileName))
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
}
