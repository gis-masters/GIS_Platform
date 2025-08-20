package ru.mycrg.data_service.service.smev3.request;

import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dao.detached.TasksDetachedDao;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.repository.DocumentLibraryRepository;
import ru.mycrg.data_service.repository.FileRepository;
import ru.mycrg.data_service.service.files.FileService;
import ru.mycrg.data_service.service.MinioService;
import ru.mycrg.data_service.service.TaskLogService;
import ru.mycrg.data_service.service.binary_analyzers.SimpleIntentHandler;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service.service.schemas.ISchemaTemplateService;
import ru.mycrg.data_service.service.smev3.SmevMessageSenderService;
import ru.mycrg.data_service.service.smev3.SmevMessageService;
import ru.mycrg.data_service.service.smev3.config.Smev3Config;
import ru.mycrg.data_service_contract.enums.TaskStatus;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

public class AcceptServiceBaseImpl extends AcceptServiceBase {

    public AcceptServiceBaseImpl(TaskLogService taskLogService,
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
        super(taskLogService, tasksDao, smevMessageService, schemaService, fileStorageService,
              recordsDao, libraryRepository, fileRepository, simpleIntentHandler, minioService,
              smev3Config, fileService, smevMessageSenderService, documentCreationService);
    }

    @Override
    protected List<IRecord> getDocRecords() {
        return new ArrayList<>();
    }

    @Override
    protected <T> Long getPerformerId(List<IRecord> docRecords, T queryResult) {
        return 1L;
    }

    @Override
    protected String getContentType() {
        return "application/xml";
    }

    @Override
    protected String getDocumentPath() {
        return "test/path";
    }

    @Override
    protected String getTitle() {
        return "Test Title";
    }

    @Override
    protected String getFileName() {
        return "test.file";
    }

    @Override
    protected String getEventTypeLog() {
        return "TEST";
    }

    @Override
    protected String getDescriptionLog() {
        return "Test description";
    }

    @Override
    protected <T> void addAdditionalFields(T queryResult, Map<String, Object> documentPayload) {
        // No additional fields needed for test
    }

    @Override
    protected void addDueDateToTask(Map<String, Object> taskPayload) {
        // No due date needed for test
    }

    @Override
    protected <T> String getPermitNumber(T queryResult) {
        return "TEST-PERMIT-1";
    }

    @Override
    protected <T> String getFullFio(T queryResult) {
        return "Test User";
    }

    @Override
    protected <T> String getCurrentDate(T queryResult) {
        return "2024-01-01";
    }

    @Override
    protected <T> String getMessageId(T queryResult) {
        return "TEST-MSG-1";
    }

    @Override
    protected <T> String getClientId(T queryResult) {
        return "TEST-CLIENT-1";
    }

    @Override
    protected <T> long getOrderId(T queryResult) {
        return 1L;
    }

    @Override
    protected <T> String marshallQueryResult(T queryResult) {
        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?><test></test>";
    }

    @Override
    protected <T> XWPFDocument getWordDocument(T queryResult) {
        return new XWPFDocument();
    }

    @Override
    protected String getStatusMessage(IRecord docRecord, TaskStatus taskStatus, String fileName, byte[] ecp,
                                      boolean isCanceledByUser) {
        return "";
    }

    @Override
    protected <T> List<String> getAttachIds(T queryResult) {
        return Collections.emptyList();
    }

    @Override
    protected <T> List<MultipartFile> getFiles(T queryResult, Map<String, byte[]> map) {
        return List.of();
    }
}
