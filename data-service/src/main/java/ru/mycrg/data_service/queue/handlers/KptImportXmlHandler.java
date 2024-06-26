package ru.mycrg.data_service.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.dao.detached.DetachedRecordsDao;
import ru.mycrg.data_service.dao.detached.KptImportDao;
import ru.mycrg.data_service.dao.detached.TaskLogDetachedDao;
import ru.mycrg.data_service.dao.detached.TasksDetachedDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.TaskLogDto;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.kpt_import.TmpTablesCreator;
import ru.mycrg.data_service.kpt_import.model.*;
import ru.mycrg.data_service.kpt_import.model.oks.OksBuildingElement;
import ru.mycrg.data_service.kpt_import.model.oks.OksConstructionElement;
import ru.mycrg.data_service.kpt_import.model.oks.OksUnderConstructionElement;
import ru.mycrg.data_service.kpt_import.reader.KptXmlElementReader;
import ru.mycrg.data_service.kpt_import.reader.kvartal.KvartalPartialDataReader;
import ru.mycrg.data_service.kpt_import.validation.KptImportValidationResult;
import ru.mycrg.data_service.kpt_import.validation.KptImportValidatorService;
import ru.mycrg.data_service.kpt_import.writer.KptElementWriter;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.ImportSourceFileDto;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.dto.TypeDocumentData;
import ru.mycrg.data_service_contract.dto.import_.KptImportTableDto;
import ru.mycrg.data_service_contract.dto.import_.KptImportValidationSettings;
import ru.mycrg.data_service_contract.enums.TaskStatus;
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
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.kpt_import.KptImportUtils.DS_ID;
import static ru.mycrg.data_service.kpt_import.KptImportUtils.tmbTableName;
import static ru.mycrg.data_service.kpt_import.validation.KptImportLogLevel.ERROR;
import static ru.mycrg.data_service.util.DetailedLogger.logError;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.CREATED_AT;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.CREATED_BY;

/**
 * Обработчик запроса на импорт КПТ из XML
 */
@Component
public class KptImportXmlHandler implements IEventHandler {

    private static final Logger log = LoggerFactory.getLogger(KptImportXmlHandler.class);
    private static final int BATCH_INSERT_SIZE = 50;
    private static final String KVARTAL_SCHEMA = "kvartal_kpt";
    private static final String CADASTRALNUM_PROPERTY = "cadastralnum";
    private static final String REGNUMBORD_PROPERTY = "regnumbord";

    private final KptImportValidatorService validationService;
    private final Map<String, KptXmlElementReader<? extends KptElement>> tagReaders;
    private final Map<Class<? extends KptElement>, KptElementWriter> kptElementsWriters;
    private final DetachedRecordsDao recordsDao;
    private final TaskLogDetachedDao taskLogDetachedDao;
    private final KptImportDao kptImportDao;
    private final TmpTablesCreator tmpTablesCreator;
    private final TasksDetachedDao tasksDetachedDao;
    private final DatasourceFactory datasourceFactory;
    /**
     * Соответствие названия схем таблиц БД с тэгами xml
     */
    private final Map<String, Set<String>> schemaNameTags = new HashMap<>();
    /**
     * Флаг выполнения импорта для обеспечения возможности отмены операции
     */
    private final AtomicBoolean running = new AtomicBoolean(false);

    public KptImportXmlHandler(List<KptXmlElementReader<? extends KptElement>> readers,
                               List<KptElementWriter> writers,
                               KptImportValidatorService validationService,
                               DetachedRecordsDao recordsDao,
                               TaskLogDetachedDao taskLogDetachedDao,
                               KptImportDao kptImportDao,
                               TmpTablesCreator tmpTablesCreator,
                               TasksDetachedDao tasksDetachedDao, DatasourceFactory datasourceFactory) {
        this.validationService = validationService;
        this.recordsDao = recordsDao;
        this.taskLogDetachedDao = taskLogDetachedDao;
        this.kptImportDao = kptImportDao;
        this.tmpTablesCreator = tmpTablesCreator;
        this.tasksDetachedDao = tasksDetachedDao;
        this.datasourceFactory = datasourceFactory;
        Map<String, KptXmlElementReader<? extends KptElement>> tmpReaders = new HashMap<>();
        Map<Class<? extends KptElement>, KptElementWriter> tmpWriters = new HashMap<>();
        readers.forEach(reader -> tmpReaders.put(reader.getXmlTag(), reader));
        writers.forEach(writer -> writer.getTargetClasses().forEach(clz -> tmpWriters.put(clz, writer)));
        tagReaders = Collections.unmodifiableMap(tmpReaders);
        kptElementsWriters = Collections.unmodifiableMap(tmpWriters);
        initSchemaNameTags();
    }

    @Override
    public String getEventType() {
        return KptImportXmlRequestEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent event) {
        try {
            StopWatch importTimer = new StopWatch();
            importTimer.start();
            KptImportXmlRequestEvent importEvent = (KptImportXmlRequestEvent) event;
            log.info("Получено событие импорта КПТ из XML id: {}, taskId: {}", event.getId(), importEvent.getTaskId());

            String dbName = importEvent.getDbName();
            if (taskFinished(dbName, importEvent.getTaskId())) {
                return;
            }
            tasksDetachedDao.updateStatus(dbName, importEvent.getTaskId(), TaskStatus.IN_PROGRESS);
            running.set(true);

            List<KptImportTableDto> targetTables = importEvent.getTables();
            Collection<SchemaDto> requiredSchemas = targetTables.stream()
                                                                .map(KptImportTableDto::getSchemaDto)
                                                                .collect(Collectors.toList());

            try {
                tmpTablesCreator.createIfNotExists(dbName, requiredSchemas);
            } catch (Exception e) {
                String message = "Не удалось создать временные таблицы для импорта!";
                log.error(message, e);
                writeTaskLog(dbName, importEvent.getTaskId(), message);

                return;
            }

            try {
                cleanTmpTables(requiredSchemas, dbName);
            } catch (CrgDaoException e) {
                log.error("Ошибка очистки временной таблицы!", e);
                writeTaskLog(dbName, importEvent.getTaskId(), "Не удалось очистить временные таблицы");

                return;
            }

            Map<Class<? extends KptElement>, KptElementWriter> requiredWriters = chooseWriters(requiredSchemas);
            Set<String> requiredTags = getRequiredTags(requiredSchemas);

            int threadsCount = Math.min(4, importEvent.getSourceFiles().size());
            CountDownLatch latch = new CountDownLatch(importEvent.getSourceFiles().size());
            ExecutorService executorService = Executors.newFixedThreadPool(threadsCount);
            for (int i = 0; i < importEvent.getSourceFiles().size(); ++i) {
                int finalI = i;
                executorService.execute(() -> {
                                            ImportSourceFileDto fileSource = importEvent.getSourceFiles().get(finalI);
                                            try {
                                                executeFile(fileSource,
                                                            requiredTags,
                                                            requiredSchemas,
                                                            requiredWriters,
                                                            importEvent,
                                                            targetTables);
                                            } catch (Exception e) {
                                                log.error("Непредвиденная ошибка импорта из файла {}: {}",
                                                          fileSource.getDocument().getTitle(), e.getMessage(), e);
                                            } finally {
                                                latch.countDown();
                                            }
                                        }
                );
            }

            try {
                latch.await();
            } catch (InterruptedException e) {
                log.error("Прервано ожидание импорта КПТ", e);
            }

            if (running.get()) {
                tasksDetachedDao.updateStatus(dbName, importEvent.getTaskId(), TaskStatus.DONE);
            }

            for (KptImportTableDto table: targetTables) {
                ResourceQualifier qualifier = new ResourceQualifier(table.getResourceQualifierDto().getDataset(),
                                                                    table.getResourceQualifierDto().getTable());

                deduplicateData(dbName, qualifier, table.getSchemaDto());
                fixGeometry(dbName, qualifier);
            }

            importTimer.stop();
            log.info("Импорт {} выполнен за {} сек", importEvent.getId(), importTimer.getTotalTimeSeconds());

            datasourceFactory.closeDatasource(dbName, DS_ID);
        } catch (Exception e) {
            String msg = "Не удалось обработать событие импорта КПТ из XML id: " + event.getId();

            logError(msg, e);

            throw new DataServiceException(msg);
        }
    }

    public void cancelImport() {
        running.set(false);
    }

    public void importFile(ImportSourceFileDto file,
                           Set<String> requiredTags,
                           Collection<SchemaDto> requiredSchemas,
                           Map<Class<? extends KptElement>, KptElementWriter> requiredWriters,
                           KptImportXmlRequestEvent importEvent) throws XMLStreamException, IOException {
        String filePath = file.getPath();
        StopWatch timer = new StopWatch();
        timer.start();

        String dbName = importEvent.getDbName();
        String initiator = importEvent.getInitiatorLogin();
        String acsepAt = importEvent.getValidationSettings().getDateOrderCompletion();

        KvartalElement kvartalElement = new KvartalElement(new HashMap<>()); //кадастровый квартал

        try (ZipFile zipFile = new ZipFile(filePath)) {
            Optional<ZipEntry> xmlZipEntry = extractXmlZipEntry(zipFile);
            if (xmlZipEntry.isEmpty()) {
                log.error("В архиве не найден xml файл КПТ. kptId: {}, архив: {}", file.getDocument().getId(),
                          filePath);
                return;
            }

            ZipEntry xmlFile = xmlZipEntry.get();
            try (InputStream inputStream = zipFile.getInputStream(xmlFile)) {
                XMLStreamReader streamReader = XMLInputFactory.newFactory().createXMLStreamReader(inputStream);
                log.info("Импорт КПТ {} из {}/{}", file.getDocument().getTitle(), filePath, xmlFile.getName());
                Map<KptElementWriter, List<KptElement>> toWrite = new HashMap<>();

                while (streamReader.hasNext()) {
                    if (!running.get()) {
                        break;
                    }

                    int eventType = streamReader.next();
                    if (eventType != XMLStreamConstants.START_ELEMENT) {
                        continue;
                    }

                    String tagName = streamReader.getLocalName();
                    if (!requiredTags.contains(tagName)) {
                        continue;
                    }

                    KptXmlElementReader<? extends KptElement> tagReader = tagReaders.get(tagName);
                    if (tagReader == null) {
                        log.warn("Не найден reader для тэга {}. Элемент пропущен", tagName);
                        continue;
                    }

                    if (isKvartalElementTag(tagName)) {
                        ((KvartalPartialDataReader<?, ?>) tagReader).readKvartalData(streamReader, kvartalElement);
                        continue;
                    }

                    List<? extends KptElement> kptElements;
                    try {
                        kptElements = tagReader.read(streamReader);
                    } catch (Exception e) {
                        log.error("Ошибка чтения элемента в {}", tagReader.getClass().getSimpleName(), e);
                        continue;
                    }

                    persistKptElements(kptElements, requiredWriters, toWrite, requiredSchemas, dbName,
                                       initiator, file.getDocument(), acsepAt);
                }

                for (KptElementWriter writer: toWrite.keySet()) {
                    List<KptElement> batch = toWrite.get(writer);
                    if (!batch.isEmpty()) {
                        writeBatch(writer, batch, getKptElementSchema(writer, requiredSchemas), dbName);
                    }
                }

                if (!kvartalElement.getContent().isEmpty()) {
                    fillContentWithCommonData(kvartalElement.getContent(), initiator, file.getDocument(), acsepAt);
                    KptElementWriter kvartalWriter = requiredWriters.get(KvartalElement.class);
                    SchemaDto schema = getKptElementSchema(kvartalWriter, requiredSchemas);
                    List<KptElement> list = new ArrayList<>();
                    list.add(kvartalElement);
                    writeBatch(kvartalWriter, list, schema, dbName);
                }

                timer.stop();
                log.info("Файл {} обработан за {} сек", filePath, timer.getTotalTimeSeconds());
            }
        } catch (IOException ex) {
            log.error("Ошибка чтения архива КПТ. kptId: {}, архив: {}", file.getDocument().getId(), filePath, ex);

            throw ex;
        }
    }

    private void executeFile(ImportSourceFileDto file,
                             Set<String> requiredTags,
                             Collection<SchemaDto> requiredSchemas,
                             Map<Class<? extends KptElement>, KptElementWriter> requiredWriters,
                             KptImportXmlRequestEvent importEvent,
                             List<KptImportTableDto> targetTables) {
        if (!running.get()) {
            return;
        }

        StopWatch stopWatch = new StopWatch();
        stopWatch.start();

        String dbName = importEvent.getDbName();
        long taskId = importEvent.getTaskId();
        KptImportValidationSettings validationSettings = importEvent.getValidationSettings();

        try {
            importFile(file, requiredTags, requiredSchemas, requiredWriters, importEvent);
        } catch (XMLStreamException | IOException ex) {
            String msg = "Ошибка чтения файла КПТ: " + file.getPath();
            log.error("{} => {}", msg, ex.getMessage(), ex);

            writeTaskLog(dbName, taskId, msg);

            return;
        } catch (Exception ex) {
            String msg = "Непредвиденная ошибка импорта файла КПТ: %s" + file.getPath();
            log.error("{} из файла {}", msg, file.getDocument().getId(), ex);

            writeTaskLog(dbName, taskId, msg);

            return;
        }

        String documentTitle = file.getDocument().getTitle();
        if (validationSettings != null) {
            validationService.validate(documentTitle,
                                       validationSettings,
                                       targetTables,
                                       dbName,
                                       taskId);
        }

        for (KptImportTableDto table: targetTables) {
            if (!running.get()) {
                break;
            }

            ResourceQualifier targetTableQualifier = new ResourceQualifier(
                    table.getResourceQualifierDto().getDataset(),
                    table.getResourceQualifierDto().getTable());

            SchemaDto schema = table.getSchemaDto();
            if (tmpTableHasRecords(dbName, schema.getName(), documentTitle)) {
                try {
                    copyData(dbName, schema, targetTableQualifier, documentTitle);
                } catch (Exception e) {
                    log.error("Ошибка переноса данных из временной таблицы в '{}'",
                              table.getResourceQualifierDto().getTable(), e);
                }
            } else {
                log.info("Данные в таблице {} не обновлены из-за отсутствия записей во временной таблице по кварталу " +
                                 "{}", targetTableQualifier.getTableQualifier(), documentTitle);
            }
        }
    }

    /**
     * Возвращает множество тэгов, которые необходимо парсить
     */
    private Set<String> getRequiredTags(Collection<SchemaDto> schemas) {
        return schemas.stream().map(schema -> schemaNameTags.get(schema.getName())).flatMap(Set::stream)
                      .collect(Collectors.toSet());
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

    private void fillContentWithCommonData(Map<String, Object> content,
                                           String initiator,
                                           TypeDocumentData document,
                                           String acseptAt) {
        content.put("acsept_at", acseptAt);
        content.put(CREATED_BY.getName(), initiator);
        content.put(CREATED_AT.getName(), LocalDateTime.now());
        content.put("source_doc", String.format("[%s]", document.toString()));
    }

    private SchemaDto getKptElementSchema(KptElementWriter writer,
                                          Collection<SchemaDto> requiredSchemas) {
        String schemaName = writer.getSchemaName();
        return requiredSchemas.stream()
                              .filter(schemaDto -> schemaName.equals(schemaDto.getName()))
                              .findFirst()
                              .orElse(null);
    }

    private void cleanTmpTables(Collection<SchemaDto> schemas, String dbName) throws CrgDaoException {
        for (SchemaDto schema: schemas) {
            recordsDao.truncateTable(dbName,
                                     new ResourceQualifier(SYSTEM_SCHEMA_NAME, tmbTableName(schema.getName())));
        }
    }

    private void copyData(String dbName,
                          SchemaDto schema,
                          ResourceQualifier targetTableQualifier,
                          String documentTitle) {
        StopWatch timer = new StopWatch();
        timer.start();

        Set<String> generatedValues = Set.of("area", "lenght");
        List<SimplePropertyDto> properties = schema.getProperties().stream()
                                                   .filter(prop -> !generatedValues.contains((prop.getName())))
                                                   .collect(Collectors.toList());

        kptImportDao.deleteAllByDocumentTitle(dbName, targetTableQualifier, documentTitle);

        String sourceTable = tmbTableName(schema.getName());
        kptImportDao.copyCadastralSquare(dbName,
                                         new ResourceQualifier(SYSTEM_SCHEMA_NAME, sourceTable),
                                         targetTableQualifier,
                                         properties,
                                         schema.getProperties(),
                                         documentTitle);

        timer.stop();

        log.debug("Данные перенесены из '{}' в '{}' за: {} сек.",
                  sourceTable, targetTableQualifier, timer.getTotalTimeSeconds());
    }

    private void writeTaskLog(String dbName, Long taskId, String message) {
        taskLogDetachedDao.createTaskLog(
                dbName,
                new TaskLogDto("Импорт КПТ", taskId),
                new KptImportValidationResult(ERROR, message),
                DS_ID
        );
    }

    private Map<Class<? extends KptElement>, KptElementWriter> chooseWriters(Collection<SchemaDto> requiredSchemas) {
        Map<Class<? extends KptElement>, KptElementWriter> requiredWriters = new HashMap<>();
        Set<String> requiredSchemaNames = requiredSchemas.stream().map(SchemaDto::getName).collect(Collectors.toSet());
        for (Class<? extends KptElement> key: kptElementsWriters.keySet()) {
            KptElementWriter writer = kptElementsWriters.get(key);
            if (requiredSchemaNames.contains(writer.getSchemaName())) {
                requiredWriters.put(key, writer);
            }
        }

        return requiredWriters;
    }

    private boolean isKvartalElementTag(String xmlTag) {
        return schemaNameTags.get(KVARTAL_SCHEMA).contains(xmlTag);
    }

    private boolean taskFinished(String dbName, long taskId) {
        TaskStatus taskStatus = tasksDetachedDao.getTaskStatus(dbName, taskId);

        return taskStatus == TaskStatus.CANCELED || taskStatus == TaskStatus.DONE;
    }

    private void persistKptElements(List<? extends KptElement> kptElements,
                                    Map<Class<? extends KptElement>, KptElementWriter> requiredWriters,
                                    Map<KptElementWriter, List<KptElement>> toWrite,
                                    Collection<SchemaDto> requiredSchemas,
                                    String databaseName,
                                    String initiator,
                                    TypeDocumentData document,
                                    String acsepAt) {
        for (KptElement kptElement: kptElements) {
            if (!kptElement.hasGeometry()) {
                continue;
            }

            KptElementWriter writer = requiredWriters.get(kptElement.getClass());
            if (writer == null) {
                continue;
            }

            List<KptElement> batch = toWrite.computeIfAbsent(writer, k -> new LinkedList<>());

            if (batch.size() >= BATCH_INSERT_SIZE) {
                writeBatch(writer, batch, getKptElementSchema(writer, requiredSchemas), databaseName);
            }
            fillContentWithCommonData(kptElement.getContent(), initiator, document, acsepAt);
            batch.add(kptElement);
        }
    }

    private void writeBatch(KptElementWriter writer, List<KptElement> batch, SchemaDto schemaDto, String databaseName) {
        try {
            writer.writeBatch(batch, schemaDto, databaseName);
        } catch (Exception e) {
            log.error("Ошибка сохранения данных слоя {}", writer.getSchemaName(), e);
        }
        batch.clear();
    }

    private void deduplicateData(String dbName,
                                 ResourceQualifier qualifier,
                                 SchemaDto schema) {
        List<String> properties = schema.getProperties().stream()
                                        .map(SimplePropertyDto::getName)
                                        .collect(Collectors.toList());
        boolean hasCadastralnum = properties.stream().anyMatch(CADASTRALNUM_PROPERTY::equals);
        boolean hasRegnumbodr = properties.stream().anyMatch(REGNUMBORD_PROPERTY::equals);

        if (!hasCadastralnum && !hasRegnumbodr) {
            log.error("Невозможно дедуплицировать строки для таблицы: '{}' - нет полей cadastralnum/regnumbord для " +
                              "группировки", qualifier);
            return;
        }

        String groupByProperty = hasCadastralnum ? CADASTRALNUM_PROPERTY : REGNUMBORD_PROPERTY;

        try {
            kptImportDao.deduplicateData(dbName, qualifier, groupByProperty);
        } catch (Exception e) {
            log.error("Ошибка дедупликации данных!", e);
        }
    }

    private void fixGeometry(String dbName, ResourceQualifier qualifier) {
        log.info("Выполняем исправление геометрии для: {}", qualifier.getQualifier());

        try {
            kptImportDao.makeGeometryValid(dbName, qualifier);
        } catch (Exception e) {
            log.error("Не удалось исправить геометрию для таблицы: '{}' => {}",
                      qualifier.getQualifier(), e.getMessage(), e);
        }
    }

    private boolean tmpTableHasRecords(String dbName, String schemaName, String cadastralSquare) {
        String tableName = tmbTableName(schemaName);
        ResourceQualifier rq = new ResourceQualifier(SYSTEM_SCHEMA_NAME, tableName);
        try {
            return kptImportDao.countRecordsByCadastralSquare(cadastralSquare, dbName, rq).compareTo(0) > 0;
        } catch (Exception e) {
            log.error("Ошибка получения количества строк во временной таблице {} по кварталу {}",
                      tableName, cadastralSquare);

            return false;
        }
    }

    private void initSchemaNameTags() {
        schemaNameTags.put("zu_pro", Set.of(ZuElement.XML_TAG));
        schemaNameTags.put("zouit_pro", Set.of(ZouitElement.XML_TAG));
        schemaNameTags.put(KVARTAL_SCHEMA, Set.of("cadastral_number", "area_quarter",
                                                  "spatial_data"));
        schemaNameTags.put("municipality_boundaries_egrn", Set.of(MunicipalityBoundaryElement.XML_TAG));
        schemaNameTags.put("oks_pro", Set.of(OksConstructionElement.XML_TAG, OksBuildingElement.XML_TAG,
                                             OksUnderConstructionElement.XML_TAG));
        schemaNameTags.put("oks_polyline_pro", Set.of(OksConstructionElement.XML_TAG,
                                                      OksUnderConstructionElement.XML_TAG));
        schemaNameTags.put("oks_constructions_points", Set.of(OksConstructionElement.XML_TAG,
                                                              OksUnderConstructionElement.XML_TAG));
        schemaNameTags.put("borderwaterobj", Set.of(BorderWaterObjectElement.XML_TAG));
        schemaNameTags.put("borderwaterobj_polilyne", Set.of(BorderWaterObjectElement.XML_TAG));
    }
}
