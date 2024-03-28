package ru.mycrg.data_service.service.smev3.request.get_cadastrial_plan;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ResourceLoader;
import org.springframework.security.concurrent.DelegatingSecurityContextRunnable;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.auth_facade.UserDetails;
import ru.mycrg.data_service.config.Smev3Config;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.TaskLogDto;
import ru.mycrg.data_service.dto.smev3.GetCadastrialPlanDto;
import ru.mycrg.data_service.dto.smev3.ISmevRequestDto;
import ru.mycrg.data_service.dto.smev3.OrderKptDto;
import ru.mycrg.data_service.egrn_cadastrial_plans_1_1_2.*;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.RecordEntity;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.MinioService;
import ru.mycrg.data_service.service.TaskLogService;
import ru.mycrg.data_service.service.cqrs.library_records.requests.CreateLibraryRecordRequest;
import ru.mycrg.data_service.service.cqrs.tasks.requests.CreateTaskRequest;
import ru.mycrg.data_service.service.document_library.DocumentLibraryService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.schemas.ISchemaTemplateService;
import ru.mycrg.data_service.service.smev3.Mnemonic;
import ru.mycrg.data_service.service.smev3.SmevMessageSenderService;
import ru.mycrg.data_service.service.smev3.model.XmlBuildMeta;
import ru.mycrg.data_service.service.smev3.request.RequestProcessor;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.TypeDocumentData;
import ru.mycrg.mediator.Mediator;

import java.io.File;
import java.nio.file.Files;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;
import static ru.mycrg.data_service.dto.ResourceType.TASK;
import static ru.mycrg.data_service.service.TaskService.*;
import static ru.mycrg.data_service.service.schemas.SchemaUtil.excludeUnknownProperties;
import static ru.mycrg.data_service.util.JsonConverter.mapper;
import static ru.mycrg.data_service.util.JsonConverter.toJsonNode;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.*;
import static ru.mycrg.data_service_contract.enums.TaskType.CUSTOM;

@Service
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class GetCadastrialPlanRequestService extends RequestProcessor {

    private static final Logger log = LoggerFactory.getLogger(GetCadastrialPlanRequestService.class);

    public static final String KPT_CONTENT_TYPE = "common_task_kpt_order";
    public static final String DATA_SECTION_KEY_DATA_CONNECTION_ATTRIBUTE = "data_section_key_data_connection";

    private static final String FOLDER_CONTENT_TYPE = "folder_v1";
    private static final String DOC_CONTENT_TYPE = "Карточка";
    private static final String KPT_LIBRARY_ID = "dl_data_kpt";
    private static final String ORDER_NUMBER_PROPERTY = "order_number";
    private static final String PERFORMER_PROPERTY = "performer";
    private static final String STATUS_PROPERTY = "status";
    private static final String CAD_KVARTAL_PROPERTY = "cad_kvartal";
    private static final String ORDER_TASK_NUMBER_PROPERTY = "order_task_number";

    private final ISchemaTemplateService schemaService;
    private final IAuthenticationFacade authenticationFacade;
    private final Mediator mediator;
    private final DocumentLibraryService documentLibraryService;
    private final TaskLogService taskLogService;
    private final FileStorageService fileStorageService;
    private final MinioService minioService;
    private final RecordsDao recordsDao;

    public GetCadastrialPlanRequestService(Smev3Config smev3Config,
                                           ResourceLoader resourceLoader,
                                           SmevMessageSenderService messageService,
                                           ISchemaTemplateService schemaService,
                                           IAuthenticationFacade authenticationFacade,
                                           Mediator mediator,
                                           DocumentLibraryService documentLibraryService,
                                           TaskLogService taskLogService,
                                           FileStorageService fileStorageService,
                                           MinioService minioService,
                                           RecordsDao recordsDao) {
        super(
                Mnemonic.GET_CADASTRIAL_PLAN_1_1_2,
                messageService,
                null,
                null,
                null,
                resourceLoader,
                smev3Config
        );
        this.schemaService = schemaService;
        this.authenticationFacade = authenticationFacade;
        this.mediator = mediator;
        this.documentLibraryService = documentLibraryService;
        this.taskLogService = taskLogService;
        this.fileStorageService = fileStorageService;
        this.minioService = minioService;
        this.recordsDao = recordsDao;
    }

    public void processMessageFromSmev(OrderKptDto orderKptDto) {
        Map<String, String> clientIdToCadastrialNumber = new HashMap<>();
        orderKptDto.getOrder().forEach(cadastrialNumber -> {
            throwIfCadastrialNumberNotValid(cadastrialNumber);
            clientIdToCadastrialNumber.put(UUID.randomUUID().toString(), cadastrialNumber);
        });
        throwIfCadasrialNumberArchiveNotExists(orderKptDto.getOrder());
        String joinedCadastrialNumbers = String.join(", ", orderKptDto.getOrder());

        SecurityContext securityContext = SecurityContextHolder.getContext();
        DelegatingSecurityContextRunnable wrappedRunnable = new DelegatingSecurityContextRunnable(() -> {
            try {
                processMessageFromSmev(clientIdToCadastrialNumber, joinedCadastrialNumbers);
            } catch (Exception e) {
                String msg = "Во время обработки запроса на получение КПТ произошла ошибка: " + e.getMessage();
                log.error(msg);
                throw new DataServiceException(msg);
            }
        }, securityContext);

        new Thread(wrappedRunnable).start();
    }

    private void processMessageFromSmev(Map<String, String> clientIdToCadastrialNumber, String joinedCadastrialNumbers)
            throws JsonProcessingException, CrgDaoException {

        IRecord task = createTask(joinedCadastrialNumbers);
        IRecord folder = createFolder(joinedCadastrialNumbers, task);
        linkFolderToTask(folder, task);
        createLog("Создание новой папки",
                  "Создана папка с кадастровыми номерами " + joinedCadastrialNumbers,
                  folder.getContent(),
                  task.getId());

        clientIdToCadastrialNumber.forEach((clientId, cadastrialNumber) -> {
            IRecord doc = createDoc(clientId, cadastrialNumber, folder.getId());
            createLog("Создание нового документа",
                      "Создан документ с кадастровым номером " + cadastrialNumber,
                      doc.getContent(),
                      task.getId());
        });

        AtomicInteger counter = new AtomicInteger(0);
        clientIdToCadastrialNumber.forEach((clientId, cadastrialNumber) -> {
            String archiveFileName = convertCadastrialNumberToArchiveFileName(cadastrialNumber);
            try {
                File kptArchive = fileStorageService.loadKptArchive(archiveFileName);
                byte[] archiveBytes = Files.readAllBytes(kptArchive.toPath());
                minioService.uploadFile(kptArchive.getName(), archiveBytes, getSmev3Config().getS3bucketOutgoing());
            } catch (Exception e) {
                log.error("Возникла ошибка при попытке загрузить архив в Minio: {}", e.getMessage());
                throw new BadRequestException("Ошибка загрузки файла в минио: " + e.getMessage());
            }
            GetCadastrialPlanDto dto = new GetCadastrialPlanDto();
            dto.setClientId(clientId);
            dto.setArchiveFilename(archiveFileName);
            sendRequest(dto);

            if (counter.incrementAndGet() % 5 == 0) {
                try {
                    Thread.sleep(10_000);
                } catch (InterruptedException e) {
                    log.error("Возникла ошибка при попытке усыпить поток");
                    Thread.currentThread().interrupt();
                }
            }
        });

    }

    private IRecord createTask(String description) {
        Map<String, Object> body = prepareTaskBody(description);
        SchemaDto tasksSchema = this.schemaService
                .getSchemaByName(TASKS_SCHEMA)
                .orElseThrow(() -> new NotFoundException("Не найдена схема задач: " + TASKS_SCHEMA));
        return mediator.execute(
                new CreateTaskRequest(tasksSchema,
                                      new ResourceQualifier(SYSTEM_SCHEMA_NAME, TASK_TABLE_NAME, TASK),
                                      new RecordEntity(body)));
    }

    private Map<String, Object> prepareTaskBody(String description) {
        UserDetails userDetails = authenticationFacade.getUserDetails();
        Map<String, Object> body = new HashMap<>();
        body.put(TASK_TYPE_PROPERTY, CUSTOM.name());
        body.put(TASK_ASSIGNED_TO_PROPERTY, userDetails.getUserId());
        body.put(TASK_OWNER_ID_PROPERTY, userDetails.getUserId());
        body.put(TASK_DESCRIPTION_PROPERTY, description);
        body.put(CONTENT_TYPE_ID.getName(), KPT_CONTENT_TYPE);
        body.put(CREATED_AT.getName(), LocalDate.now());
        return body;
    }

    private IRecord createFolder(String order, IRecord createdTask) {
        Map<String, Object> body = prepareFolderBody(order, createdTask);
        SchemaDto schema = documentLibraryService.getSchema(KPT_LIBRARY_ID);
        Map<String, Object> props = excludeUnknownProperties(schema, body);

        return mediator.execute(
                new CreateLibraryRecordRequest(schema,
                                               new ResourceQualifier(SYSTEM_SCHEMA_NAME, KPT_LIBRARY_ID, LIBRARY),
                                               new RecordEntity(props)));
    }

    private Map<String, Object> prepareFolderBody(String order, IRecord createdTask) {
        UserDetails userDetails = authenticationFacade.getUserDetails();
        Map<String, Object> body = new HashMap<>();
        body.put(IS_FOLDER.getName(), true);
        body.put(ORDER_NUMBER_PROPERTY, order);
        body.put(ORDER_TASK_NUMBER_PROPERTY, createdTask.getId());
        body.put(PERFORMER_PROPERTY, userDetails.getUserId());
        body.put(STATUS_PROPERTY, "Заказано");
        body.put(CREATED_AT.getName(), LocalDate.now());
        body.put(CONTENT_TYPE_ID.getName(), FOLDER_CONTENT_TYPE);
        return body;
    }

    private IRecord createDoc(String clientId, String cadastrialNumber, Long id) {
        Map<String, Object> body = prepareDocBody(cadastrialNumber, clientId, id);
        SchemaDto schema = documentLibraryService.getSchema(KPT_LIBRARY_ID);
        Map<String, Object> props = excludeUnknownProperties(schema, body);

        return mediator.execute(
                new CreateLibraryRecordRequest(schema,
                                               new ResourceQualifier(SYSTEM_SCHEMA_NAME, KPT_LIBRARY_ID, LIBRARY),
                                               new RecordEntity(props)));
    }

    private Map<String, Object> prepareDocBody(String cadastrialNumber, String clientId, Long id) {
        UserDetails userDetails = authenticationFacade.getUserDetails();
        Map<String, Object> body = new HashMap<>();
        body.put(IS_FOLDER.getName(), false);
        body.put(ORDER_NUMBER_PROPERTY, clientId);
        body.put(CAD_KVARTAL_PROPERTY, cadastrialNumber);
        body.put(PERFORMER_PROPERTY, userDetails.getUserId());
        body.put(PATH.getName(), "/root/" + id);
        body.put(CREATED_AT.getName(), LocalDate.now());
        body.put(CONTENT_TYPE_ID.getName(), DOC_CONTENT_TYPE);
        return body;
    }

    private void createLog(String eventType, String description, Map<String, Object> propsMap, Long taskId) {
        propsMap.put(TASK_DESCRIPTION_PROPERTY, description);
        propsMap.put(CONTENT_TYPE_ID.getName(), KPT_CONTENT_TYPE);
        propsMap.put(TASK_TYPE_PROPERTY, CUSTOM.name());
        propsMap.put(STATUS_PROPERTY, "IN_PROGRESS");
        propsMap.put(TASK_ASSIGNED_TO_PROPERTY, propsMap.get(PERFORMER_PROPERTY));
        propsMap.put(TASK_OWNER_ID_PROPERTY, propsMap.get(PERFORMER_PROPERTY));
        taskLogService.create(new TaskLogDto(eventType, taskId), propsMap);
    }

    private void linkFolderToTask(IRecord folder, IRecord task) throws JsonProcessingException, CrgDaoException {
        TypeDocumentData typeDocumentData = new TypeDocumentData();
        typeDocumentData.setId(folder.getId());
        typeDocumentData.setTitle("Заказ номер " + task.getId());
        typeDocumentData.setLibraryTableName(KPT_LIBRARY_ID);
        Map<String, Object> taskPayload = task.getContent();
        String jacksonData = mapper.writeValueAsString(List.of(typeDocumentData));
        taskPayload.put(DATA_SECTION_KEY_DATA_CONNECTION_ATTRIBUTE, jacksonData);
        SchemaDto tasksSchema = this.schemaService
                .getSchemaByName(TASKS_SCHEMA)
                .orElseThrow(() -> new NotFoundException("Не найдена схема задач: " + TASKS_SCHEMA));
        recordsDao.updateRecordById(new ResourceQualifier(TASK_QUALIFIER, task.getId()),
                                    taskPayload,
                                    tasksSchema);
    }

    @Override
    protected XmlBuildMeta buildRequest(@NotNull ISmevRequestDto dto) throws Exception {
        var getCadastrialPlanDto = (GetCadastrialPlanDto) dto;
        var buildRequest = new GetCadastrialPlanXmlBuildProcessor(this).run();
        var clientMessage = clientMessage(buildRequest.getRequest(),
                                          getCadastrialPlanDto.getArchiveFilename(),
                                          getCadastrialPlanDto.getClientId());
        var meta = new XmlBuildMeta(
                mnemonicEnum(),
                UUID.fromString(clientMessage.getRequestMessage().getRequestMetadata().getClientId()),
                null,
                xmlMarshaller().marshall(clientMessage, ClientMessage.class),
                toJsonNode(clientMessage),
                buildRequest.getSourcesJson(),
                buildRequest.getAttachmentsJson()
        );
        validate(meta, buildRequest.getRequest(), Request.class);

        return meta;
    }

    private ClientMessage clientMessage(Request request, String archiveFilename, String clientId) {
        ClientMessage clientMessage = new ClientMessage();
        MessagePrimaryContent messagePrimaryContent = new MessagePrimaryContent();
        messagePrimaryContent.setRequest(request);
        Content content = new Content();
        AttachmentHeaderList attachmentHeaderList = new AttachmentHeaderList();
        AttachmentHeaderType attachmentHeaderType = new AttachmentHeaderType();
        attachmentHeaderType.setFilePath(archiveFilename);
        attachmentHeaderList.getAttachmentHeader().add(attachmentHeaderType);
        content.setAttachmentHeaderList(attachmentHeaderList);
        content.setMessagePrimaryContent(messagePrimaryContent);
        RequestContentType requestContentType = new RequestContentType();
        requestContentType.setContent(content);
        RequestMetadataType requestMetadataType = new RequestMetadataType();
        requestMetadataType.setClientId(clientId);
        RequestMessageType requestMessageType = new RequestMessageType();
        requestMessageType.setRequestMetadata(requestMetadataType);
        requestMessageType.setRequestContent(requestContentType);
        clientMessage.setItSystem(getSmev3Config().getSystemMnemonic());
        clientMessage.setRequestMessage(requestMessageType);

        return clientMessage;
    }

    private void throwIfCadastrialNumberNotValid(String number) {
        Pattern cadNumPattern = Pattern.compile("\\d{2}:\\d{2}:\\d{6}");
        Matcher matcher = cadNumPattern.matcher(number);
        if (!matcher.matches()) {
            throw new BadRequestException("Передан невалидный кадастровый номер: " + number);
        }
    }

    private void throwIfCadasrialNumberArchiveNotExists(List<String> cadastrialNumbers) {
        List<String> archiveFileNames = cadastrialNumbers.stream()
                .map(this::convertCadastrialNumberToArchiveFileName)
                .collect(Collectors.toList());

        List<String> nonExistentArchives;
        try {
            nonExistentArchives = fileStorageService.getNonExistentFileNames(archiveFileNames);
        } catch (Exception e) {
            log.error("Во время проверки наличия на диске архивов КПТ произошла ошибка: {}", e.getMessage());
            throw new DataServiceException(e.getMessage());
        }

        if (!nonExistentArchives.isEmpty()) {
            List<String> nonExistentCadasrialNumbers = nonExistentArchives.stream()
                    .map(this::convertArchiveFileNameToCadastrialNumber)
                    .collect(Collectors.toList());
            throw new BadRequestException("В папке КПТ отсутствуют архивы по следующим кадастровым номерам: "
                                                  + nonExistentCadasrialNumbers);
        }
    }

    private String convertCadastrialNumberToArchiveFileName(String cadastrialNumber) {
        return "Request_" + cadastrialNumber.replace(":", "_") + ".zip";
    }

    private String convertArchiveFileNameToCadastrialNumber(String archiveFileName) {
        return archiveFileName.replaceAll("Request_(.*?)\\.zip", "$1")
                .replace("_", ":");
    }
}
