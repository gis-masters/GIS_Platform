package ru.mycrg.data_service.service.smev3.request.accept_rns;

import com.fasterxml.jackson.databind.JsonNode;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.accept_rns_1_0_3.QueryResult;
import ru.mycrg.data_service.accept_rns_1_0_3.RequestType;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dao.detached.TasksDetachedDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.FileResourceQualifier;
import ru.mycrg.data_service.dto.LibraryModel;
import ru.mycrg.data_service.dto.TaskLogDto;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.RecordEntity;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.DocumentLibraryRepository;
import ru.mycrg.data_service.repository.FileRepository;
import ru.mycrg.data_service.service.TaskLogService;
import ru.mycrg.data_service.service.binary_analyzers.SimpleIntentHandler;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.schemas.ISchemaTemplateService;
import ru.mycrg.data_service.service.smev3.SmevMessageService;
import ru.mycrg.data_service.service.smev3.model.CustomMultipartFile;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service.util.JsonConverter;
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
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;
import static ru.mycrg.data_service.dto.Roles.OWNER;
import static ru.mycrg.data_service.service.TaskService.*;
import static ru.mycrg.data_service.service.reestrs.Systems.SMEV_3;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.libraryQualifier;
import static ru.mycrg.data_service.service.smev3.request.get_cadastrial_plan.GetCadastrialPlanRequestService.*;
import static ru.mycrg.data_service.service.storage.FileStorageUtil.generateFileName;
import static ru.mycrg.data_service.util.JsonConverter.mapper;
import static ru.mycrg.data_service.util.JsonConverter.toJsonNode;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.*;
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
    private static final String RNS_CONTENT_TYPE = "rns_smev_rostelekom";
    private static final String STATUS_PROPERTY = "status";
    private static final String RNS_LIBRARY_ID = "dl_data_inbox_data";
    private static final String DATE_ATTRIBUTE = "date";
    private static final String FILE_ATTRIBUTE = "file";
    private static final String PERSON_NAME_ATTRIBUTE = "person_name";
    private static final String REQUEST_TYPE_ATTRIBUTE = "request_type";
    private static final String RNS_REQUEST_TYPE = "0B.5";
    private static final String DATA_TYPE_ATTRIBUTE = "data_type";
    private static final String RNS_DATA_TYPE = "0Е.2";
    private static final String RNS_TITLE = "РНС из ЕПГУ";

    @Value("${crg-options.taskDb}")
    private String dbName;
    private final TaskLogService taskLogService;
    private final TasksDetachedDao tasksDao;
    private final SmevMessageService smevMessageService;
    private final ISchemaTemplateService schemaService;
    private final FileStorageService fileStorageService;
    private final RecordsDao recordsDao;
    private final DocumentLibraryRepository libraryRepository;
    private final FileRepository fileRepository;
    private final SimpleIntentHandler simpleIntentHandler;

    public AcceptRnsService(TaskLogService taskLogService,
                            TasksDetachedDao tasksDao,
                            SmevMessageService smevMessageService,
                            ISchemaTemplateService schemaService,
                            FileStorageService fileStorageService,
                            RecordsDao recordsDao,
                            DocumentLibraryRepository libraryRepository,
                            FileRepository fileRepository,
                            SimpleIntentHandler simpleIntentHandler) {
        this.taskLogService = taskLogService;
        this.tasksDao = tasksDao;
        this.smevMessageService = smevMessageService;
        this.schemaService = schemaService;
        this.fileStorageService = fileStorageService;
        this.recordsDao = recordsDao;
        this.libraryRepository = libraryRepository;
        this.fileRepository = fileRepository;
        this.simpleIntentHandler = simpleIntentHandler;
    }

    @Transactional
    public void acceptRnsRequest(String body) throws CrgDaoException, IOException {
        QueryResult queryResult;
        try {
            JAXBContext jaxbContext = JAXBContext.newInstance(QueryResult.class);
            Unmarshaller unmarshaller = jaxbContext.createUnmarshaller();
            queryResult = (QueryResult) unmarshaller.unmarshal(new ByteArrayInputStream(body.getBytes(
                    StandardCharsets.UTF_8)));
        } catch (JAXBException ex) {
            log.error("Не удалось распарсить сообщение: {}", body);
            throw new BadRequestException("Не удалось распарсить сообщение: " + body);
        }
        RequestType request = queryResult.getMessage()
                .getRequestContent().getContent().getMessagePrimaryContent().getRequest();
        smevMessageService.saveIncoming(body);
        Map<String, Object> taskContent = prepareTaskRecord(String.valueOf(request.getService().getOrderId()));
        long taskId = tasksDao.createTask(dbName, taskContent);
        createLog("Входящее сообщение РНС успешно записано в реестр",
                  "Входящее сообщение РНС успешно записано в реестр",
                  taskId);
        createDocumentAndLinkToTask(request, taskContent, taskId);
    }

    private Map<String, Object> prepareTaskRecord(String description) {
        Map<String, Object> body = new HashMap<>();
        body.put(TASK_TYPE_PROPERTY, CUSTOM.name());
        body.put(TASK_DESCRIPTION_PROPERTY, description);
        body.put(STATUS_PROPERTY, TaskStatus.CREATED.name());
        body.put(CONTENT_TYPE_ID.getName(), RNS_CONTENT_TYPE);
        body.put(CREATED_AT.getName(), LocalDate.now());
        body.put(TASK_OWNER_ID_PROPERTY, Long.valueOf("2"));
        body.put(TASK_ASSIGNED_TO_PROPERTY, Long.valueOf("2"));

        return body;
    }

    private void createLog(String eventType, String description, Long taskId) {
        Map<String, Object> propsMap = new HashMap<>();
        propsMap.put(TASK_DESCRIPTION_PROPERTY, description);
        propsMap.put(CONTENT_TYPE_ID.getName(), RNS_CONTENT_TYPE);
        propsMap.put(TASK_TYPE_PROPERTY, CUSTOM.name());
        propsMap.put(STATUS_PROPERTY, TaskStatus.IN_PROGRESS);
        propsMap.put(TASK_OWNER_ID_PROPERTY, Long.valueOf("2"));

        taskLogService.create(new TaskLogDto(eventType, taskId), propsMap);
    }

    private void createDocumentAndLinkToTask(RequestType request, Map<String, Object> taskContent, Long taskId) throws
            CrgDaoException, IOException {
        ResourceQualifier rnsLibraryQualifier = libraryQualifier(RNS_LIBRARY_ID);
        LibraryModel rnsLibraryModel = libraryRepository
                .findByTableName(RNS_LIBRARY_ID)
                .map(documentLibrary -> new LibraryModel(documentLibrary, OWNER.name()))
                .orElseThrow(() -> new NotFoundException("Библиотека не найдена по идентификатору: "
                                                                 + RNS_LIBRARY_ID));
        SchemaDto rnsSchema = rnsLibraryModel.getSchema();
        Map<String, Object> documentPayload = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
        documentPayload.put(DATE_ATTRIBUTE, LocalDate.parse(request.getService().getCurrentDate(), formatter));
        documentPayload.put(PERSON_NAME_ATTRIBUTE, request.getRecipientPersonalData().getFullfio());
        documentPayload.put(REQUEST_TYPE_ATTRIBUTE, RNS_REQUEST_TYPE);
        documentPayload.put(DATA_TYPE_ATTRIBUTE, RNS_DATA_TYPE);
        documentPayload.put(TITLE.getName(), RNS_TITLE);
        documentPayload.put(CONTENT_TYPE_ID.getName(), RNS_CONTENT_TYPE);
        documentPayload.put(IS_FOLDER.getName(), false);
        documentPayload.put(PATH.getName(), ROOT_FOLDER_PATH);

        RecordEntity document = new RecordEntity(documentPayload);
        IRecord savedDocument = recordsDao.addRecord(rnsLibraryQualifier, document, rnsSchema);
        Long savedDocumentId = savedDocument.getId();
        String savedDocumentTitile = savedDocument.getTitle();

        XWPFDocument wordDocument = ApplicationForBuildingPermitCreator.create(request);
        ByteArrayOutputStream wordDocumentOutputStream = new ByteArrayOutputStream();
        wordDocument.write(wordDocumentOutputStream);
        byte[] wordDocumentBytes = wordDocumentOutputStream.toByteArray();
        wordDocumentOutputStream.close();
        MultipartFile wordDocumentFile = new CustomMultipartFile(wordDocumentBytes,
                                                              "result.doc",
                                                              "result.doc",
                                                              "application/msword");
        String fileName = generateFileName(wordDocumentFile);
        String path = fileStorageService.copyToTrash(wordDocumentFile,
                                                     fileName);
        String intents = simpleIntentHandler.defineIntent(wordDocumentFile);

        FileResourceQualifier fileResQualifier = new FileResourceQualifier(rnsLibraryQualifier.getSchema(),
                                                                           rnsLibraryQualifier.getTable(),
                                                                           savedDocumentId,
                                                                           FILE_ATTRIBUTE);
        JsonNode jsonNode = toJsonNode(fileResQualifier);
        path = fileStorageService
                .moveToMainStorage(Paths.get(path),
                                   Paths.get("organization_1/library_record/dl_data_inbox_data/" + fileName))
                .normalize().toString();
        File wordDocumentEntity = new File(wordDocumentFile, intents, path, SMEV_3);
        File savedEntity = fileRepository.save(wordDocumentEntity);
        UUID savedEntityId = savedEntity.getId();
        String savedEntityTitle = savedEntity.getTitle();
        Long savedEntitySize = savedEntity.getSize();
        ResourceQualifier fileQualifier = new ResourceQualifier(rnsLibraryQualifier, savedDocumentId, FILE_ATTRIBUTE);
        String type = fileQualifier.getType().name();
        fileRepository.setQualifier(type, jsonNode, Set.of(savedEntityId));

        FileDescription fileDescription = new FileDescription(savedEntityId, savedEntityTitle, savedEntitySize);
        String jacksonData = JsonConverter.getJsonString(fileDescription);
        Map<String, Object> payload = savedDocument.getContent();
        payload.put(FILE_ATTRIBUTE, List.of(jacksonData));
        ResourceQualifier rnsResQualifier = ResourceQualifier.libraryRecordQualifier(RNS_LIBRARY_ID, savedDocumentId);
        recordsDao.updateRecordById(rnsResQualifier, payload, rnsSchema);

        TypeDocumentData documentData = new TypeDocumentData(savedDocumentId, savedDocumentTitile, RNS_LIBRARY_ID);
        taskContent.put(DATA_SECTION_KEY_DATA_CONNECTION_ATTRIBUTE, mapper.writeValueAsString(List.of(documentData)));
        SchemaDto tasksSchema = this.schemaService.getSchemaByName(TASKS_SCHEMA)
                .orElseThrow(() -> new NotFoundException("Не найдена схема задач: " + TASKS_SCHEMA));
        recordsDao.updateRecordById(new ResourceQualifier(TASK_QUALIFIER, taskId), taskContent, tasksSchema);

    }
}
