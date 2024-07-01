package ru.mycrg.data_service.queue.handlers;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.dao.detached.KptImportDao;
import ru.mycrg.data_service.dao.detached.TaskLogDetachedDao;
import ru.mycrg.data_service.dao.detached.TasksDetachedDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.TaskLogDto;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.kpt_import.TmpTablesService;
import ru.mycrg.data_service.kpt_import.model.*;
import ru.mycrg.data_service.kpt_import.model.oks.OksBuildingElement;
import ru.mycrg.data_service.kpt_import.model.oks.OksConstructionElement;
import ru.mycrg.data_service.kpt_import.model.oks.OksUnderConstructionElement;
import ru.mycrg.data_service.kpt_import.reader.KptXmlElementReader;
import ru.mycrg.data_service.kpt_import.reader.kvartal.KvartalPartialDataReader;
import ru.mycrg.data_service.kpt_import.validation.KptImportValidationResult;
import ru.mycrg.data_service.kpt_import.validation.KptValidator;
import ru.mycrg.data_service.kpt_import.writer.KptElementWriter;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.ImportSourceFileDto;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.dto.TypeDocumentData;
import ru.mycrg.data_service_contract.dto.import_.ImportKptTableDto;
import ru.mycrg.data_service_contract.dto.import_.KptImportValidationSettings;
import ru.mycrg.data_service_contract.enums.TaskStatus;
import ru.mycrg.data_service_contract.queue.request.ImportKptEvent;
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
import static ru.mycrg.data_service.kpt_import.writer.BorderWaterObjectPolygonWriter.BORDERWATEROBJ_SCHEMA;
import static ru.mycrg.data_service.kpt_import.writer.BorderWaterObjectPolylineWriter.BORDERWATEROBJ_POLILYNE_PRO_SCHEMA;
import static ru.mycrg.data_service.kpt_import.writer.KvartalWriter.KVARTAL_KPT_SCHEMA;
import static ru.mycrg.data_service.kpt_import.writer.MunicipalityBoundaryWriter.MUNICIPALITY_BOUNDARIES_EGRN_SCHEMA;
import static ru.mycrg.data_service.kpt_import.writer.OksConstructionPointWriter.OKS_CONSTRUCTIONS_POINTS_SCHEMA;
import static ru.mycrg.data_service.kpt_import.writer.OksPolylineProWriter.OKS_POLYLINE_PRO_SCHEMA;
import static ru.mycrg.data_service.kpt_import.writer.OksProWriter.OKS_PRO_SCHEMA;
import static ru.mycrg.data_service.kpt_import.writer.ZouitWriter.ZOUIT_PRO_SCHEMA;
import static ru.mycrg.data_service.kpt_import.writer.ZuWriter.ZU_PRO_SCHEMA;
import static ru.mycrg.data_service.util.CrsHandler.extractCrsNumber;
import static ru.mycrg.data_service.util.DetailedLogger.logError;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.CREATED_AT;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.CREATED_BY;

/**
 * Обработчик запроса на импорт КПТ из XML
 */
@Component
public class ImportKptHandler implements IEventHandler {

    private static final Logger log = LoggerFactory.getLogger(ImportKptHandler.class);

    private static final int BATCH_INSERT_SIZE = 200;

    private static final String KVARTAL_SCHEMA = "kvartal_kpt";

    private final XMLInputFactory xmlInputFactory;
    private final KptValidator kptValidator;
    private final TmpTablesService tmpTablesService;
    private final TaskLogDetachedDao taskLogDetachedDao;
    private final KptImportDao kptImportDao;
    private final TasksDetachedDao tasksDetachedDao;
    private final DatasourceFactory datasourceFactory;
    private final Map<String, KptXmlElementReader<? extends KptElement>> tagReaders;
    private final Map<Class<? extends KptElement>, KptElementWriter> kptElementsWriters;
    /**
     * Соответствие названия схем таблиц БД с тэгами xml
     */
    private final Map<String, Set<String>> schemaNameTags = new HashMap<>();
    /**
     * Флаг выполнения импорта для обеспечения возможности отмены операции
     */
    private final AtomicBoolean running = new AtomicBoolean(false);

    public ImportKptHandler(List<KptXmlElementReader<? extends KptElement>> readers,
                            List<KptElementWriter> writers,
                            KptValidator kptValidator,
                            TaskLogDetachedDao taskLogDetachedDao,
                            KptImportDao kptImportDao,
                            TmpTablesService tmpTablesService,
                            TasksDetachedDao tasksDetachedDao,
                            DatasourceFactory datasourceFactory) {
        this.kptValidator = kptValidator;
        this.taskLogDetachedDao = taskLogDetachedDao;
        this.kptImportDao = kptImportDao;
        this.tmpTablesService = tmpTablesService;
        this.tasksDetachedDao = tasksDetachedDao;
        this.datasourceFactory = datasourceFactory;

        Map<String, KptXmlElementReader<? extends KptElement>> tmpReaders = new HashMap<>();
        readers.forEach(reader -> tmpReaders.put(reader.getXmlTag(), reader));
        this.tagReaders = Collections.unmodifiableMap(tmpReaders);

        Map<Class<? extends KptElement>, KptElementWriter> tmpWriters = new HashMap<>();
        writers.forEach(writer -> writer.getTargetClasses().forEach(clz -> tmpWriters.put(clz, writer)));
        this.kptElementsWriters = Collections.unmodifiableMap(tmpWriters);

        this.xmlInputFactory = XMLInputFactory.newFactory();

        initSchemaNameTags();
    }

    @Override
    public String getEventType() {
        return ImportKptEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent busEvent) {
        try {
            StopWatch importTimer = new StopWatch();
            importTimer.start();
            ImportKptEvent event = (ImportKptEvent) busEvent;
            log.info("Получено событие импорта КПТ из XML id: {}, taskId: {}", busEvent.getId(), event.getTaskId());

            String dbName = event.getDbName();
            if (taskFinished(dbName, event.getTaskId())) {
                return;
            }

            tasksDetachedDao.updateStatus(dbName, event.getTaskId(), TaskStatus.IN_PROGRESS);
            running.set(true);

            List<ImportKptTableDto> targetTables = event.getTables();
            List<SchemaDto> schemas = targetTables.stream()
                                                  .map(ImportKptTableDto::getSchema)
                                                  .collect(Collectors.toList());

            try {
                tmpTablesService.createIfNotExists(dbName, schemas);
            } catch (Exception e) {
                String message = "Не удалось создать временные таблицы для импорта!";
                log.error(message, e);
                writeErrorToTaskLog(dbName, event.getTaskId(), message);

                return;
            }

            try {
                tmpTablesService.cleanTmpTables(dbName, schemas);
            } catch (CrgDaoException e) {
                log.error("Ошибка очистки временной таблицы!", e);
                writeErrorToTaskLog(dbName, event.getTaskId(), "Не удалось очистить временные таблицы");

                return;
            }

            Map<Class<? extends KptElement>, KptElementWriter> requiredWriters = chooseWriters(targetTables);
            Set<String> requiredTags = getRequiredTags(schemas);

            int threadsCount = Math.min(4, event.getSourceFiles().size());
            CountDownLatch latch = new CountDownLatch(event.getSourceFiles().size());
            ExecutorService executorService = Executors.newFixedThreadPool(threadsCount);
            for (int i = 0; i < event.getSourceFiles().size(); ++i) {
                int finalI = i;
                executorService
                        .execute(() -> {
                                     ImportSourceFileDto kpt = event.getSourceFiles().get(finalI);
                                     try {
                                         handleKpt(kpt,
                                                   requiredTags,
                                                   schemas,
                                                   requiredWriters,
                                                   event,
                                                   targetTables);
                                     } catch (Exception e) {
                                         log.error("Непредвиденная ошибка импорта из файла: '{}' => {}",
                                                   kpt.getDocument().getTitle(), e.getMessage(), e);
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
                tasksDetachedDao.updateStatus(dbName, event.getTaskId(), TaskStatus.DONE);
            }

            for (ImportKptTableDto table: targetTables) {
                ResourceQualifier qualifier = new ResourceQualifier(table.getDataset(), table.getTable());

                deduplicateData(dbName, qualifier, table.getSchema());
                fixGeometry(dbName, qualifier);
            }

            importTimer.stop();
            log.info("Импорт {} выполнен за {} сек", event.getId(), importTimer.getTotalTimeSeconds());

            datasourceFactory.closeDatasource(dbName, DS_ID);
        } catch (Exception e) {
            String msg = "Не удалось обработать событие импорта КПТ из XML id: " + busEvent.getId();

            logError(msg, e);

            throw new DataServiceException(msg);
        }
    }

    public void cancelImport() {
        running.set(false);
    }

    private void importKpt(ImportSourceFileDto kpt,
                           Set<String> tags,
                           List<SchemaDto> schemas,
                           Map<Class<? extends KptElement>, KptElementWriter> writers,
                           ImportKptEvent importEvent) throws XMLStreamException, IOException {
        StopWatch timer = new StopWatch();
        timer.start();

        String pathToKpt = kpt.getPath();
        try (ZipFile zipKpt = new ZipFile(pathToKpt)) {
            Optional<ZipEntry> xmlZipEntry = extractXmlZipEntry(zipKpt);
            if (xmlZipEntry.isEmpty()) {
                log.error("В архиве не найден xml файл КПТ. kptId: {}, архив: {}",
                          kpt.getDocument().getId(), pathToKpt);
                return;
            }

            ZipEntry xmlFile = xmlZipEntry.get();
            try (InputStream inputStream = zipKpt.getInputStream(xmlFile)) {
                log.info("Импорт КПТ: '{}' из {}/{}", kpt.getDocument().getTitle(), pathToKpt, xmlFile.getName());

                String dbName = importEvent.getDbName();
                String initiator = importEvent.getInitiatorLogin();
                String acsepAt = importEvent.getValidationSettings().getDateOrderCompletion();
                Map<KptElementWriter, List<KptElement>> toWrite = new HashMap<>();
                KvartalElement kvartalElement = new KvartalElement(new HashMap<>()); // кадастровый квартал

                XMLStreamReader streamReader = xmlInputFactory.createXMLStreamReader(inputStream);
                while (streamReader.hasNext()) {
                    if (!running.get()) {
                        break;
                    }

                    List<? extends KptElement> kptElements = getKptElements(tags, streamReader, kvartalElement);
                    if (kptElements.isEmpty()) {
                        continue;
                    }

                    kptElements.forEach(kptElement -> {
                        fillContentWithCommonData(kptElement.getContent(), initiator, kpt.getDocument(), acsepAt);
                    });

                    persistKptElements(dbName, kptElements, writers, toWrite, schemas);
                }

                for (KptElementWriter writer: toWrite.keySet()) {
                    List<KptElement> batch = toWrite.get(writer);
                    if (!batch.isEmpty()) {
                        writeBatch(writer, batch, getKptElementSchema(schemas, writer.getSchemaName()), dbName);
                    }
                }

                if (!kvartalElement.getContent().isEmpty()) {
                    fillContentWithCommonData(kvartalElement.getContent(), initiator, kpt.getDocument(), acsepAt);
                    KptElementWriter kvartalWriter = writers.get(KvartalElement.class);

                    writeBatch(kvartalWriter,
                               List.of(kvartalElement),
                               getKptElementSchema(schemas, kvartalWriter.getSchemaName()),
                               dbName);
                }

                timer.stop();
                log.info("Файл '{}' обработан за {} сек", pathToKpt, timer.getTotalTimeSeconds());
            }
        } catch (IOException ex) {
            log.error("Ошибка чтения архива. КПТ: {}, архив: {}", kpt.getDocument().getId(), pathToKpt, ex);

            throw ex;
        }
    }

    @NotNull
    private List<? extends KptElement> getKptElements(Set<String> tags,
                                                      XMLStreamReader streamReader,
                                                      KvartalElement kvartalElement) throws XMLStreamException {
        int eventType = streamReader.next();
        if (eventType != XMLStreamConstants.START_ELEMENT) {
            return List.of();
        }

        String tagName = streamReader.getLocalName();
        if (!tags.contains(tagName)) {
            return List.of();
        }

        KptXmlElementReader<? extends KptElement> tagReader = tagReaders.get(tagName);
        if (tagReader == null) {
            log.warn("Не найден reader для тэга {}. Элемент пропущен", tagName);

            return List.of();
        }

        if (isKvartalElementTag(tagName)) {
            KvartalPartialDataReader<?, ?> kvartalReader = (KvartalPartialDataReader<?, ?>) tagReader;
            kvartalReader.readKvartalData(streamReader, kvartalElement);

            return List.of();
        }

        try {
            return tagReader.read(streamReader);
        } catch (Exception e) {
            log.error("Ошибка чтения элемента в {}", tagReader.getClass().getSimpleName(), e);

            return List.of();
        }
    }

    private void handleKpt(ImportSourceFileDto kpt,
                           Set<String> tags,
                           List<SchemaDto> schemas,
                           Map<Class<? extends KptElement>, KptElementWriter> writers,
                           ImportKptEvent importEvent,
                           List<ImportKptTableDto> targetTables) {
        if (!running.get()) {
            return;
        }

        StopWatch stopWatch = new StopWatch();
        stopWatch.start();

        String dbName = importEvent.getDbName();
        long taskId = importEvent.getTaskId();

        try {
            // Импортируем КПТ во временные таблицы
            importKpt(kpt, tags, schemas, writers, importEvent);
        } catch (XMLStreamException | IOException ex) {
            String msg = "Ошибка обработки КПТ: " + kpt.getId();
            log.error("{} => {}", msg, ex.getMessage(), ex);

            writeErrorToTaskLog(dbName, taskId, msg);

            return;
        } catch (Exception ex) {
            String msg = "Непредвиденная ошибка импорта файла КПТ: %s" + kpt.getPath();
            log.error("{} из файла: '{}'", msg, kpt.getDocument().getId(), ex);

            writeErrorToTaskLog(dbName, taskId, msg);

            return;
        }

        // Выполняем перенос данных из временных таблиц в целевые
        moveData(importEvent, targetTables, taskId, kpt.getDocument().getTitle());
    }

    private void moveData(ImportKptEvent importEvent,
                          List<ImportKptTableDto> targetTables,
                          long taskId,
                          String documentTitle) {
        String dbName = importEvent.getDbName();
        KptImportValidationSettings validationSettings = importEvent.getValidationSettings();
        if (validationSettings != null) {
            kptValidator.validate(documentTitle,
                                  validationSettings,
                                  targetTables,
                                  dbName,
                                  taskId);
        }

        for (ImportKptTableDto table: targetTables) {
            if (!running.get()) {
                break;
            }

            SchemaDto schema = table.getSchema();
            if (!tmpTableHasRecords(dbName, schema.getName(), documentTitle)) {
                log.info("Данные в таблице: '{}' не обновлены. Отсутствуют записи во временной таблице по кварталу: {}",
                         table, documentTitle);

                continue;
            }

            try {
                copyData(dbName,
                         schema,
                         new ResourceQualifier(table.getDataset(), table.getTable()),
                         documentTitle);
            } catch (Exception e) {
                log.error("Ошибка переноса данных из временной таблицы в '{}'", table, e);
            }
        }
    }

    /**
     * Возвращает множество тэгов, которые необходимо парсить
     */
    private Set<String> getRequiredTags(List<SchemaDto> schemas) {
        return schemas.stream()
                      .map(schema -> schemaNameTags.get(schema.getName()))
                      .flatMap(Set::stream)
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

    private SchemaDto getKptElementSchema(List<SchemaDto> schemas, String schemaName) {
        return schemas.stream()
                      .filter(schemaDto -> schemaName.equals(schemaDto.getName()))
                      .findFirst()
                      .orElse(null);
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

    private void writeErrorToTaskLog(String dbName, Long taskId, String message) {
        taskLogDetachedDao.createTaskLog(dbName,
                                         new TaskLogDto("Импорт КПТ", taskId),
                                         new KptImportValidationResult(ERROR, message),
                                         DS_ID);
    }

    private Map<Class<? extends KptElement>, KptElementWriter> chooseWriters(List<ImportKptTableDto> targetTables) {
        Map<Class<? extends KptElement>, KptElementWriter> writers = new HashMap<>();
        for (Class<? extends KptElement> key: kptElementsWriters.keySet()) {
            KptElementWriter writer = kptElementsWriters.get(key);

            targetTables.stream()
                        .filter(tableDto -> tableDto.getSchema().getName().equals(writer.getSchemaName()))
                        .findFirst()
                        .ifPresent(tableDto -> {
                            writer.setSrid(extractCrsNumber(tableDto.getCrs()));
                            writers.put(key, writer);
                        });
        }

        return writers;
    }

    private boolean isKvartalElementTag(String xmlTag) {
        return schemaNameTags.get(KVARTAL_KPT_SCHEMA).contains(xmlTag);
    }

    private boolean taskFinished(String dbName, long taskId) {
        TaskStatus taskStatus = tasksDetachedDao.getTaskStatus(dbName, taskId);

        return taskStatus == TaskStatus.CANCELED || taskStatus == TaskStatus.DONE;
    }

    private void persistKptElements(String dbName,
                                    List<? extends KptElement> kptElements,
                                    Map<Class<? extends KptElement>, KptElementWriter> writers,
                                    Map<KptElementWriter, List<KptElement>> toWrite,
                                    List<SchemaDto> schemas) {
        for (KptElement kptElement: kptElements) {
            if (!kptElement.hasGeometry()) {
                continue;
            }

            KptElementWriter writer = writers.get(kptElement.getClass());
            if (writer == null) {
                continue;
            }

            List<KptElement> batch = toWrite.computeIfAbsent(writer, k -> new LinkedList<>());

            if (batch.size() >= BATCH_INSERT_SIZE) {
                writeBatch(writer, batch, getKptElementSchema(schemas, writer.getSchemaName()), dbName);
            }

            batch.add(kptElement);
        }
    }

    private void writeBatch(KptElementWriter writer,
                            List<KptElement> batch,
                            SchemaDto schemaDto,
                            String databaseName) {
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
        try {
            Optional<String> oKey = getKeyForDeduplication(schema.getProperties());
            if (oKey.isEmpty()) {
                log.warn("Дедупликация НЕ БУДЕТ ВЫПОЛНЕНА для таблицы: '{}' => не найдено ключевых полей.",
                         qualifier.getQualifier());

                return;
            }

            kptImportDao.deduplicateData(dbName, qualifier, oKey.get());
        } catch (Exception e) {
            log.error("Не удалось выполнить дедупликацию для таблицы: '{}' => {}",
                      qualifier.getQualifier(), e.getMessage(), e);
        }
    }

    private static Optional<String> getKeyForDeduplication(List<SimplePropertyDto> properties) {
        List<String> propertyNames = properties.stream()
                                               .map(SimplePropertyDto::getName)
                                               .collect(Collectors.toList());

        String regnumbord = "regnumbord";
        String regnumborder = "regnumborder";
        String cadastralnum = "cadastralnum";
        String municipalityBoundariesEgrn = "municipality_boundaries_egrn";

        if (propertyNames.contains(regnumbord)) {
            return Optional.of(regnumbord);
        } else if (propertyNames.contains(regnumborder)) {
            return Optional.of(regnumborder);
        } else if (propertyNames.contains(cadastralnum)) {
            return Optional.of(cadastralnum);
        } else if (propertyNames.contains(municipalityBoundariesEgrn)) {
            return Optional.of(municipalityBoundariesEgrn);
        } else {
            return Optional.empty();
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
        schemaNameTags.put(ZU_PRO_SCHEMA, Set.of(ZuElement.XML_TAG));
        schemaNameTags.put(ZOUIT_PRO_SCHEMA, Set.of(ZouitElement.XML_TAG));
        schemaNameTags.put(KVARTAL_KPT_SCHEMA, Set.of("cadastral_number", "area_quarter", "spatial_data"));
        schemaNameTags.put(MUNICIPALITY_BOUNDARIES_EGRN_SCHEMA, Set.of(MunicipalityBoundaryElement.XML_TAG));
        schemaNameTags.put(OKS_PRO_SCHEMA, Set.of(OksConstructionElement.XML_TAG,
                                                  OksBuildingElement.XML_TAG,
                                                  OksUnderConstructionElement.XML_TAG));
        schemaNameTags.put(OKS_POLYLINE_PRO_SCHEMA, Set.of(OksConstructionElement.XML_TAG,
                                                           OksUnderConstructionElement.XML_TAG));
        schemaNameTags.put(OKS_CONSTRUCTIONS_POINTS_SCHEMA, Set.of(OksConstructionElement.XML_TAG,
                                                                   OksUnderConstructionElement.XML_TAG));
        schemaNameTags.put(BORDERWATEROBJ_SCHEMA, Set.of(BorderWaterObjectElement.XML_TAG));
        schemaNameTags.put(BORDERWATEROBJ_POLILYNE_PRO_SCHEMA, Set.of(BorderWaterObjectElement.XML_TAG));
    }
}
