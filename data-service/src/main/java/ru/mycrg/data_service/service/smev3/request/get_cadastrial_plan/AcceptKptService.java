package ru.mycrg.data_service.service.smev3.request.get_cadastrial_plan;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import ru.mycrg.data_service.service.smev3.config.Smev3Config;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dao.detached.TasksDetachedDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.FileResourceQualifier;
import ru.mycrg.data_service.dto.LibraryModel;
import ru.mycrg.common_contracts.generated.data_service.TaskLogDto;
import ru.mycrg.data_service.dto.record.IRecord;
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
import ru.mycrg.data_service.service.smev3.model.CustomMultipartFile;
import ru.mycrg.data_service.service.smev3.model.ProcessAdapterMessageResult;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.StringReader;
import java.time.LocalDateTime;
import java.util.*;

import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY_RECORD;
import static ru.mycrg.data_service.dto.Roles.OWNER;
import static ru.mycrg.data_service.config.CrgCommonConfig.SYSTEM_USER_ID;
import static ru.mycrg.data_service.service.import_.kpt.KptSourceFilesService.KPT_LIBRARY_ID;
import static ru.mycrg.data_service.service.reestrs.Systems.FGIS_EGRN;
import static ru.mycrg.data_service.service.reestrs.Systems.SMEV_3;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.*;
import static ru.mycrg.data_service.service.storage.FileStorageUtil.generateFileName;
import static ru.mycrg.data_service.util.JsonConverter.mapper;
import static ru.mycrg.data_service.util.JsonConverter.toJsonNode;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.*;
import static ru.mycrg.data_service_contract.enums.TaskStatus.DONE;

@Service
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class AcceptKptService {

    private static final Logger log = LoggerFactory.getLogger(AcceptKptService.class);

    private static final String DESCRIPTION_ATTRIBUTE = "description";
    private static final String FILE_ATTRIBUTE = "file";
    private static final String DATE_ORDER_COMPLETION = "date_order_completion";
    private static final String STATUS_ATTRIBUTE = "status";
    private static final String CAD_KVARTAL_ATTRIBUTE = "cad_kvartal";
    private static final String OWNER_DOC_ATTRIBUTE = "owner_doc";
    private static final String RECEIPT_TYPE_ATTRIBUTE = "receipt_type";
    private static final String ORDER_TASK_NUMBER_ATTRIBUTE = "order_task_number";
    private static final String DEFAULT_FILENAME = "result.zip";
    private static final String DEFAULT_CONTENT_TYPE = "application/zip";
    private static final String DEFAULT_FILE_FORMAT = ".zip";

    private final RecordsDao recordsDao;
    private final TasksDetachedDao tasksDetachedDao;
    private final DocumentLibraryRepository libraryRepository;
    private final FileRepository fileRepository;
    private final TaskLogService taskLogService;
    private final FileStorageService fileStorageService;
    private final FileService fileService;
    private final MinioService minioService;
    private final SimpleIntentHandler simpleIntentHandler;
    private final Smev3Config smev3Config;

    private final DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
    private final DocumentBuilder builder = factory.newDocumentBuilder();

    @Value("${crg-options.taskDb}")
    private String dbName;

    public AcceptKptService(RecordsDao recordsDao,
                            DocumentLibraryRepository libraryRepository,
                            TaskLogService taskLogService,
                            MinioService minioService,
                            FileStorageService fileStorageService,
                            SimpleIntentHandler simpleIntentHandler,
                            FileRepository fileRepository,
                            Smev3Config smev3Config,
                            FileService fileService,
                            TasksDetachedDao tasksDetachedDao) throws ParserConfigurationException {
        this.recordsDao = recordsDao;
        this.libraryRepository = libraryRepository;
        this.taskLogService = taskLogService;
        this.minioService = minioService;
        this.fileStorageService = fileStorageService;
        this.simpleIntentHandler = simpleIntentHandler;
        this.fileRepository = fileRepository;
        this.smev3Config = smev3Config;
        this.fileService = fileService;
        this.tasksDetachedDao = tasksDetachedDao;
    }

    @Transactional
    public void acceptKpt(ProcessAdapterMessageResult processResult) {
        try {
            if (!processResult.getXmlBuildMeta().getRequestXmlString().contains("PrimaryMessage")) {
                return;
            }

            UUID referenceClientId = processResult.getXmlBuildMeta().getReferenceClientId();
            String filter = String.format("order_number like '%s'", referenceClientId);
            log.debug("Reference client-id: {}", referenceClientId);
            ResourceQualifier libraryQualifier = libraryQualifier(KPT_LIBRARY_ID);
            IRecord docRecord = recordsDao
                    .findBy(libraryQualifier, filter)
                    .orElseThrow(
                            () -> new SmevRequestException("Не найден документ с order_number: " + referenceClientId));
            String docPath = docRecord.getAsString(PATH.getName());
            if (StringUtils.isEmpty(docPath)) {
                throw new SmevRequestException("Атрибут path не заполнен у найденного документа с id: "
                                                       + docRecord.getId());
            }
            int lastIndex = docPath.lastIndexOf('/');
            String folderId = docPath.substring(lastIndex + 1);
            log.debug("Найдена папка с id: {}", folderId);

            LibraryModel libraryModel = libraryRepository
                    .findByTableName(KPT_LIBRARY_ID)
                    .map(documentLibrary -> new LibraryModel(documentLibrary, OWNER.name()))
                    .orElseThrow(() -> new NotFoundException("Библиотека не найдена по идентификатору: "
                                                                     + KPT_LIBRARY_ID));
            SchemaDto schema = libraryModel.getSchema();
            ResourceQualifier folderQualifier = libraryRecordQualifier(KPT_LIBRARY_ID, Long.parseLong(folderId));
            IRecord folder = recordsDao
                    .findById(folderQualifier, schema)
                    .orElseThrow(() -> new SmevRequestException("Не найдена папка с id: " + folderId));
            String taskNumber = folder.getAsString(ORDER_TASK_NUMBER_ATTRIBUTE);
            if (!StringUtils.isNumeric(taskNumber)) {
                throw new SmevRequestException("У папки некорректно заполнен атрибут : " + ORDER_TASK_NUMBER_ATTRIBUTE
                                                       + ": " + taskNumber);
            }
            long taskId = Long.parseLong(taskNumber);
            log.debug("Найдена задача с id: {}", taskId);

            Map<String, Object> acceptLog = new HashMap<>();
            acceptLog.put(DESCRIPTION_ATTRIBUTE, "Пришёл результат для квартала " +
                    docRecord.getAsString(CAD_KVARTAL_ATTRIBUTE));
            taskLogService.create(new TaskLogDto("Получение ответа", taskId, SYSTEM_USER_ID), acceptLog);

            Document document = builder
                    .parse(new InputSource(new StringReader(processResult.getXmlBuildMeta().getRequestXmlString())));
            NodeList idList = document.getElementsByTagName("Id");

            uploadFileToDocument(docRecord,
                                 processResult.getXmlBuildMeta().getClientId().toString(),
                                 folderQualifier,
                                 schema,
                                 idList.item(0).getTextContent());

            Map<String, Object> attachmentLog = new HashMap<>();
            attachmentLog.put(DESCRIPTION_ATTRIBUTE, "ZIP архив прикреплён к документу " +
                    docRecord.getAsString(CAD_KVARTAL_ATTRIBUTE));
            taskLogService.create(new TaskLogDto("Добавление ответа", taskId, SYSTEM_USER_ID), attachmentLog);

            updateFolderAndTaskIfAllFileProcessed(docRecord,
                                                  folder,
                                                  libraryQualifier,
                                                  folderQualifier,
                                                  taskId,
                                                  schema);
        } catch (Exception e) {
            throw new SmevRequestException("Ошибка во время приёма КПТ :" + e.getMessage());
        }
    }

    private void uploadFileToDocument(IRecord docRecord,
                                      String clientId,
                                      ResourceQualifier qualifier,
                                      SchemaDto schema,
                                      String attachId)
            throws CrgDaoException, JsonProcessingException {
        Long docId = docRecord.getId();
        log.debug("Найден документ с id: {}", docId);
        byte[] fileBytes;
        try {
            fileBytes = minioService.getFile(clientId + "/" + DEFAULT_FILENAME, smev3Config.getS3bucketIncoming());
        } catch (BadRequestException e) {
            log.debug("AttachId: {}", attachId);
            fileBytes = minioService.getFile(attachId + "/" + clientId + "/" + DEFAULT_FILENAME,
                                             smev3Config.getS3bucketIncoming());
        }
        MultipartFile multipartFile = new CustomMultipartFile(fileBytes,
                                                              clientId + DEFAULT_FILE_FORMAT,
                                                              DEFAULT_FILENAME,
                                                              DEFAULT_CONTENT_TYPE);
        String path = fileStorageService.copyToTrash(multipartFile,
                                                     generateFileName(multipartFile.getOriginalFilename()));
        String intents = simpleIntentHandler.defineIntent(multipartFile);

        // TODO: Тут происходит чтот странное. Файлу сохранили в корзину? userLogin указали как: "СМЭВ 3" ?
        File entity = new File(multipartFile, intents, path, SMEV_3);
        File savedEntity = fileRepository.save(entity);
        ResourceQualifier fileQualifier = fieldQualifier(qualifier, docId, FILE_ATTRIBUTE);
        String type = fileQualifier.getType().name();
        FileResourceQualifier fileResQualifier = new FileResourceQualifier(qualifier.getSchema(),
                                                                           qualifier.getTable(),
                                                                           docId,
                                                                           FILE_ATTRIBUTE);
        JsonNode jsonNode = toJsonNode(fileResQualifier);
        fileRepository.setQualifier(type, jsonNode, Set.of(savedEntity.getId()));
        fileService.transferFileFromTempDirectory(savedEntity, fileQualifier, type);

        minioService.deleteFile(clientId + "/" + DEFAULT_FILENAME, smev3Config.getS3bucketIncoming());

        Map<String, Object> fileMap = new HashMap<>();
        fileMap.put(ID.getName(), savedEntity.getId().toString());
        fileMap.put(TITLE.getName(), savedEntity.getTitle());
        fileMap.put(SIZE.getName(), savedEntity.getSize());
        String jacksonData = mapper.writeValueAsString(fileMap);
        Map<String, Object> payload = docRecord.getContent();
        payload.remove(TITLE.getName());
        payload.put(FILE_ATTRIBUTE, List.of(jacksonData));
        payload.put(DATE_ORDER_COMPLETION, LocalDateTime.now());
        payload.put(OWNER_DOC_ATTRIBUTE, FGIS_EGRN);
        payload.put(RECEIPT_TYPE_ATTRIBUTE, SMEV_3);
        ResourceQualifier resourceQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME,
                                                                    KPT_LIBRARY_ID,
                                                                    docId,
                                                                    LIBRARY_RECORD);
        recordsDao.updateRecordById(resourceQualifier, payload, schema);
    }

    private void updateFolderAndTaskIfAllFileProcessed(IRecord docRecord,
                                                       IRecord folder,
                                                       ResourceQualifier libraryQualifier,
                                                       ResourceQualifier libraryRecordQualifier,
                                                       Long taskId,
                                                       SchemaDto schema) throws CrgDaoException {
        String folderFilter = String.format("path like '%s'", docRecord.getContent().get(PATH.getName()));
        boolean isAllFileProcessed = recordsDao.findAll(libraryQualifier, folderFilter, schema).stream()
                                               .allMatch(iRecord -> iRecord.getContent().get(FILE_ATTRIBUTE) != null);
        if (isAllFileProcessed) {
            Map<String, Object> folderPayload = folder.getContent();
            folderPayload.remove(TITLE.getName());
            folderPayload.put(DATE_ORDER_COMPLETION, LocalDateTime.now());
            folderPayload.put(STATUS_ATTRIBUTE, "Получено");

            recordsDao.updateRecordById(libraryRecordQualifier, folderPayload, schema);
            tasksDetachedDao.updateStatus(dbName, taskId, DONE);

            taskLogService.create(new TaskLogDto("Закрытие задачи", taskId, SYSTEM_USER_ID),
                                  Map.of(DESCRIPTION_ATTRIBUTE, "Все архивы получены"));
        }
    }
}
