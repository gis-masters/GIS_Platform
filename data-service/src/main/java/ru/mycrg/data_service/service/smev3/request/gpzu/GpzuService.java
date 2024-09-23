package ru.mycrg.data_service.service.smev3.request.gpzu;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dao.detached.TasksDetachedDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.LibraryModel;
import ru.mycrg.data_service.dto.TaskLogDto;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.dto.record.RecordEntity;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.gpzu_1_0_4.QueryResult;
import ru.mycrg.data_service.gpzu_1_0_4.RequestType;
import ru.mycrg.data_service.repository.DocumentLibraryRepository;
import ru.mycrg.data_service.service.TaskLogService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.schemas.ISchemaTemplateService;
import ru.mycrg.data_service.service.smev3.SmevMessageService;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.TypeDocumentData;
import ru.mycrg.data_service_contract.enums.TaskStatus;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;
import static ru.mycrg.data_service.dto.Roles.OWNER;
import static ru.mycrg.data_service.service.TaskService.*;
import static ru.mycrg.data_service.service.TaskService.TASK_DESCRIPTION_PROPERTY;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.libraryQualifier;
import static ru.mycrg.data_service.service.smev3.request.get_cadastrial_plan.GetCadastrialPlanRequestService.DATA_SECTION_KEY_DATA_CONNECTION_ATTRIBUTE;
import static ru.mycrg.data_service.util.JsonConverter.mapper;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.*;
import static ru.mycrg.data_service_contract.enums.TaskType.CUSTOM;

@Service
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class GpzuService {

    private static final Logger log = LoggerFactory.getLogger(GpzuService.class);

    private static final String GPZU_CONTENT_TYPE = "gpzu_smev_rostelekom";
    private static final String STATUS_PROPERTY = "status";
    private static final String GPZU_LIBRARY_ID = "dl_data_inbox_data";
    private static final String DATE_ATTRIBUTE = "date";
    private static final String PERSON_NAME_ATTRIBUTE = "person_name";
    private static final String REQUEST_TYPE_ATTRIBUTE = "request_type";
    private static final String GPZU_REQUEST_TYPE = "0B.5";
    private static final String DATA_TYPE_ATTRIBUTE = "data_type";
    private static final String GPZU_DATA_TYPE = "0Е.2";
    private static final String GPZU_TITLE = "ГПЗУ";

    private final TaskLogService taskLogService;
    private final TasksDetachedDao tasksDao;
    private final SmevMessageService smevMessageService;
    private final ISchemaTemplateService schemaService;
    private final RecordsDao recordsDao;
    private final DocumentLibraryRepository libraryRepository;

    @Value("${crg-options.taskDb}")
    private String dbName;

    public GpzuService(TaskLogService taskLogService,
                       TasksDetachedDao tasksDao,
                       SmevMessageService smevMessageService,
                       ISchemaTemplateService schemaService,
                       RecordsDao recordsDao,
                       DocumentLibraryRepository libraryRepository) {
        this.taskLogService = taskLogService;
        this.tasksDao = tasksDao;
        this.smevMessageService = smevMessageService;
        this.schemaService = schemaService;
        this.recordsDao = recordsDao;
        this.libraryRepository = libraryRepository;
    }

    public void acceptGpzuRequest(String body) throws CrgDaoException, JsonProcessingException {
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
        Map<String, Object> taskContent =  prepareTaskRecord(String.valueOf(request.getService().getOrderId()));
        long taskId = tasksDao.createTask(dbName, taskContent);
        createLog("Входящее сообщение ЕПГУ успешно записано в реестр",
                      "Входящее сообщение ЕПГУ успешно записано в реестр",
                      taskId);
        createDocumentAndLinkToTask(request, taskContent, taskId);
    }

    private Map<String, Object> prepareTaskRecord(String description) {
        Map<String, Object> body = new HashMap<>();
        body.put(TASK_TYPE_PROPERTY, CUSTOM.name());
        body.put(TASK_DESCRIPTION_PROPERTY, description);
        body.put(STATUS_PROPERTY, TaskStatus.CREATED.name());
        body.put(CONTENT_TYPE_ID.getName(), GPZU_CONTENT_TYPE);
        body.put(CREATED_AT.getName(), LocalDate.now());
        body.put(TASK_OWNER_ID_PROPERTY, Long.valueOf("2"));
        body.put(TASK_ASSIGNED_TO_PROPERTY, Long.valueOf("2"));

        return body;
    }

    private void createLog(String eventType, String description, Long taskId) {
        Map<String, Object> propsMap = new HashMap<>();
        propsMap.put(TASK_DESCRIPTION_PROPERTY, description);
        propsMap.put(CONTENT_TYPE_ID.getName(), GPZU_CONTENT_TYPE);
        propsMap.put(TASK_TYPE_PROPERTY, CUSTOM.name());
        propsMap.put(STATUS_PROPERTY, TaskStatus.IN_PROGRESS);
        propsMap.put(TASK_OWNER_ID_PROPERTY, Long.valueOf("2"));

        taskLogService.create(new TaskLogDto(eventType, taskId), propsMap);
    }

    private void createDocumentAndLinkToTask(RequestType request, Map<String, Object> taskContent, Long taskId) throws
            CrgDaoException, JsonProcessingException {
        ResourceQualifier libraryQualifier = libraryQualifier(GPZU_LIBRARY_ID);
        LibraryModel libraryModel = libraryRepository
                .findByTableName(GPZU_LIBRARY_ID)
                .map(documentLibrary -> new LibraryModel(documentLibrary, OWNER.name()))
                .orElseThrow(() -> new NotFoundException("Библиотека не найдена по идентификатору: "
                                                                 + GPZU_LIBRARY_ID));
        SchemaDto schema = libraryModel.getSchema();
        Map<String, Object> recordContent = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
        recordContent.put(DATE_ATTRIBUTE, LocalDate.parse(request.getService().getCurrentDate(), formatter));
        recordContent.put(PERSON_NAME_ATTRIBUTE, request.getRecipientPersonalData().getFullfio());
        recordContent.put(REQUEST_TYPE_ATTRIBUTE, GPZU_REQUEST_TYPE);
        recordContent.put(DATA_TYPE_ATTRIBUTE, GPZU_DATA_TYPE);
        recordContent.put(TITLE.getName(), GPZU_TITLE);
        recordContent.put(CONTENT_TYPE_ID.getName(), GPZU_CONTENT_TYPE);
        recordContent.put(IS_FOLDER.getName(), false);
        recordContent.put(PATH.getName(), ROOT_FOLDER_PATH);
        RecordEntity recordEntity = new RecordEntity(recordContent);
        IRecord savedRecord = recordsDao.addRecord(libraryQualifier, recordEntity, schema);

        TypeDocumentData documentData = new TypeDocumentData(savedRecord.getId(),
                                                             savedRecord.getTitle(),
                                                             GPZU_LIBRARY_ID);

        taskContent.put(DATA_SECTION_KEY_DATA_CONNECTION_ATTRIBUTE,
                        mapper.writeValueAsString(List.of(documentData)));

        SchemaDto tasksSchema = this.schemaService
                .getSchemaByName(TASKS_SCHEMA)
                .orElseThrow(() -> new NotFoundException("Не найдена схема задач: " + TASKS_SCHEMA));

        recordsDao.updateRecordById(new ResourceQualifier(TASK_QUALIFIER, taskId),
                                    taskContent,
                                    tasksSchema);

    }
}
