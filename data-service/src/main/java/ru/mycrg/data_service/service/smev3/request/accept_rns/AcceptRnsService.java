package ru.mycrg.data_service.service.smev3.request.accept_rns;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.sun.xml.bind.marshaller.NamespacePrefixMapper;
import io.minio.Result;
import io.minio.messages.Item;
import org.apache.commons.io.FilenameUtils;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.accept_rns_1_0_3.*;
import ru.mycrg.data_service.service.smev3.config.Smev3Config;
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
import ru.mycrg.data_service.service.smev3.fields.CommonFields;
import ru.mycrg.data_service.service.smev3.model.CustomMultipartFile;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service.util.JsonConverter;
import ru.mycrg.data_service.util.xml.XmlMarshaller;
import ru.mycrg.data_service_contract.dto.FileDescription;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.TypeDocumentData;
import ru.mycrg.data_service_contract.enums.TaskStatus;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
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
import static ru.mycrg.data_service_contract.enums.TaskType.CUSTOM;

@Service
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class AcceptRnsService {

    private static final Logger log = LoggerFactory.getLogger(AcceptRnsService.class);

    // TODO: Заменить все эти многочисленные static final String переменные на единую точку-класс, из которого будут
    //  добываться параметры, по типу MessageSource
    private static final String DATA_SECTION_KEY_DATA_CONNECTION_ATTRIBUTE = "data_section_key_data_connection";
    private static final String INBOX_DATA_KEY_DATA_CONNECTION_ATTRIBUTE = "inbox_data_key_data_connection";
    private static final String RNS_LIBRARY_ID = "dl_data_inbox_data";
    private static final String TASK_ALLOCATION_LIBRARY_ID = "dl_data_task_allocation";
    private static final String DATE_ATTRIBUTE = "date";
    private static final String FILE_ATTRIBUTE = "file";
    private static final String PERSON_NAME_ATTRIBUTE = "person_name";
    private static final String PERFORMER_ATTRIBUTE = "performer";
    private static final String REQUEST_TYPE_ATTRIBUTE = "request_type";
    private static final String RNS_REQUEST_TYPE = "0B.5";
    private static final String DATA_TYPE_ATTRIBUTE = "data_type";
    private static final String RNS_DATA_TYPE = "0Е.2";
    private static final String RNS_TITLE = "РНС из ЕПГУ";
    private static final String EPGU_STATUS_CODE_ATTRIBUTE = "epgu_status_code";
    private static final String DESCRIPTION_ATTRIBUTE = "description";
    private static final String SMEV_CLIENT_ID_ATTRIBUTE = "smev_client_id";
    private static final String SMEV_MESSAGE_ID_ATTRIBUTE = "smev_message_id";
    private static final String PGUID_ATTRIBUTE = "pguid";
    private static final String DEFAULT_USER_LOGIN = "arh_grad_rk@mail.ru";
    private static final String DEFAULT_PATH = "organization_1/library_record/dl_data_inbox_data/";
    private static final String DEFAULT_XML_FILENAME = "result.xml";
    private static final String DEFAULT_XML_CONTENT_TYPE = "application/xml";
    private static final String DEFAULT_WORD_FILENAME = "result.doc";
    private static final String DEFAULT_WORD_CONTENT_TYPE = "application/msword";
    private static final String PDF_CONTENT_TYPE = "application/pdf";
    private static final String PDF_EXTENSION = ".pdf";
    private static final String DOCUMENT_CODE = "electrSigFile";

    @Value("${crg-options.taskDb}")
    private String dbName;
    @Value("${crg-options.taskManagementFolderId}")
    private String folderId;

    private final TaskLogService taskLogService;
    private final TasksDetachedDao tasksDao;
    private final SmevMessageService smevMessageService;
    private final ISchemaTemplateService schemaService;
    private final FileStorageService fileStorageService;
    private final RecordsDao recordsDao;
    private final DocumentLibraryRepository libraryRepository;
    private final FileRepository fileRepository;
    private final SimpleIntentHandler simpleIntentHandler;
    private final MinioService minioService;
    private final Smev3Config smev3Config;
    private final FileService fileService;
    private final SmevMessageSenderService smevMessageSenderService;
    private final DocumentCreationService documentCreationService;
    private final XmlMarshaller xmlMarshaller;

    public AcceptRnsService(TaskLogService taskLogService,
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
        this.xmlMarshaller = new XmlMarshaller(new NamespacePrefixMapper() {
            @Override
            public String getPreferredPrefix(String urn, String s1, boolean b) {
                return "tns";
            }
        });
    }

    @Transactional
    public void acceptRnsRequest(String body) throws CrgDaoException, IOException {
        QueryResult queryResult;
        try {
            JAXBContext jaxbContext = JAXBContext.newInstance(QueryResult.class);
            Unmarshaller unmarshaller = jaxbContext.createUnmarshaller();
            queryResult = (QueryResult) unmarshaller.unmarshal(new ByteArrayInputStream(body.getBytes(UTF_8)));
        } catch (JAXBException ex) {
            log.error("Не удалось распарсить сообщение: {}", body);
            throw new BadRequestException("Не удалось распарсить сообщение: " + body);
        }

        smevMessageService.saveIncoming(body);

        String filter = String.format("path like '%s'", "/root/" + folderId);
        ResourceQualifier libraryQualifier = libraryQualifier(TASK_ALLOCATION_LIBRARY_ID);
        IRecord docRecord = recordsDao
                .findBy(libraryQualifier, filter)
                .orElseThrow(() -> new SmevRequestException("Не найден исполнитель по пути " + "/root/" + folderId));
        Long performerId = Long.valueOf(Objects.requireNonNull(docRecord.getAsString(PERFORMER_ATTRIBUTE)));
        Map<String, Object> taskContent = prepareTaskContent(performerId);

        long taskId = tasksDao.createTask(dbName, taskContent);

        createLog("Входящее сообщение РНС успешно записано в реестр",
                  "Входящее сообщение РНС успешно записано в реестр",
                  taskId);

        createDocumentAndLinkToTask(queryResult, taskContent, taskId);
    }

    @Transactional
    public void updateTablesAndSendStatusMessageToSmev(Map<String, Object> task, TaskStatus taskStatus, Long taskId) {
        Optional<List<TypeDocumentData>> oInboxDocs = JsonConverter.fromJson(
                task.get(INBOX_DATA_KEY_DATA_CONNECTION_ATTRIBUTE).toString(),
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
        ResourceQualifier libraryQualifier = libraryRecordQualifier(RNS_LIBRARY_ID, docId);
        SchemaDto rnsSchema = libraryRepository
                .findByTableName(RNS_LIBRARY_ID)
                .map(documentLibrary -> new LibraryModel(documentLibrary, OWNER.name()))
                .orElseThrow(() -> new NotFoundException("Библиотека не найдена по идентификатору: " + RNS_LIBRARY_ID))
                .getSchema();

        IRecord docRecord = recordsDao
                .findById(libraryQualifier, rnsSchema)
                .orElseThrow(() -> new SmevRequestException("Не найден документ с id: " + docId));

        String statusMesage = null;
        if (taskStatus == IN_PROGRESS) {
            statusMesage = buildStatusMessage(docRecord, taskStatus, null, null, null);
            updateTaskAndDocument(libraryQualifier, rnsSchema, taskId, taskStatus);
        }

        if (taskStatus == DONE) {
            Optional<List<TypeDocumentData>> oDataSectionDocs = JsonConverter.fromJson(
                    task.get(DATA_SECTION_KEY_DATA_CONNECTION_ATTRIBUTE).toString(),
                    new TypeReference<List<TypeDocumentData>>() {
                    });
            if (oDataSectionDocs.isEmpty()) {
                throw new BadRequestException("Не удалось распарсить блок data_key_data_connection у задачи");
            }

            List<TypeDocumentData> dataSectionDocs = oInboxDocs.get();
            if (dataSectionDocs.isEmpty()) {
                throw new BadRequestException("Вы не можете поменять статус без приложенного документа");
            }

            TypeDocumentData firstDocument = dataSectionDocs.get(0);
            Long inboxDocId = firstDocument.getId();
            ResourceQualifier inboxLibraryQualifier = libraryRecordQualifier(firstDocument.getLibraryTableName(),
                                                                             inboxDocId);
            SchemaDto inboxRnsSchema = libraryRepository
                    .findByTableName(firstDocument.getLibraryTableName())
                    .map(documentLibrary -> new LibraryModel(documentLibrary, OWNER.name()))
                    .orElseThrow(() -> new NotFoundException("Библиотека не найдена по идентификатору: " +
                                                                     firstDocument.getLibraryTableName()))
                    .getSchema();
            IRecord inboxDocRecord = recordsDao
                    .findById(inboxLibraryQualifier, inboxRnsSchema)
                    .orElseThrow(() -> new SmevRequestException("Не найден документ с id: " + docId));

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
            String fileName;
            String fileExtension;
            ecp = file.getEcp();
            try {
                Resource resource = fileStorageService.loadFromMainStorage(file.getPath());
                fileExtension = "." + FilenameUtils.getExtension(resource.getFile().getPath());
                fileName = "Разрешение_" + UUID.randomUUID() + fileExtension;

                minioService.uploadFile(fileName,
                                        Files.readAllBytes(resource.getFile().toPath()),
                                        smev3Config.getS3bucketOutgoing());
            } catch (Exception e) {
                throw new BadRequestException("Ошибка загрузки файла в минио: " + e.getMessage());
            }

            if (firstDocument.getLibraryTableName().equalsIgnoreCase(TABLE_13)) {
                statusMesage = buildStatusMessage(docRecord, taskStatus, fileName, fileExtension, ecp);
                updateTaskAndDocument(libraryQualifier, rnsSchema, taskId, taskStatus);
            }

            if (firstDocument.getLibraryTableName().equalsIgnoreCase(TABLE_19)) {
                statusMesage = buildStatusMessage(docRecord, CANCELED, fileName, fileExtension, ecp);
                updateTaskAndDocument(libraryQualifier, rnsSchema, taskId, CANCELED);
            }
        }

        smevMessageSenderService.sendMessage(statusMesage);
    }

    private void updateTaskAndDocument(ResourceQualifier libraryQualifier,
                                       SchemaDto rnsSchema,
                                       Long taskId,
                                       TaskStatus taskStatus) {
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
                recordsDao.updateRecordById(libraryQualifier, docPayload, rnsSchema);
                recordsDao.updateRecordById(recordQualifier(TASK_QUALIFIER, taskId), taskPayload, tasksSchema);
            } catch (Exception e) {
                throw new BadRequestException("Не удалось обновить запись в БД");
            }

            createLog("Статусное Сообщение \"Заявление зарегистрировано\" отправлено в СМЭВ-3", "Статусное Сообщение " +
                    "\"Заявление зарегистрировано\" отправлено в СМЭВ-3", taskId);
        }

        if (taskStatus == DONE) {
            docPayload.put(EPGU_STATUS_CODE_ATTRIBUTE, "Выполнено");
            taskPayload.put(DESCRIPTION_ATTRIBUTE, " Ответ отправлен в ГосУслуги");
            try {
                recordsDao.updateRecordById(libraryQualifier, docPayload, rnsSchema);
                recordsDao.updateRecordById(recordQualifier(TASK_QUALIFIER, taskId), taskPayload, tasksSchema);
            } catch (Exception e) {
                throw new BadRequestException("Не удалось обновить запись в БД");
            }

            createLog("Формируем сообщение в СМЭВ", "Формируем сообщение в СМЭВ", taskId);
        }

        if (taskStatus == CANCELED) {
            docPayload.put(EPGU_STATUS_CODE_ATTRIBUTE, "Отказано в предоставлении услуги");
            taskPayload.put(DESCRIPTION_ATTRIBUTE, "\"Отказано в предоставлении услуги\" отправлено в СМЭВ-3");
            try {
                recordsDao.updateRecordById(libraryQualifier, docPayload, rnsSchema);
                recordsDao.updateRecordById(recordQualifier(TASK_QUALIFIER, taskId), taskPayload, tasksSchema);
            } catch (Exception e) {
                throw new BadRequestException("Не удалось обновить запись в БД");
            }

            createLog("Статусное Сообщение \"Отказано в предоставлении услуги\" отправлено в СМЭВ-3",
                      "Статусное Сообщение \"Отказано в предоставлении услуги\" отправлено в СМЭВ-3", taskId);
            createLog("Задача выполнена", "Задача выполнена", taskId);
        }
    }

    private String buildStatusMessage(IRecord docRecord, TaskStatus taskStatus, String fileName,
                                      String fileExtension, byte[] ecp) {
        ClientMessage clientMessage = createClientMessage();
        ResponseMessageType responseMessageType = createResponseMessageType(docRecord);
        ResponseContentType responseContentType = new ResponseContentType();
        MessagePrimaryContent messagePrimaryContent = new MessagePrimaryContent();
        Content content = new Content();
        ChangeOrderInfoType changeOrderInfoType = new ChangeOrderInfoType();

        setChangeOrderInfo(taskStatus, docRecord, changeOrderInfoType, fileName, fileExtension, ecp, content);
        FormResponseType formResponseType = new FormResponseType();
        formResponseType.setChangeOrderInfo(changeOrderInfoType);
        messagePrimaryContent.setFormResponse(formResponseType);
        content.setMessagePrimaryContent(messagePrimaryContent);
        responseContentType.setContent(content);
        responseMessageType.setResponseContent(responseContentType);
        clientMessage.setResponseMessage(responseMessageType);

        return marshalClientMessage(clientMessage);
    }

    private ClientMessage createClientMessage() {
        ClientMessage clientMessage = new ClientMessage();
        clientMessage.setItSystem(smev3Config.getSystemMnemonic());
        return clientMessage;
    }

    private ResponseMessageType createResponseMessageType(IRecord docRecord) {
        ResponseMessageType responseMessageType = new ResponseMessageType();
        ResponseMetadataType responseMetadataType = new ResponseMetadataType();
        responseMetadataType.setClientId(UUID.randomUUID().toString());
        responseMetadataType.setReplyToClientId(docRecord.getAsString(SMEV_CLIENT_ID_ATTRIBUTE));
        responseMessageType.setResponseMetadata(responseMetadataType);
        return responseMessageType;
    }

    private void setChangeOrderInfo(TaskStatus taskStatus, IRecord docRecord,
                                    ChangeOrderInfoType changeOrderInfoType, String fileName,
                                    String fileExtension, byte[] ecp, Content content) {
        OrderIdType orderIdType = new OrderIdType();
        orderIdType.setPguId(Long.parseLong(Objects.requireNonNull(docRecord.getAsString(PGUID_ATTRIBUTE))));
        changeOrderInfoType.setOrderId(orderIdType);

        StatusCodeType statusCodeType = new StatusCodeType();
        switch (taskStatus) {
            case IN_PROGRESS:
                statusCodeType.setTechCode("1");
                changeOrderInfoType.setComment("Заявление зарегистрировано");
                break;
            case DONE:
                statusCodeType.setTechCode("3");
                changeOrderInfoType.setComment("Услуга оказана");
                addAttachmentHeader(fileName, fileExtension, ecp, content);
                break;
            case CANCELED:
                statusCodeType.setTechCode("4");
                changeOrderInfoType.setComment("Отказано в предоставлении услуги");
                addAttachmentHeader(fileName, fileExtension, ecp, content);
                break;
            default:
                throw new IllegalArgumentException("Unknown task status: " + taskStatus);
        }
        changeOrderInfoType.setStatusCode(statusCodeType);
    }

    private void addAttachmentHeader(String fileName, String fileExtension, byte[] ecp, Content content) {
        AttachmentHeaderList attachmentHeaderList = new AttachmentHeaderList();
        AttachmentHeaderType attachmentHeaderType = new AttachmentHeaderType();
        attachmentHeaderType.setId(fileName.replace("Разрешение_", "").replace(fileExtension, ""));
        attachmentHeaderType.setFilePath(fileName);
        attachmentHeaderType.setSignaturePKCS7(ecp);
        attachmentHeaderList.getAttachmentHeader().add(attachmentHeaderType);
        content.setAttachmentHeaderList(attachmentHeaderList);
    }

    private String marshalClientMessage(ClientMessage clientMessage) {
        try {
            return xmlMarshaller.marshall(clientMessage, ClientMessage.class);
        } catch (Exception e) {
            throw new SmevRequestException(
                    "Не удалось создать статусное сообщение для СМЭВ. Ошибка: " + e.getMessage());
        }
    }

    private String marshalQueryResult(QueryResult queryResult) {
        try {
            return xmlMarshaller.marshall(queryResult, QueryResult.class);
        } catch (Exception e) {
            throw new SmevRequestException(
                    "Не удалось упорядочить xml содержимое запроса. Ошибка: " + e.getMessage());
        }
    }

    private Map<String, Object> prepareTaskContent(Long performerId) {
        Map<String, Object> body = new HashMap<>();
        body.put(TASK_TYPE_PROPERTY, CUSTOM.name());
        body.put(CommonFields.STATUS, TaskStatus.CREATED.name());
        body.put(CONTENT_TYPE_ID.getName(), CommonFields.RNS_CONTENT_TYPE);
        body.put(CREATED_AT.getName(), LocalDate.now());
        body.put(TASK_OWNER_ID_PROPERTY, performerId);
        body.put(TASK_ASSIGNED_TO_PROPERTY, performerId);

        return body;
    }

    private void createLog(String eventType, String description, Long taskId) {
        Map<String, Object> propsMap = new HashMap<>();
        propsMap.put(TASK_DESCRIPTION_PROPERTY, description);
        propsMap.put(CONTENT_TYPE_ID.getName(), CommonFields.RNS_CONTENT_TYPE);
        propsMap.put(TASK_TYPE_PROPERTY, CUSTOM.name());
        propsMap.put(CommonFields.STATUS, TaskStatus.CREATED);
        propsMap.put(TASK_OWNER_ID_PROPERTY, Long.valueOf("2"));

        taskLogService.create(new TaskLogDto(eventType, taskId), propsMap);
    }

    private void createDocumentAndLinkToTask(QueryResult queryResult,
                                             Map<String, Object> taskContent,
                                             Long taskId) throws CrgDaoException, IOException {
        RequestType request = queryResult.getMessage().getRequestContent().getContent().getMessagePrimaryContent()
                                         .getRequest();

        ResourceQualifier rnsLibraryQualifier = libraryQualifier(RNS_LIBRARY_ID);
        LibraryModel rnsLibraryModel = libraryRepository
                .findByTableName(RNS_LIBRARY_ID)
                .map(documentLibrary -> new LibraryModel(documentLibrary, OWNER.name()))
                .orElseThrow(() -> new NotFoundException("Библиотека не найдена по идентификатору: "
                                                                 + RNS_LIBRARY_ID));
        SchemaDto rnsSchema = rnsLibraryModel.getSchema();
        if (rnsSchema == null) {
            throw new NotFoundException("Не удалось получить схему из библиотеки " + RNS_LIBRARY_ID);
        }
        Map<String, Object> documentPayload = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");

        String fullfio = Optional.ofNullable(request.getRecipientPersonalData())
                                 .map(RecipientPersonalDataType::getFullfio)
                                 .orElse("");
        documentPayload.put(DATE_ATTRIBUTE, LocalDate.parse(request.getService().getCurrentDate(), formatter));
        documentPayload.put(PERSON_NAME_ATTRIBUTE, fullfio);
        documentPayload.put(REQUEST_TYPE_ATTRIBUTE, RNS_REQUEST_TYPE);
        documentPayload.put(DATA_TYPE_ATTRIBUTE, RNS_DATA_TYPE);
        documentPayload.put(TITLE.getName(), RNS_TITLE);
        documentPayload.put(CONTENT_TYPE_ID.getName(), CommonFields.RNS_CONTENT_TYPE);
        documentPayload.put(IS_FOLDER.getName(), false);
        documentPayload.put(PATH.getName(), ROOT_FOLDER_PATH);
        documentPayload.put(SMEV_MESSAGE_ID_ATTRIBUTE, queryResult.getSmevMetadata().getMessageId());
        documentPayload.put(SMEV_CLIENT_ID_ATTRIBUTE, queryResult.getMessage().getRequestMetadata().getClientId());
        documentPayload.put(PGUID_ATTRIBUTE, String.valueOf(request.getService().getOrderId()));

        RecordEntity document = new RecordEntity(documentPayload);
        IRecord savedDocument = recordsDao.addRecord(rnsLibraryQualifier, document, rnsSchema);
        Long savedDocumentId = savedDocument.getId();
        String savedDocumentTitle = savedDocument.getTitle();

        List<FileDescription> fileDescriptions = new ArrayList<>();
        FileResourceQualifier fileResQualifier = new FileResourceQualifier(rnsLibraryQualifier.getSchema(),
                                                                           rnsLibraryQualifier.getTable(),
                                                                           savedDocumentId,
                                                                           FILE_ATTRIBUTE);
        JsonNode jsonNode = toJsonNode(fileResQualifier);
        ResourceQualifier fileQualifier = fieldQualifier(rnsLibraryQualifier, savedDocumentId, FILE_ATTRIBUTE);
        String type = fileQualifier.getType().name();
        ByteArrayOutputStream wordDocumentOutputStream = null;
        XWPFDocument wordDocument = documentCreationService.createDoc(request);
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
        MultipartFile xmlDocumentFile = new CustomMultipartFile(marshalQueryResult(queryResult).getBytes(UTF_8),
                                                                DEFAULT_XML_FILENAME,
                                                                DEFAULT_XML_FILENAME,
                                                                DEFAULT_XML_CONTENT_TYPE);
        saveMultipartFile(fileDescriptions, jsonNode, type, xmlDocumentFile);

        Map<String, byte[]> map = uploadRequestAttaches(
                queryResult.getMessage().getRequestContent().getContent().getAttachmentHeaderList());
        List<MultipartFile> files = new ArrayList<>();
        addFileIfNotEmpty(files, request.getDocuments().getAdditionalDocument(), map);
        addFileIfNotEmpty(files, request.getDocuments().getTitleDocLandPlot(), map);
        addFileIfNotEmpty(files, request.getDocuments().getTitleDocLandPlotSig(), map);
        addFileIfNotEmpty(files, request.getDocuments().getDecisionOwnersConstructionObject(), map);
        addFileIfNotEmpty(files, request.getDocuments().getDecisionOwnersConstructionObjectSig(), map);
        addFileIfNotEmpty(files, request.getDocuments().getDecisionMeetingOwnersApartment(), map);
        addFileIfNotEmpty(files, request.getDocuments().getDecisionMeetingOwnersApartmentSig(), map);
        addFileIfNotEmpty(files, request.getDocuments().getDecisionOwnersApartments(), map);
        addFileIfNotEmpty(files, request.getDocuments().getDecisionOwnersApartmentsSig(), map);
        addFileIfNotEmpty(files, request.getDocuments().getResaltEngineerResearch(), map);
        addFileIfNotEmpty(files, request.getDocuments().getResaltEngineerResearchSig(), map);
        addFileIfNotEmpty(files, request.getDocuments().getProjectDescriptionPartition(), map);
        addFileIfNotEmpty(files, request.getDocuments().getProjectDescriptionPartitionSig(), map);
        addFileIfNotEmpty(files, request.getDocuments().getSchemeLandPlotPartition(), map);
        addFileIfNotEmpty(files, request.getDocuments().getSchemeLandPlotPartitionSig(), map);
        addFileIfNotEmpty(files, request.getDocuments().getArchitecturalSolutionsPartition(), map);
        addFileIfNotEmpty(files, request.getDocuments().getArchitecturalSolutionsPartitionSig(), map);
        addFileIfNotEmpty(files, request.getDocuments().getConstructionProjectPartition(), map);
        addFileIfNotEmpty(files, request.getDocuments().getProjectDescriptionPartitionSig(), map);
        addFileIfNotEmpty(files, request.getDocuments().getRemovalProjectPartition(), map);
        addFileIfNotEmpty(files, request.getDocuments().getRemovalProjectPartitionSig(), map);
        addFileIfNotEmpty(files, request.getDocuments().getPositiveConclusion(), map);
        addFileIfNotEmpty(files, request.getDocuments().getPositiveConclusionSig(), map);
        addFileIfNotEmpty(files, request.getDocuments().getDelegateLegalDocFile(), map);
        addFileIfNotEmpty(files, request.getDocuments().getDelegateLegalDocSigFile(), map);
        addFileIfNotEmpty(files, request.getDocuments().getAdditionalDocFile(), map);
        addFileIfNotEmpty(files, request.getDocuments().getAdditionalDocFileSig(), map);
        addFileIfNotEmpty(files, request.getDocuments().getAdditionalDocFile2(), map);
        addFileIfNotEmpty(files, request.getDocuments().getAdditionalDocFileSig2(), map);
        addFileIfNotEmpty(files, request.getDocuments().getAdditionalDocFile3(), map);
        addFileIfNotEmpty(files, request.getDocuments().getAdditionalDocFileSig3(), map);
        addFileIfNotEmpty(files, request.getDocuments().getAdditionalDocFile4(), map);
        addFileIfNotEmpty(files, request.getDocuments().getAdditionalDocFileSig4(), map);
        addFileIfNotEmpty(files, request.getDocuments().getDelegateDocFile(), map);
        addFileIfNotEmpty(files, request.getDocuments().getDelegateDocSigFile(), map);
        collectFilesToList(files, fileResQualifier, fileQualifier, fileDescriptions);

        String jacksonData = JsonConverter.getJsonString(fileDescriptions);
        Map<String, Object> payload = savedDocument.getContent();
        payload.put(FILE_ATTRIBUTE, jacksonData);
        ResourceQualifier rnsResQualifier = ResourceQualifier.libraryRecordQualifier(RNS_LIBRARY_ID, savedDocumentId);
        recordsDao.updateRecordById(rnsResQualifier, payload, rnsSchema);

        TypeDocumentData documentData = new TypeDocumentData(savedDocumentId, savedDocumentTitle, RNS_LIBRARY_ID);
        taskContent.put(INBOX_DATA_KEY_DATA_CONNECTION_ATTRIBUTE, mapper.writeValueAsString(List.of(documentData)));
        SchemaDto tasksSchema = this.schemaService
                .getSchemaByName(TASKS_SCHEMA)
                .orElseThrow(() -> new NotFoundException("Не найдена схема задач: " + TASKS_SCHEMA));
        recordsDao.updateRecordById(recordQualifier(TASK_QUALIFIER, taskId), taskContent, tasksSchema);
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

    private Map<String, byte[]> uploadRequestAttaches(AttachmentHeaderList attachmentHeaderList) {
        Map<String, byte[]> filesAsBytes = new HashMap<>();

        try {
            for (AttachmentHeaderType attachmentHeader: attachmentHeaderList.getAttachmentHeader()) {
                Iterable<Result<Item>> objects = minioService.getListObjects(attachmentHeader.getId() + "/",
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

    private void addFileIfNotEmpty(List<MultipartFile> files, List<DocInfoType> documents, Map<String, byte[]> map) {
        if (!documents.isEmpty()) {
            for (DocInfoType doc: documents) {
                MultipartFile file = new CustomMultipartFile(
                        map.get(doc.getURL()),
                        doc.getName(),
                        doc.getName(),
                        doc.getType()
                );
                if ((doc.getCodeDocument().equalsIgnoreCase(DOCUMENT_CODE))
                        && (doc.getType().equalsIgnoreCase(PDF_CONTENT_TYPE))
                        && (doc.getName().endsWith(PDF_EXTENSION))) {
                    files.add(0, file);
                } else {
                    files.add(file);
                }
            }
        }
    }

    private void collectFilesToList(List<MultipartFile> files,
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
}
