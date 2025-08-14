package ru.mycrg.data_service.service.smev3.request.accept_gpzu;

import com.sun.xml.bind.marshaller.NamespacePrefixMapper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dao.detached.TasksDetachedDao;
import ru.mycrg.data_service.dto.LibraryModel;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.gpzu_1_0_1.*;
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
import ru.mycrg.data_service.service.smev3.request.AcceptServiceBase;
import ru.mycrg.data_service.service.smev3.request.DocumentCreationService;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service.util.xml.XmlMarshaller;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.enums.TaskStatus;

import java.util.*;
import java.util.stream.Collectors;

import static java.util.Optional.ofNullable;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.libraryQualifier;

@Service
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class AcceptGpzuService extends AcceptServiceBase {

    private static final String TITLE = "ГПЗУ";
    private static final String EVENT_TYPE_LOG = "Входящее сообщение ГПЗУ успешно записано в реестр";
    private static final String DEFAULT_PERFORMER_ID = "1547";
    private static final String DEFAULT_FILENAME = "Градостроительный_план_земельного_участка";

    public AcceptGpzuService(TaskLogService taskLogService, TasksDetachedDao tasksDao,
                             SmevMessageService smevMessageService,
                             ISchemaTemplateService schemaService,
                             FileStorageService fileStorageService, RecordsDao recordsDao,
                             DocumentLibraryRepository libraryRepository,
                             FileRepository fileRepository,
                             SimpleIntentHandler simpleIntentHandler,
                             MinioService minioService, Smev3Config smev3Config,
                             FileService fileService,
                             SmevMessageSenderService smevMessageSenderService,
                             DocumentCreationService documentCreationService) {
        super(taskLogService, tasksDao, smevMessageService, schemaService, fileStorageService, recordsDao,
              libraryRepository, fileRepository, simpleIntentHandler, minioService, smev3Config, fileService,
              smevMessageSenderService, documentCreationService);
    }

    @Override
    protected List<IRecord> getDocRecords() {
        String filter = String.format("path like '%s'", "/root/" + "32");
        ResourceQualifier libraryQualifier = libraryQualifier(TASK_ALLOCATION_LIBRARY_ID);
        LibraryModel libraryModel = libraryRepository
                .findByTableName(TASK_ALLOCATION_LIBRARY_ID)
                .map(LibraryModel::new)
                .orElseThrow(() -> new NotFoundException(
                        "Не найдена библиотека TASK_ALLOCATION: " + libraryQualifier.getQualifier()));
        SchemaDto schema = libraryModel.getSchema();

        return recordsDao.findAll(libraryQualifier, filter, schema);
    }

    @Override
    protected <T> Long getPerformerId(List<IRecord> docRecords, T queryResult) {
        final String TARGET_WORD_AREA = "района";
        final String TARGET_WORD_CITY = "города";

        QueryResult result = (QueryResult) queryResult;
        RequestType request = result.getMessage().getRequestContent().getContent().getMessagePrimaryContent()
                                    .getRequest();

        if (request.getCompetentOrganization() == null || request.getCompetentOrganization().getName() == null) {

            return Long.valueOf(DEFAULT_PERFORMER_ID);
        }

        String competentOrgName = request.getCompetentOrganization().getName();

        Long performerId = getPerformerIdFromCompetentOrgName(docRecords, competentOrgName, TARGET_WORD_AREA);
        if (performerId != null) {
            return performerId;
        }
        performerId = getPerformerIdFromCompetentOrgName(docRecords, competentOrgName, TARGET_WORD_CITY);

        return performerId != null ? performerId : Long.valueOf(DEFAULT_PERFORMER_ID);
    }

    private Long getPerformerIdFromCompetentOrgName(List<IRecord> docRecords, String orgName, String targetWord) {
        int index = orgName.indexOf(targetWord);
        if (index != -1) {
            String substring = orgName.substring(index + targetWord.length()).trim();
            String[] words = substring.split(" ");
            if (words.length > 0) {
                String[] parts = orgName.substring(0, index).trim().split(" ");
                String wordToMatch = targetWord.equals("района") ? parts[parts.length - 1] : words[0];

                return docRecords.stream()
                                 .filter(iRecord -> Objects.requireNonNull(iRecord.getTitle())
                                                           .contains(wordToMatch))
                                 .map(iRecord -> iRecord.getAsString(
                                         PERFORMER_ATTRIBUTE) == null ? DEFAULT_PERFORMER_ID : iRecord.getAsString(
                                         PERFORMER_ATTRIBUTE))
                                 .findFirst()
                                 .map(Long::valueOf)
                                 .orElse(null);
            }
        }

        return null;
    }

    @Override
    protected String getContentType() {
        return CommonFields.GPZU_CONTENT_TYPE;
    }

    @Override
    protected String getDocumentPath() {
        return "/root";
    }

    @Override
    protected String getTitle() {
        return TITLE;
    }

    @Override
    protected String getFileName() {
        return DEFAULT_FILENAME;
    }

    @Override
    protected String getEventTypeLog() {
        return EVENT_TYPE_LOG;
    }

    @Override
    protected String getDescriptionLog() {
        return EVENT_TYPE_LOG;
    }

    @Override
    protected <T> void addAdditionalFields(T queryResult, Map<String, Object> documentPayload) {
        QueryResult result = (QueryResult) queryResult;
        RequestType request = result.getMessage().getRequestContent().getContent().getMessagePrimaryContent()
                                    .getRequest();
        documentPayload.put(GOAL, request.getGoal());
        documentPayload.put(CADASTRAL_NUMBER, getCadastalNumbers(request));
        documentPayload.put(PERMIT_NUMBER, getPermitNumber(queryResult));
    }

    @Override
    protected void addDueDateToTask(Map<String, Object> taskPayload) {
        taskPayload.put(DUE_DATE_ATTRIBUTE, calculateDueDate(13));
    }

    @Override
    protected <T> String getPermitNumber(T queryResult) {
        QueryResult result = (QueryResult) queryResult;
        RequestType request = result.getMessage().getRequestContent().getContent().getMessagePrimaryContent()
                                    .getRequest();

        return ofNullable(request.getGPZUInformation())
                .map(GPZUInformationType::getNumber)
                .orElse("");
    }

    @Override
    protected <T> String getFullFio(T queryResult) {
        QueryResult result = (QueryResult) queryResult;
        RequestType request = result.getMessage().getRequestContent().getContent().getMessagePrimaryContent()
                                    .getRequest();
        String recipientFio = Optional.ofNullable(request.getRecipientPersonalData())
                                      .map(RecipientPersonalDataType::getFullfio)
                                      .orElse(null);
        String delegateRecipientFio = Optional.ofNullable(request.getDelegatePersonalData())
                                              .map(DelegatePersonalDataType::getFullfio)
                                              .orElse(null);
        String representativeFio = Optional.ofNullable(request.getLegalData())
                                           .map(LegalDataType::getRepresentativeInfo)
                                           .map(RepresentativeInfoType::getFullfio)
                                           .orElse(null);
        List<String> fullfios = Arrays.asList(recipientFio, delegateRecipientFio, representativeFio);

        return fullfios.stream()
                       .filter(Objects::nonNull)
                       .findFirst()
                       .orElse("");
    }

    @Override
    protected <T> String getCurrentDate(T queryResult) {
        QueryResult result = (QueryResult) queryResult;
        RequestType request = result.getMessage().getRequestContent().getContent().getMessagePrimaryContent()
                                    .getRequest();

        return request.getService().getCurrentDate();
    }

    @Override
    protected <T> String getMessageId(T queryResult) {
        QueryResult result = (QueryResult) queryResult;

        return result.getSmevMetadata().getMessageId();
    }

    @Override
    protected <T> String getClientId(T queryResult) {
        QueryResult result = (QueryResult) queryResult;

        return result.getMessage().getRequestMetadata().getClientId();
    }

    @Override
    protected <T> long getOrderId(T queryResult) {
        QueryResult result = (QueryResult) queryResult;
        RequestType request = result.getMessage().getRequestContent().getContent().getMessagePrimaryContent()
                                    .getRequest();

        return request.getService().getOrderId();
    }

    @Override
    protected <T> String marshallQueryResult(T queryResult) {
        QueryResult result = (QueryResult) queryResult;
        NamespacePrefixMapper namespacePrefixMapper = new NamespacePrefixMapper() {
            @Override
            public String getPreferredPrefix(String s, String s1, boolean b) {
                return "tns";
            }
        };
        try {
            return XmlMarshaller.marshall(result, QueryResult.class, namespacePrefixMapper);
        } catch (Exception e) {
            throw new SmevRequestException(
                    "Не удалось упорядочить xml содержимое запроса. Ошибка: " + e.getMessage());
        }
    }

    @Override
    protected <T> XWPFDocument getWordDocument(T queryResult) {
        QueryResult result = (QueryResult) queryResult;
        RequestType request = result.getMessage().getRequestContent().getContent().getMessagePrimaryContent()
                                    .getRequest();

        return documentCreationService.createGpzuDoc(request);
    }

    @Override
    protected String getStatusMessage(IRecord docRecord, TaskStatus taskStatus, String fileName,
                                      byte[] ecp, boolean isCanceledByUser) {
        ClientMessage clientMessage = createClientMessage();
        ResponseMessageType responseMessageType = createResponseMessageType(docRecord);
        ResponseContentType responseContentType = new ResponseContentType();
        MessagePrimaryContent messagePrimaryContent = new MessagePrimaryContent();
        Content content = new Content();
        ChangeOrderInfoType changeOrderInfoType = new ChangeOrderInfoType();

        setChangeOrderInfo(taskStatus, docRecord, changeOrderInfoType, fileName, ecp, content,
                           isCanceledByUser);
        FormResponseType formResponseType = new FormResponseType();
        formResponseType.setChangeOrderInfo(changeOrderInfoType);
        messagePrimaryContent.setFormResponse(formResponseType);
        content.setMessagePrimaryContent(messagePrimaryContent);
        responseContentType.setContent(content);
        responseMessageType.setResponseContent(responseContentType);
        clientMessage.setResponseMessage(responseMessageType);

        return marshalClientMessage(clientMessage);
    }

    @Override
    protected <T> List<String> getAttachIds(T queryResult) {
        QueryResult result = (QueryResult) queryResult;
        if (result.getMessage().getRequestContent().getContent().getAttachmentHeaderList() == null) {

            return Collections.emptyList();
        }

        return result.getMessage().getRequestContent().getContent()
                     .getAttachmentHeaderList().getAttachmentHeader().stream()
                     .map(AttachmentHeaderType::getId)
                     .collect(Collectors.toList());
    }

    @Override
    protected <T> List<MultipartFile> getFiles(T queryResult, Map<String, byte[]> map) {
        QueryResult result = (QueryResult) queryResult;
        RequestType request = result.getMessage().getRequestContent().getContent().getMessagePrimaryContent()
                                    .getRequest();
        if (request.getDocuments() == null) {
            return Collections.emptyList();
        }
        List<MultipartFile> files = new ArrayList<>();
        addFileIfNotEmpty(files, request.getDocuments().getAdditionalDocument(), map);
        addFileIfNotEmpty(files, request.getDocuments().getDecisionDocumentsBlock(), map);
        addFileIfNotEmpty(files, request.getDocuments().getDelegateLegalDocFile(), map);
        addFileIfNotEmpty(files, request.getDocuments().getDelegateLegalDocSigFile(), map);
        addFileIfNotEmpty(files, request.getDocuments().getDelegateDocFile(), map);

        return files;
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
                                    byte[] ecp, Content content, boolean isCanceledByUser) {
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
                addAttachmentHeader(fileName, ecp, content);
                break;
            case CANCELED:
                if (isCanceledByUser) {
                    statusCodeType.setTechCode("10");
                    changeOrderInfoType.setComment("Заявление отменено");
                } else {
                    statusCodeType.setTechCode("4");
                    changeOrderInfoType.setComment("Отказано в предоставлении услуги");
                    addAttachmentHeader(fileName, ecp, content);
                }
                break;
            default:
                throw new IllegalArgumentException("Неизвестный статус: " + taskStatus);
        }
        changeOrderInfoType.setStatusCode(statusCodeType);
    }

    private void addAttachmentHeader(String fileName, byte[] ecp, Content content) {
        AttachmentHeaderList attachmentHeaderList = new AttachmentHeaderList();
        AttachmentHeaderType attachmentHeaderType = new AttachmentHeaderType();
        attachmentHeaderType.setId(UUID.randomUUID().toString());
        attachmentHeaderType.setFilePath(fileName);
        attachmentHeaderType.setSignaturePKCS7(ecp);
        attachmentHeaderList.getAttachmentHeader().add(attachmentHeaderType);
        content.setAttachmentHeaderList(attachmentHeaderList);
    }

    private String marshalClientMessage(ClientMessage clientMessage) {
        NamespacePrefixMapper namespacePrefixMapper = new NamespacePrefixMapper() {
            @Override
            public String getPreferredPrefix(String s, String s1, boolean b) {
                return "tns";
            }
        };
        try {
            return XmlMarshaller.marshall(clientMessage, ClientMessage.class, namespacePrefixMapper);
        } catch (Exception e) {
            throw new SmevRequestException(
                    "Не удалось создать статусное сообщение для СМЭВ. Ошибка: " + e.getMessage());
        }
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
                if (doc.getCodeDocument().equalsIgnoreCase(DOCUMENT_CODE)
                        && doc.getType().equalsIgnoreCase(PDF_CONTENT_TYPE)
                        && doc.getName().endsWith(PDF_EXTENSION)) {
                    files.add(0, file);
                } else {
                    files.add(file);
                }
            }
        }
    }

    private String getCadastalNumbers(RequestType request) {
        return ofNullable(request.getDataLandPlotData())
                .map(data -> String.join(", ", data.getLandPlotCadastralNumber()))
                .orElse("");
    }
}
