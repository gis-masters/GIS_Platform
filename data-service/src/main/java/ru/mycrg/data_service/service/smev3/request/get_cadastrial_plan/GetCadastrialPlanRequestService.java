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
import ru.mycrg.data_service.service.smev3.config.Smev3Config;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.common_contracts.generated.data_service.TaskLogDto;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.dto.record.RecordEntity;
import ru.mycrg.data_service.dto.record.ResponseWithReport;
import ru.mycrg.data_service.dto.smev3.GetCadastrialPlanDto;
import ru.mycrg.data_service.dto.smev3.ISmevRequestDto;
import ru.mycrg.data_service.egrn_cadastrial_plans_1_1_2.*;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.MinioService;
import ru.mycrg.data_service.service.TaskLogService;
import ru.mycrg.data_service.service.cqrs.library_records.requests.CreateLibraryRecordRequest;
import ru.mycrg.data_service.service.cqrs.tasks.requests.CreateTaskRequest;
import ru.mycrg.data_service.service.document_library.DocumentLibraryService;
import ru.mycrg.data_service.service.schemas.ISchemaTemplateService;
import ru.mycrg.data_service.service.smev3.Mnemonic;
import ru.mycrg.data_service.service.smev3.SmevMessageSenderService;
import ru.mycrg.data_service.service.smev3.model.RequestAndSources;
import ru.mycrg.data_service.service.smev3.model.SmevRequestMeta;
import ru.mycrg.data_service.service.smev3.request.RequestProcessor;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service.util.xml.XmlMarshaller;
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

import static ru.mycrg.data_service.service.TaskService.*;
import static ru.mycrg.data_service.service.import_.kpt.KptSourceFilesService.KPT_LIBRARY_ID;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.libraryQualifier;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.recordQualifier;
import static ru.mycrg.data_service.service.schemas.SchemaUtil.excludeUnknownProperties;
import static ru.mycrg.data_service.util.DetailedLogger.logError;
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

    public static final String KPT_ORDER_CONTENT_TYPE = "common_task_kpt_order";
    public static final String DATA_SECTION_KEY_DATA_CONNECTION_ATTRIBUTE = "data_section_key_data_connection";

    private static final String FOLDER_CONTENT_TYPE = "folder_v1";
    private static final String DOC_CONTENT_TYPE = "Карточка";
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
        super(Mnemonic.GET_CADASTRIAL_PLAN_1_1_2,
              messageService,
              null,
              null,
              null,
              resourceLoader,
              null,
              smev3Config);

        this.schemaService = schemaService;
        this.authenticationFacade = authenticationFacade;
        this.mediator = mediator;
        this.documentLibraryService = documentLibraryService;
        this.taskLogService = taskLogService;
        this.fileStorageService = fileStorageService;
        this.minioService = minioService;
        this.recordsDao = recordsDao;
    }

    public void processMessageFromSmev(List<String> cadNums) {
        throwIfCadastrialNumberArchiveNotExists(cadNums);

        Map<String, String> clientIdToCadastrialNumber = new HashMap<>();
        cadNums.forEach(cadastrialNumber -> {
            throwIfCadastrialNumberNotValid(cadastrialNumber);

            clientIdToCadastrialNumber.put(UUID.randomUUID().toString(), cadastrialNumber);
        });

        SecurityContext securityContext = SecurityContextHolder.getContext();
        DelegatingSecurityContextRunnable wrappedRunnable = new DelegatingSecurityContextRunnable(() -> {
            try {
                processMessageFromSmev(clientIdToCadastrialNumber,
                                       String.join(", ", cadNums));
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
            IRecord doc = createDocument(clientId, cadastrialNumber, folder.getId());
            createLog("Создание нового документа",
                      "Создан документ с кадастровым номером " + cadastrialNumber,
                      doc.getContent(),
                      task.getId());
        });

        AtomicInteger counter = new AtomicInteger(0);
        clientIdToCadastrialNumber.forEach((clientId, cadastrialNumber) -> {
            String kptArchiveFileName = buildKptArchiveFileName(cadastrialNumber);

            File kptArchive;
            byte[] archiveBytes;
            try {
                kptArchive = fileStorageService.loadFromKptStorage(kptArchiveFileName);
                archiveBytes = Files.readAllBytes(kptArchive.toPath());
            } catch (Exception e) {
                String msg = "Возникла ошибка при подготовке ресурсов для загрузки в минио";
                logError(msg, e);

                throw new BadRequestException(msg + e.getMessage());
            }

            minioService.uploadFile(kptArchive.getName(), archiveBytes, getSmev3Config().getS3bucketOutgoing());

            GetCadastrialPlanDto dto = new GetCadastrialPlanDto();
            dto.setClientId(clientId);
            dto.setArchiveFilename(kptArchiveFileName);

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
        SchemaDto tasksSchema = this.schemaService
                .getSchemaByName(TASKS_SCHEMA)
                .orElseThrow(() -> new NotFoundException("Не найдена схема задач: " + TASKS_SCHEMA));

        return mediator.execute(
                new CreateTaskRequest(tasksSchema, TASK_QUALIFIER, prepareTaskRecord(description)));
    }

    private RecordEntity prepareTaskRecord(String description) {
        UserDetails userDetails = authenticationFacade.getUserDetails();

        Map<String, Object> body = new HashMap<>();
        body.put(TASK_TYPE_PROPERTY, CUSTOM.name());
        body.put(TASK_ASSIGNED_TO_PROPERTY, userDetails.getUserId());
        body.put(TASK_OWNER_ID_PROPERTY, userDetails.getUserId());
        body.put(TASK_DESCRIPTION_PROPERTY, description);
        body.put(CONTENT_TYPE_ID.getName(), KPT_ORDER_CONTENT_TYPE);
        body.put(CREATED_AT.getName(), LocalDate.now());

        return new RecordEntity(body);
    }

    private IRecord createFolder(String order, IRecord createdTask) {
        SchemaDto schema = documentLibraryService.getSchema(KPT_LIBRARY_ID);

        ResponseWithReport response = mediator.execute(
                new CreateLibraryRecordRequest(schema,
                                               libraryQualifier(KPT_LIBRARY_ID),
                                               prepareFolderRecord(order, createdTask, schema)));

        return new RecordEntity(response.getContent());
    }

    @NotNull
    private RecordEntity prepareFolderRecord(String order, IRecord createdTask, SchemaDto schema) {
        UserDetails userDetails = authenticationFacade.getUserDetails();

        Map<String, Object> body = new HashMap<>();
        body.put(IS_FOLDER.getName(), true);
        body.put(ORDER_NUMBER_PROPERTY, order);
        body.put(ORDER_TASK_NUMBER_PROPERTY, createdTask.getId());
        body.put(PERFORMER_PROPERTY, userDetails.getUserId());
        body.put(STATUS_PROPERTY, "Заказано");
        body.put(CREATED_AT.getName(), LocalDate.now());
        body.put(CONTENT_TYPE_ID.getName(), FOLDER_CONTENT_TYPE);

        return new RecordEntity(excludeUnknownProperties(schema, body));
    }

    private IRecord createDocument(String clientId, String cadastrialNumber, Long folderId) {
        UserDetails userDetails = authenticationFacade.getUserDetails();

        Map<String, Object> body = new HashMap<>();
        body.put(IS_FOLDER.getName(), false);
        body.put(ORDER_NUMBER_PROPERTY, clientId);
        body.put(CAD_KVARTAL_PROPERTY, cadastrialNumber);
        body.put(PERFORMER_PROPERTY, userDetails.getUserId());
        body.put(PATH.getName(), "/root/" + folderId);
        body.put(CREATED_AT.getName(), LocalDate.now());
        body.put(CONTENT_TYPE_ID.getName(), DOC_CONTENT_TYPE);

        SchemaDto schema = documentLibraryService.getSchema(KPT_LIBRARY_ID);

        ResponseWithReport response = mediator.execute(
                new CreateLibraryRecordRequest(schema,
                                               libraryQualifier(KPT_LIBRARY_ID),
                                               new RecordEntity(excludeUnknownProperties(schema, body))));

        return new RecordEntity(response.getContent());
    }

    private void createLog(String eventType, String description, Map<String, Object> propsMap, Long taskId) {
        propsMap.put(TASK_DESCRIPTION_PROPERTY, description);
        propsMap.put(CONTENT_TYPE_ID.getName(), KPT_ORDER_CONTENT_TYPE);
        propsMap.put(TASK_TYPE_PROPERTY, CUSTOM.name());
        propsMap.put(STATUS_PROPERTY, "IN_PROGRESS");
        propsMap.put(TASK_ASSIGNED_TO_PROPERTY, propsMap.get(PERFORMER_PROPERTY));
        propsMap.put(TASK_OWNER_ID_PROPERTY, propsMap.get(PERFORMER_PROPERTY));

        taskLogService.create(new TaskLogDto(eventType, taskId, authenticationFacade.getUserDetails().getUserId()), propsMap);
    }

    private void linkFolderToTask(IRecord folder, IRecord task) throws JsonProcessingException, CrgDaoException {
        TypeDocumentData documentData = new TypeDocumentData(folder.getId(),
                                                             "Заказ номер " + task.getId(),
                                                             KPT_LIBRARY_ID);

        Map<String, Object> taskPayload = task.getContent();
        taskPayload.put(DATA_SECTION_KEY_DATA_CONNECTION_ATTRIBUTE,
                        mapper.writeValueAsString(List.of(documentData)));

        SchemaDto tasksSchema = this.schemaService
                .getSchemaByName(TASKS_SCHEMA)
                .orElseThrow(() -> new NotFoundException("Не найдена схема задач: " + TASKS_SCHEMA));

        recordsDao.updateRecordById(recordQualifier(TASK_QUALIFIER, task.getId()),
                                    taskPayload,
                                    tasksSchema);
    }

    @Override
    protected SmevRequestMeta buildRequest(@NotNull ISmevRequestDto dto) throws Exception {
        GetCadastrialPlanDto planDto = (GetCadastrialPlanDto) dto;
        RequestAndSources<Request> requestAndSources = new GetCadastrialPlanXmlBuildProcessor(this).run();
        ClientMessage clientMessage = prepareClientMessage(requestAndSources.getRequest(),
                                                           planDto.getArchiveFilename(),
                                                           planDto.getClientId());

        SmevRequestMeta meta = new SmevRequestMeta(
                mnemonicEnum(),
                UUID.fromString(clientMessage.getRequestMessage().getRequestMetadata().getClientId()),
                null,
                XmlMarshaller.marshall(clientMessage, ClientMessage.class, mnemonicEnum().getPrefixMapper()),
                toJsonNode(clientMessage),
                requestAndSources.getSourcesAsJson(),
                requestAndSources.getAttachmentsAsJson()
        );

        validate(meta, requestAndSources.getRequest(), Request.class);

        return meta;
    }

    private ClientMessage prepareClientMessage(Request request, String archiveFilename, String clientId) {
        ClientMessage clientMessage = new ClientMessage();
        MessagePrimaryContent messagePrimaryContent = new MessagePrimaryContent();
        messagePrimaryContent.setRequest(request);

        AttachmentHeaderList attachmentHeaderList = new AttachmentHeaderList();
        AttachmentHeaderType attachmentHeaderType = new AttachmentHeaderType();
        attachmentHeaderType.setFilePath(archiveFilename);
        attachmentHeaderList.getAttachmentHeader().add(attachmentHeaderType);

        Content content = new Content();
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

    private void throwIfCadastrialNumberArchiveNotExists(List<String> cadastrialNumbers) {
        List<String> archiveFileNames = cadastrialNumbers.stream()
                                                         .map(this::buildKptArchiveFileName)
                                                         .collect(Collectors.toList());

        List<String> nonExistentArchives;
        try {
            List<String> existKptArchives = fileStorageService.getExistKptArchives();
            nonExistentArchives = archiveFileNames.stream()
                                                  .filter(fileName -> !existKptArchives.contains(fileName))
                                                  .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Во время проверки наличия на диске архивов КПТ произошла ошибка: {}", e.getMessage());

            throw new DataServiceException(e.getMessage());
        }

        if (!nonExistentArchives.isEmpty()) {
            List<String> nonExistentCadastrialNumbers = nonExistentArchives
                    .stream()
                    .map(this::extractCadastrialNumberFromKptArchiveFileName)
                    .collect(Collectors.toList());

            throw new BadRequestException("В папке КПТ отсутствуют архивы по следующим кадастровым номерам: "
                                                  + nonExistentCadastrialNumbers);
        }
    }

    private String buildKptArchiveFileName(String cadastrialNumber) {
        return "Request_" + cadastrialNumber.replace(":", "_") + ".zip";
    }

    private String extractCadastrialNumberFromKptArchiveFileName(String archiveFileName) {
        return archiveFileName.replaceAll("Request_(.*?)\\.zip", "$1")
                              .replace("_", ":");
    }
}
