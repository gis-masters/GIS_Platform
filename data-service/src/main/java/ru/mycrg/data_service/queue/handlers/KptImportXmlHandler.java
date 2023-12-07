package ru.mycrg.data_service.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;
import ru.mycrg.data_service.dao.detached.DetachedRecordsDao;
import ru.mycrg.data_service.dao.detached.KptImportDao;
import ru.mycrg.data_service.dao.detached.TaskLogDetachedDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.TaskLogDto;
import ru.mycrg.data_service.kpt_import.model.KptElement;
import ru.mycrg.data_service.kpt_import.model.ZuElement;
import ru.mycrg.data_service.kpt_import.reader.KptXmlElementReader;
import ru.mycrg.data_service.kpt_import.validation.KptImportLogLevel;
import ru.mycrg.data_service.kpt_import.validation.KptImportValidationResult;
import ru.mycrg.data_service.kpt_import.validation.KptImportValidatorService;
import ru.mycrg.data_service.kpt_import.writer.KptElementWriter;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.ImportSourceFileDto;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.TypeDocumentData;
import ru.mycrg.data_service_contract.queue.request.KptImportXmlRequestEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamConstants;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamReader;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultProjectName;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.kpt_import.KptImportUtils.tmbTableName;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.CREATED_AT;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.CREATED_BY;

/**
 * Обработчик запроса на импорт КПТ из XML
 */
@Component
public class KptImportXmlHandler implements IEventHandler {

    private static final Logger log = LoggerFactory.getLogger(KptImportXmlHandler.class);
    private static final int BATCH_INSERT_SIZE = 50;

    private final KptImportValidatorService validationService;
    private final Map<String, KptXmlElementReader<? extends KptElement>> tagReaders;
    private final Map<Class<? extends KptElement>, KptElementWriter> kptElementsWriters;
    private final DetachedRecordsDao recordsDao;
    private final TaskLogDetachedDao taskLogDetachedDao;
    private final KptImportDao kptImportDao;
    /**
     * Соответствие элементов КПТ со схемами таблиц в БД
     */
    private final Map<Class<? extends KptElement>, String> kptElementSchemaNames = new HashMap<>();
    /**
     * Соответствие названия схем таблиц БД с тэгами xml
     */
    private final Map<String, Set<String>> schemaNameTags = new HashMap<>();

    public KptImportXmlHandler(List<KptXmlElementReader<? extends KptElement>> readers,
                               List<KptElementWriter> writers,
                               KptImportValidatorService validationService,
                               DetachedRecordsDao recordsDao,
                               TaskLogDetachedDao taskLogDetachedDao,
                               KptImportDao kptImportDao) {
        this.validationService = validationService;
        this.recordsDao = recordsDao;
        this.taskLogDetachedDao = taskLogDetachedDao;
        this.kptImportDao = kptImportDao;
        Map<String, KptXmlElementReader<? extends KptElement>> tmpReaders = new HashMap<>();
        Map<Class<? extends KptElement>, KptElementWriter> tmpWriters = new HashMap<>();
        readers.forEach(reader -> tmpReaders.put(reader.getXmlTag(), reader));
        writers.forEach(writer -> tmpWriters.put(writer.getTargetClass(), writer));
        tagReaders = Collections.unmodifiableMap(tmpReaders);
        kptElementsWriters = Collections.unmodifiableMap(tmpWriters);
        initKptElementSchemaNames();
        initSchemaNameTags();
    }

    private void initKptElementSchemaNames() {
        kptElementSchemaNames.put(ZuElement.class, "zu_pro");
    }

    private void initSchemaNameTags() {
        schemaNameTags.put("zu_pro", Set.of(ZuElement.XML_TAG));
    }

    @Override
    public String getEventType() {
        return KptImportXmlRequestEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent event) {
        log.info("Получено событие импорта КПТ из XML id: {}", event.getId());
        KptImportXmlRequestEvent importEvent = (KptImportXmlRequestEvent) event;
        Map<String, SchemaDto> targetTables = importEvent.getTables();
        Collection<SchemaDto> requiredSchemas = targetTables.values();
        Set<String> requiredTags = getRequiredTags(requiredSchemas);
        String dbName = importEvent.getDbName();
        boolean validate = importEvent.getValidationSettings() != null;

        try {
            cleanTmpTables(requiredSchemas, dbName);
        } catch (CrgDaoException e) {
            log.error("Ошибка очистки временной таблицы!", e);
            writeTaskLog(dbName, importEvent.getTaskId(), KptImportLogLevel.ERROR,
                         "Не удалось очистить временные таблицы");
            return;
        }

        for (ImportSourceFileDto file: importEvent.getSourceFiles()) {
            StopWatch stopWatch = new StopWatch();
            stopWatch.start();
            try {
                importFile(file, requiredTags, requiredSchemas, importEvent.getInitiatorLogin(), dbName);
            } catch (XMLStreamException | IOException ex) {
                log.error("Ошибка чтения xml файла " + file.getPath(), ex);
                writeTaskLog(dbName, importEvent.getTaskId(), KptImportLogLevel.ERROR,
                             String.format("Не прочитать файл КПТ %s: %s", file.getPath(), ex.getMessage()));
                continue;
            } catch (Exception ex) {
                log.error("Ошибка импорта КПТ kptId={} из файла {}", file.getDocument().getId(), file.getPath(), ex);
                writeTaskLog(dbName, importEvent.getTaskId(), KptImportLogLevel.ERROR,
                             String.format("Непредвиденная ошибка импорта файла КПТ %s: %s", file.getPath(),
                                           ex.getMessage())
                );
                continue;
            }

            if (validate) {
                validationService.validate(file.getDocument().getTitle(),
                                           importEvent.getValidationSettings(),
                                           targetTables,
                                           dbName,
                                           importEvent.getProjectId(),
                                           importEvent.getTaskId()
                );
            }

            for (String table: targetTables.keySet()) {
                copyData(targetTables.get(table),
                         new ResourceQualifier(getDefaultProjectName(importEvent.getProjectId()), table),
                         file.getDocument().getTitle(),
                         importEvent.getDbName()
                );
            }

            stopWatch.stop();
            log.debug("Файл {} полностью импортирован за {} сек",
                      file.getDocument().getTitle(), stopWatch.getTotalTimeSeconds());
        }
    }

    /**
     * Возвращает множество тэгов, которые необходимо парсить
     */
    private Set<String> getRequiredTags(Collection<SchemaDto> schemas) {
        return schemas.stream().map(schema -> schemaNameTags.get(schema.getName())).flatMap(Set::stream)
                      .collect(Collectors.toSet());
    }

    public void importFile(ImportSourceFileDto file, Set<String> requiredTags, Collection<SchemaDto> requiredSchemas,
                           String initiator, String databaseName) throws XMLStreamException, IOException {
        String filePath = file.getPath();
        StopWatch timer = new StopWatch();
        timer.start();

        try (ZipFile zipFile = new ZipFile(filePath)) {
            Optional<ZipEntry> xmlZipEntry = extractXmlZipEntry(zipFile);
            if (xmlZipEntry.isEmpty()) {
                log.error("В архиве не найден xml файл КПТ. kptId: {}, архив: {}", file.getDocument().getId(),
                          filePath);
                return;
            }

            ZipEntry xmlFile = xmlZipEntry.get();
            InputStream inputStream = zipFile.getInputStream(xmlFile);
            XMLStreamReader streamReader = XMLInputFactory.newFactory().createXMLStreamReader(inputStream);

            try {
                log.info("Импорт КПТ {} из {}/{}", file.getDocument().getTitle(), filePath, xmlFile.getName());
                List<KptElement> batch = new LinkedList<>();
                String batchTag = null;
                KptXmlElementReader<? extends KptElement> batchReader = null;
                SchemaDto batchSchema = null;
                KptElementWriter batchWriter = null;

                while (streamReader.hasNext()) {
                    int eventType = streamReader.next();
                    if (eventType != XMLStreamConstants.START_ELEMENT) {
                        continue;
                    }
                    String tagName = streamReader.getLocalName();
                    if (!requiredTags.contains(tagName)) {
                        continue;
                    }
                    batchTag = batchTag == null ? tagName : batchTag;

                    if (!Objects.equals(batchTag, tagName) || batch.size() >= BATCH_INSERT_SIZE) {
                        if (!batch.isEmpty()) {
                            batchWriter.writeBatch(batch, batchSchema, databaseName);
                            batch.clear();
                        }

                        if (!Objects.equals(batchTag, tagName)) {
                            batchTag = tagName;
                            batchSchema = null;
                            batchWriter = null;
                            batchReader = null;
                        }
                    }

                    if (batchReader == null) {
                        batchReader = tagReaders.get(tagName);
                    }

                    if (batchReader == null) {
                        log.warn("Не найден reader для тэга {}. Элемент пропущен", tagName);
                        continue;
                    }

                    KptElement kptElement = batchReader.read(streamReader);
                    if (batchWriter == null) {
                        batchWriter = kptElementsWriters.get(kptElement.getClass());
                    }

                    if (batchWriter == null) {
                        log.warn("Не задан writer для класса {}, элемент пропущен",
                                 kptElement.getClass().getName());
                        continue;
                    }

                    if (!kptElement.hasGeometry()) {
                        continue;
                    }

                    if (batchSchema == null) {
                        batchSchema = getKptElementSchema(kptElement.getClass(), requiredSchemas);
                    }
                    fillContentWithCommonData(kptElement.getContent(), initiator, file.getDocument());
                    batch.add(kptElement);
                }

                if (!batch.isEmpty()) {
                    batchWriter.writeBatch(batch, batchSchema, databaseName);
                }
                timer.stop();
                log.info("Файл {} обработан за {} сек", filePath, timer.getTotalTimeSeconds());
                //todo task log
            } finally {
                inputStream.close();
                streamReader.close();
            }
        } catch (IOException ex) {
            log.error("Ошибка чтения архива КПТ. kptId: {}, архив: {}", file.getDocument().getId(), filePath, ex);
            throw ex;
        }
    }

    private Optional<ZipEntry> extractXmlZipEntry(ZipFile zipFile) {
        Enumeration<? extends ZipEntry> entries = zipFile.entries();
        ZipEntry xmlEntry = null;
        while (entries.hasMoreElements()) {
            ZipEntry entry = entries.nextElement();
            if (entry.getName().startsWith("report")) {
                String[] parts = entry.getName().split("\\.");
                if ("xml".equals(parts[parts.length - 1])) {
                    xmlEntry = entry;
                    break;
                }
            }
        }
        return Optional.ofNullable(xmlEntry);
    }

    private void fillContentWithCommonData(Map<String, Object> content, String initiator, TypeDocumentData document) {
        content.put("acsept_at", null); //TODO fill;
        content.put(CREATED_BY.getName(), initiator);
        content.put(CREATED_AT.getName(), LocalDateTime.now());
        content.put("source_doc", document.toString());
    }

    private SchemaDto getKptElementSchema(Class<? extends KptElement> elementClass,
                                          Collection<SchemaDto> requiredSchemas) {
        String schemaName = kptElementSchemaNames.get(elementClass);
        return requiredSchemas.stream()
                              .filter(schemaDto -> schemaName.equals(schemaDto.getName()))
                              .findFirst()
                              .get();
    }

    private void cleanTmpTables(Collection<SchemaDto> schemas, String dbName) throws CrgDaoException {
        for (SchemaDto schema: schemas) {
            ResourceQualifier rq = new ResourceQualifier(SYSTEM_SCHEMA_NAME, tmbTableName(schema.getName()));
            recordsDao.truncateTable(rq, dbName);
        }
    }

    private void copyData(SchemaDto schema, ResourceQualifier targetQualifier, String cadastralSquare, String dbName) {
        StopWatch timer = new StopWatch();
        timer.start();
        String sourceTable = tmbTableName(schema.getName());
        ResourceQualifier sourceQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, sourceTable);

        kptImportDao.deleteAllByCadatstralSquare(dbName, targetQualifier, cadastralSquare);
        kptImportDao.copyCadastralSquare(dbName, sourceQualifier, targetQualifier, schema.getProperties(),
                                         schema.getProperties(), cadastralSquare);

        timer.stop();
        log.debug("Данные перенесены из {} в {} за {} сек.", sourceTable, targetQualifier, timer.getTotalTimeSeconds());
    }

    private void writeTaskLog(String dbName, Long taskId, KptImportLogLevel lvl, String message) {
        taskLogDetachedDao.createTaskLog(
                dbName,
                new TaskLogDto("Импорт КПТ", taskId),
                new KptImportValidationResult(lvl, message)
        );
    }
}
