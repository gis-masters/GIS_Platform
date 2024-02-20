package ru.mycrg.data_service.service.smev3.request.get_cadastrial_plan;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.auth_facade.UserDetails;
import ru.mycrg.data_service.config.Smev3Config;
import ru.mycrg.data_service.dto.TaskLogDto;
import ru.mycrg.data_service.dto.smev3.GetCadastrialPlanDto;
import ru.mycrg.data_service.dto.smev3.ISmevRequestDto;
import ru.mycrg.data_service.egrn_cadastrial_plans_1_1_2.*;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.RecordEntity;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.register_rnv_1_0_8.QueryResult;
import ru.mycrg.data_service.service.TaskLogService;
import ru.mycrg.data_service.service.cqrs.library_records.requests.CreateLibraryRecordRequest;
import ru.mycrg.data_service.service.cqrs.tasks.requests.CreateTaskRequest;
import ru.mycrg.data_service.service.document_library.DocumentLibraryService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.schemas.ISchemaService;
import ru.mycrg.data_service.service.smev3.Mnemonic;
import ru.mycrg.data_service.service.smev3.SmevMessageSenderService;
import ru.mycrg.data_service.service.smev3.model.ProcessAdapterMessageResult;
import ru.mycrg.data_service.service.smev3.model.XmlBuildMeta;
import ru.mycrg.data_service.service.smev3.request.RequestProcessor;
import ru.mycrg.data_service.util.JsonConverter;
import ru.mycrg.data_service.util.SystemLibraryAttributes;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.enums.TaskType;
import ru.mycrg.mediator.Mediator;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;
import static ru.mycrg.data_service.dto.ResourceType.TASK;
import static ru.mycrg.data_service.service.TaskService.TASKS_SCHEMA;
import static ru.mycrg.data_service.service.TaskService.TASK_TABLE_NAME;
import static ru.mycrg.data_service.service.schemas.SchemaUtil.excludeUnknownProperties;

@Service
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class GetCadastrialPlanRequestService extends RequestProcessor {

    private static final String TASK_TYPE_PROPERTY = "type";
    private static final String TASK_ASSIGNED_TO_PROPERTY = "assigned_to";
    private static final String TASK_DESCRIPTION_PROPERTY = "description";
    private static final String TASK_OWNER_ID_PROPERTY = "owner_id";
    private static final String TASK_CONTENT_TYPE = "common_task_kpt_order";
    private static final String FOLDER_CONTENT_TYPE = "folder_v1";
    private static final String DOC_CONTENT_TYPE = "Карточка";
    private static final String KPT_LIBRARY_ID = "dl_data_kpt";
    private static final String ORDER_NUMBER_PROPERTY = "order_number";
    private static final String PERFORMER_PROPERTY = "performer";
    private static final String STATUS_PROPERTY = "status";


    private final Logger log = LoggerFactory.getLogger(GetCadastrialPlanRequestService.class);

    private final ISchemaService schemaService;
    private final IAuthenticationFacade authenticationFacade;
    private final Mediator mediator;
    private final DocumentLibraryService documentLibraryService;
    private final TaskLogService taskLogService;

    public GetCadastrialPlanRequestService(Smev3Config smev3Config,
                                           ResourceLoader resourceLoader,
                                           SmevMessageSenderService messageService,
                                           ISchemaService schemaService,
                                           IAuthenticationFacade authenticationFacade,
                                           Mediator mediator,
                                           DocumentLibraryService documentLibraryService,
                                           TaskLogService taskLogService) {
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
    }

    public ProcessAdapterMessageResult processMessageFromSmev(String messageBody) {
        try {
            //TODO тут ошибка, так как импорт некорректного класса
            var queryResult = xmlMarshaller()
                    .unmarshall(messageBody, QueryResult.class);

            var XmlBuildMeta = new XmlBuildMeta(
                    mnemonicEnum(),
                    UUID.fromString(queryResult.getMessage().getResponseMetadata().getClientId()),
                    UUID.fromString(queryResult.getMessage().getResponseMetadata().getReplyToClientId()),
                    messageBody,
                    JsonConverter.toJsonNode(queryResult),
                    null,
                    null
            );
            String status;
            String message;

            if (queryResult.getMessage().getMessageType().equals("RejectMessage")) {
                status = queryResult.getMessage().getResponseContent().getRejects().get(0).getCode();
                message = queryResult.getMessage().getResponseContent().getRejects().get(0).getDescription();
            } else {
                status = queryResult.getMessage().getResponseContent().getStatus().getCode();
                message = queryResult.getMessage().getResponseContent().getStatus().getDescription();
            }

            return new ProcessAdapterMessageResult()
                    .setXmlBuildMeta(XmlBuildMeta)
                    .setStatus(status)
                    .setMessage(message);
        } catch (Exception e) {
            log.error("Process adapter message error: {}", e.getMessage());
            throw new SmevRequestException("process adapter message error :" + e.getMessage());
        }
    }

    public IRecord createTask(String description) {
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
        body.put(TASK_TYPE_PROPERTY, TaskType.CUSTOM.name());
        body.put(TASK_ASSIGNED_TO_PROPERTY, userDetails.getUserId());
        body.put(TASK_OWNER_ID_PROPERTY, userDetails.getUserId());
        body.put(TASK_DESCRIPTION_PROPERTY, description);
        body.put(SystemLibraryAttributes.CONTENT_TYPE_ID.getName(), TASK_CONTENT_TYPE);
        body.put(SystemLibraryAttributes.CREATED_AT.getName(), LocalDate.now());
        return body;
    }

    public IRecord createFolder(String order, IRecord createdTask) {
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
        body.put(SystemLibraryAttributes.IS_FOLDER.getName(), true);
        body.put(ORDER_NUMBER_PROPERTY, order);
        body.put(SystemLibraryAttributes.TITLE.getName(), createdTask.getId());
        body.put(PERFORMER_PROPERTY, userDetails.getUserId());
        body.put(STATUS_PROPERTY, "Заказано");
        body.put(SystemLibraryAttributes.CREATED_AT.getName(), LocalDate.now());
        body.put(SystemLibraryAttributes.CONTENT_TYPE_ID.getName(), FOLDER_CONTENT_TYPE);
        return body;
    }

    public IRecord createDoc(String clientId, String cadastrialNumber, Long id) {
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
        body.put(SystemLibraryAttributes.IS_FOLDER.getName(), false);
        body.put(ORDER_NUMBER_PROPERTY, clientId);
        body.put(SystemLibraryAttributes.TITLE.getName(), cadastrialNumber);
        body.put(PERFORMER_PROPERTY, userDetails.getUserId());
        body.put(SystemLibraryAttributes.PATH.getName(), "/root/" + id);
        body.put(SystemLibraryAttributes.CREATED_AT.getName(), LocalDate.now());
        body.put(SystemLibraryAttributes.CONTENT_TYPE_ID.getName(), DOC_CONTENT_TYPE);
        return body;
    }

    public void createLog(String eventType, String description, Map<String, Object> propsMap, Long taskId){
        propsMap.put(TASK_DESCRIPTION_PROPERTY, description);
        propsMap.put(SystemLibraryAttributes.CONTENT_TYPE_ID.getName(), TASK_CONTENT_TYPE);
        propsMap.put(TASK_TYPE_PROPERTY, TaskType.CUSTOM.name());
        propsMap.put(STATUS_PROPERTY, "IN_PROGRESS");
        propsMap.put(TASK_ASSIGNED_TO_PROPERTY, propsMap.get(PERFORMER_PROPERTY));
        propsMap.put(TASK_OWNER_ID_PROPERTY, propsMap.get(PERFORMER_PROPERTY));
        taskLogService.create(new TaskLogDto(eventType, taskId), propsMap);
    }

    public void validateCadastrialNumber(String number) {
        String cadastrialNumberRegex = "\\d{2}:\\d{2}:\\d{6}";
        Pattern pattern = Pattern.compile(cadastrialNumberRegex);
        Matcher matcher = pattern.matcher(number);

        if (!matcher.matches()) {
            log.error("Invalid cadastrial number: {}", number);
            throw new SmevRequestException("Invalid cadastrial number: " + number);
        }
    }

    @Override
    protected XmlBuildMeta buildRequest(@NotNull ISmevRequestDto dto) throws Exception {
        var getCadastrialPlanDto = (GetCadastrialPlanDto) dto;
        var buildRequest = new GetCadastrialPlanXmlBuildProcess(this).run();
        var clientMessage = clientMessage(buildRequest.getRequest(),
                getCadastrialPlanDto.getCadastrialNumber(),
                getCadastrialPlanDto.getClientId());
        var meta = new XmlBuildMeta(
                mnemonicEnum(),
                UUID.fromString(clientMessage.getRequestMessage().getRequestMetadata().getClientId()),
                null,
                xmlMarshaller().marshall(clientMessage, ClientMessage.class),
                JsonConverter.toJsonNode(clientMessage),
                buildRequest.getSourcesJson(),
                buildRequest.getAttachmentsJson()
        );
        validate(meta, buildRequest.getRequest(), Request.class);

        return meta;
    }

    private ClientMessage clientMessage(Request request, String cadastrialNumber, String clientId) {
        ClientMessage clientMessage = new ClientMessage();
        MessagePrimaryContent messagePrimaryContent = new MessagePrimaryContent();
        messagePrimaryContent.setRequest(request);
        Content content = new Content();
        AttachmentHeaderList attachmentHeaderList = new AttachmentHeaderList();
        AttachmentHeaderType attachmentHeaderType = new AttachmentHeaderType();
        attachmentHeaderType.setFilePath("Request_" + cadastrialNumber.replace(":", "_") + ".zip");
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
}
