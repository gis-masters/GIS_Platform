package ru.mycrg.data_service.service.smev3.request.accept_rns;

import com.sun.xml.bind.marshaller.NamespacePrefixMapper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.accept_rns_1_0_3.*;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dao.detached.TasksDetachedDao;
import ru.mycrg.data_service.dto.record.IRecord;
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
import ru.mycrg.data_service.service.smev3.request.AcceptServiceBase;
import ru.mycrg.data_service.service.smev3.request.DocumentCreationService;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service.util.xml.XmlMarshaller;
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
public class AcceptRnsService extends AcceptServiceBase {

    private static final String TITLE = "РНС";
    private static final String EVENT_TYPE_LOG = "Входящее сообщение РНC успешно записано в реестр";

    public AcceptRnsService(TaskLogService taskLogService, TasksDetachedDao tasksDao,
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
        String filter = String.format("path like '%s'", "/root/" + folderId);
        ResourceQualifier libraryQualifier = libraryQualifier(TASK_ALLOCATION_LIBRARY_ID);
        IRecord docRecord = recordsDao
                .findBy(libraryQualifier, filter)
                .orElseThrow(() -> new SmevRequestException("Не найден исполнитель по пути " + "/root/" + folderId));

        return List.of(docRecord);
    }

    @Override
    protected <T> Long getPerformerId(List<IRecord> docRecords, T queryResult) {
        return Long.valueOf(Objects.requireNonNull(docRecords.get(0).getAsString(PERFORMER_ATTRIBUTE)));
    }

    @Override
    protected String getContentType() {
        return CommonFields.RNS_CONTENT_TYPE;
    }

    @Override
    protected String getDocumentPath() {
        return "/root/40";
    }

    @Override
    protected String getTitle() {
        return TITLE;
    }

    @Override
    protected String getFileName() {
        return BUILDING_PERMIT_FILENAME;
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
        documentPayload.put(GOAL, getGoalDescription(request));
        documentPayload.put(CADASTRAL_NUMBER, getCadastalNumbers(request));
        documentPayload.put(PERMIT_NUMBER, getPermitNumber(request));
    }

    @Override
    protected void addDueDateToTask(Map<String, Object> taskPayload) {
        taskPayload.put(DUE_DATE_ATTRIBUTE, calculateDueDate(4));
    }

    @Override
    protected <T> String getPermitNumber(T queryResult) {
        QueryResult result = (QueryResult) queryResult;
        RequestType request = result.getMessage().getRequestContent().getContent().getMessagePrimaryContent()
                                    .getRequest();
        return ofNullable(request.getConstructionPermitsData())
                .map(ConstructionPermitsDataType::getNumber)
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

        return documentCreationService.createRnsDoc(request);
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
        return files;
    }

    private ClientMessage createClientMessage() {
        ClientMessage clientMessage = new ClientMessage();
        clientMessage.setItSystem(smev3Config.getSystemMnemonic());

        return clientMessage;
    }

    private String getPermitNumber(RequestType request) {
        return request.getConstructionPermitsData() == null ? null : request.getConstructionPermitsData().getNumber();
    }

    private String getCadastalNumbers(RequestType request) {
        return Optional.ofNullable(request)
                       .map(RequestType::getLandPlotData)
                       .map(LandPlotDataType::getLandPlotCadastralNumberBlock)
                       .stream()
                       .flatMap(List::stream)
                       .map(block -> String.join(", ", block.getLandPlotCadastralNumber()))
                       .collect(Collectors.joining(", "));
    }

    private String getGoalDescription(RequestType request) {
        if (request.getGoal() != 2) {

            return String.valueOf(request.getGoal());
        }
        Optional<KPVI25Type> variantChoice = Optional.ofNullable(request.getVariantChoice())
                                                     .map(VariantChoiceType::getKPVI25);

        if (variantChoice.map(KPVI25Type::isRenewalConstructionPermit).orElse(false)) {

            return request.getGoal() + "RenewalConstructionPermit";
        }
        if (variantChoice.map(KPVI25Type::isChangeOwnerLand).orElse(false)) {

            return request.getGoal() + "ChangeOwnerLand";
        }
        if (variantChoice.map(KPVI25Type::isFormLandCombiningDividingRedistributingAllocating).orElse(false)) {

            return request.getGoal() + "FormLandCombiningDividingRedistributingAllocating";
        }
        if (variantChoice.map(KPVI25Type::isDesignDocumentationAmended).orElse(false)) {

            return request.getGoal() + "DesignDocumentationAmended";
        }

        return null;
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
}
