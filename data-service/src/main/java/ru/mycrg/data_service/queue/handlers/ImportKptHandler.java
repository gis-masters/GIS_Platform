package ru.mycrg.data_service.queue.handlers;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;
import ru.mycrg.common_contracts.generated.data_service.TaskLogDto;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.dao.detached.KptImportDao;
import ru.mycrg.data_service.dao.detached.TaskLogDetachedDao;
import ru.mycrg.data_service.dao.detached.TasksDetachedDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
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
import ru.mycrg.data_service_contract.enums.GeometryType;
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

import static ru.mycrg.data_service.config.CrgCommonConfig.SYSTEM_USER_ID;
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
import static ru.mycrg.data_service.service.smev3.fields.CommonFields.CADASTRALNUM;
import static ru.mycrg.data_service.service.smev3.fields.KptFields.REGNUMBORD;
import static ru.mycrg.data_service.service.smev3.fields.KptFields.REGNUMBORDER;
import static ru.mycrg.data_service.util.CrsHandler.extractCrsNumber;
import static ru.mycrg.data_service.util.DetailedLogger.logError;
import static ru.mycrg.data_service.util.KptZipUtil.extractXmlReport;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.CREATED_AT;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.CREATED_BY;
import static ru.mycrg.data_service_contract.enums.TaskStatus.*;

/**
 * Обработчик запроса на импорт КПТ из XML
 */
@Component
public class ImportKptHandler implements IEventHandler {

    private static final Logger log = LoggerFactory.getLogger(ImportKptHandler.class);

    private static final int BATCH_INSERT_SIZE = 400;

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
    private final Map<String, Set<String>> schemaNameTags = Map.of(
            ZU_PRO_SCHEMA, Set.of(ZuElement.XML_TAG),
            ZOUIT_PRO_SCHEMA, Set.of(ZouitElement.XML_TAG),
            BORDERWATEROBJ_SCHEMA, Set.of(BorderWaterObjectElement.XML_TAG),
            BORDERWATEROBJ_POLILYNE_PRO_SCHEMA, Set.of(BorderWaterObjectElement.XML_TAG),
            KVARTAL_KPT_SCHEMA, Set.of("cadastral_number", "area_quarter", "spatial_data"),
            MUNICIPALITY_BOUNDARIES_EGRN_SCHEMA, Set.of(MunicipalityBoundaryElement.XML_TAG),
            OKS_PRO_SCHEMA, Set.of(OksConstructionElement.XML_TAG,
                                   OksBuildingElement.XML_TAG,
                                   OksUnderConstructionElement.XML_TAG),
            OKS_POLYLINE_PRO_SCHEMA, Set.of(OksConstructionElement.XML_TAG,
                                            OksUnderConstructionElement.XML_TAG),
            OKS_CONSTRUCTIONS_POINTS_SCHEMA, Set.of(OksConstructionElement.XML_TAG,
                                                    OksUnderConstructionElement.XML_TAG));

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

            tasksDetachedDao.updateStatus(dbName, event.getTaskId(), IN_PROGRESS);
            running.set(true);

            List<ImportKptTableDto> targetTables = event.getTables();
            List<SchemaDto> schemas = targetTables.stream()
                                                  .map(ImportKptTableDto::getSchema)
                                                  .collect(Collectors.toList());

            try {
                tmpTablesService.recreateTable(dbName, schemas);
            } catch (Exception e) {
                String message = "Не удалось создать временные таблицы для импорта!";
                log.error(message, e);
                writeErrorToTaskLog(dbName, event.getTaskId(), SYSTEM_USER_ID, message);

                return;
            }

            try {
                tmpTablesService.cleanTmpTables(dbName, schemas);
            } catch (CrgDaoException e) {
                log.error("Ошибка очистки временной таблицы!", e);
                writeErrorToTaskLog(dbName,
                                    event.getTaskId(),
                                    SYSTEM_USER_ID,
                                    "Не удалось очистить временные таблицы");

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
                for (ImportKptTableDto table: targetTables) {
                    ResourceQualifier qualifier = new ResourceQualifier(table.getDataset(), table.getTable());

                    deduplicateData(dbName, qualifier, table.getSchema());
                    fixGeometry(dbName, qualifier);
                    unpackGeometryCollection(dbName, qualifier, table.getSchema().getGeometryType());
                }

                tasksDetachedDao.updateStatus(dbName, event.getTaskId(), DONE);
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

        TypeDocumentData kptDocument = kpt.getDocument();
        String pathToKpt = kpt.getPath();
        try (ZipFile zipKpt = new ZipFile(pathToKpt)) {
            Optional<ZipEntry> xmlZipEntry = extractXmlReport(zipKpt);
            if (xmlZipEntry.isEmpty()) {
                log.error("В архиве не найден xml файл КПТ. kptId: {}, архив: {}", kptDocument.getId(), pathToKpt);

                return;
            }

            ZipEntry xmlFile = xmlZipEntry.get();
            try (InputStream inputStream = zipKpt.getInputStream(xmlFile)) {
                log.info("Импорт КПТ: '{}' из {}/{}", kptDocument.getTitle(), pathToKpt, xmlFile.getName());

                long taskId = importEvent.getTaskId();
                String dbName = importEvent.getDbName();
                String initiator = importEvent.getInitiatorLogin();
                String acceptAt = importEvent.getValidationSettings().getDateOrderCompletion();
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
                        Map<String, Object> filledContent = fillContentWithCommonData(kptElement.getContent(),
                                                                                      initiator,
                                                                                      kptDocument,
                                                                                      acceptAt);
                        kptElement.setContent(filledContent);
                    });

                    persistKptElements(dbName, kptElements, writers, toWrite, schemas, taskId);
                }

                for (KptElementWriter writer: toWrite.keySet()) {
                    List<KptElement> batch = toWrite.get(writer);
                    if (!batch.isEmpty()) {
                        writeBatch(writer,
                                   batch,
                                   getKptElementSchema(schemas, writer.getSchemaName()),
                                   dbName,
                                   taskId);
                    }
                }

                Map<String, Object> content = kvartalElement.getContent();
                if (!content.isEmpty()) {
                    Map<String, Object> filledContent = fillContentWithCommonData(content,
                                                                                  initiator,
                                                                                  kptDocument,
                                                                                  acceptAt);
                    kvartalElement.setContent(filledContent);

                    List<KptElement> batch = new ArrayList<>();
                    batch.add(kvartalElement);

                    KptElementWriter kvartalWriter = writers.get(KvartalElement.class);
                    writeBatch(kvartalWriter,
                               batch,
                               getKptElementSchema(schemas, kvartalWriter.getSchemaName()),
                               dbName,
                               taskId);
                }

                timer.stop();
                log.info("Файл '{}' обработан за {} сек", pathToKpt, timer.getTotalTimeSeconds());
            }
        } catch (IOException ex) {
            log.error("Ошибка чтения архива. КПТ: {}, архив: {}", kptDocument.getId(), pathToKpt, ex);

            throw ex;
        }
    }

    @NotNull
    private List<? extends KptElement> getKptElements(Set<String> tags,
                                                      XMLStreamReader streamReader,
                                                      KvartalElement kvartalElement) throws XMLStreamException {
        List<KptElement> empty = Collections.emptyList();

        int eventType = streamReader.next();
        if (eventType != XMLStreamConstants.START_ELEMENT) {
            return empty;
        }

        String tagName = streamReader.getLocalName();
        if (!tags.contains(tagName)) {
            return empty;
        }

        KptXmlElementReader<? extends KptElement> tagReader = tagReaders.get(tagName);
        if (tagReader == null) {
            log.warn("Не найден reader для тэга {}. Элемент пропущен", tagName);

            return empty;
        }

        if (isKvartalElementTag(tagName)) {
            KvartalPartialDataReader<?, ?> kvartalReader = (KvartalPartialDataReader<?, ?>) tagReader;
            kvartalReader.readKvartalData(streamReader, kvartalElement);

            return empty;
        }

        try {
            return tagReader.read(streamReader);
        } catch (Exception e) {
            log.error("Ошибка чтения элемента в {}", tagReader.getClass().getSimpleName(), e);

            return empty;
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

            writeErrorToTaskLog(dbName, taskId, SYSTEM_USER_ID, msg);

            return;
        } catch (Exception ex) {
            String msg = "Непредвиденная ошибка импорта файла КПТ: %s" + kpt.getPath();
            log.error("{} из файла: '{}'", msg, kpt.getDocument().getId(), ex);

            writeErrorToTaskLog(dbName, taskId, importEvent.getUserIdAssignedToTask(), msg);

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
                writeErrorToTaskLog(dbName, taskId, SYSTEM_USER_ID, e.getMessage());
            }
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

    /**
     * Возвращает множество тэгов, которые необходимо парсить
     */
    private Set<String> getRequiredTags(List<SchemaDto> schemas) {
        return schemas.stream()
                      .map(schema -> schemaNameTags.get(schema.getName()))
                      .flatMap(Set::stream)
                      .collect(Collectors.toSet());
    }

    private Map<String, Object> fillContentWithCommonData(Map<String, Object> content,
                                                          String initiator,
                                                          TypeDocumentData document,
                                                          String acceptAt) {
        Map<String, Object> result = new HashMap<>(content);

        result.put(CREATED_BY.getName(), initiator);
        result.put("source_doc", String.format("[%s]", document.toString()));
        result.put("acsept_at", acceptAt);
        result.put(CREATED_AT.getName(), LocalDateTime.now());

        return result;
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

        Set<String> excludedValues = Set.of("area", "lenght", targetTableQualifier.getPrimaryKeyName());
        List<SimplePropertyDto> properties = schema.getProperties().stream()
                                                   .filter(prop -> !excludedValues.contains(prop.getName()))
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

    private void writeErrorToTaskLog(String dbName, Long taskId, Long createdBy, String message) {
        taskLogDetachedDao.createTaskLog(dbName,
                                         new TaskLogDto("Импорт КПТ", taskId, createdBy),
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

        return taskStatus == CANCELED || taskStatus == DONE;
    }

    private void persistKptElements(String dbName,
                                    List<? extends KptElement> kptElements,
                                    Map<Class<? extends KptElement>, KptElementWriter> writers,
                                    Map<KptElementWriter, List<KptElement>> toWrite,
                                    List<SchemaDto> schemas,
                                    long taskId) {
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
                writeBatch(writer, batch, getKptElementSchema(schemas, writer.getSchemaName()), dbName, taskId);
            }

            batch.add(kptElement);
        }
    }

    private void writeBatch(KptElementWriter writer,
                            List<KptElement> batch,
                            SchemaDto schemaDto,
                            String databaseName,
                            long taskId) {
        try {
            writer.writeBatch(batch, schemaDto, databaseName);
        } catch (Exception e) {
            log.error("Ошибка сохранения данных слоя {}", writer.getSchemaName(), e);

            writeErrorToTaskLog(databaseName, taskId, SYSTEM_USER_ID, e.getMessage());
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

    private Optional<String> getKeyForDeduplication(List<SimplePropertyDto> properties) {
        List<String> propertyNames = properties.stream()
                                               .map(SimplePropertyDto::getName)
                                               .collect(Collectors.toList());

        if (propertyNames.contains(REGNUMBORD)) {
            return Optional.of(REGNUMBORD);
        } else if (propertyNames.contains(REGNUMBORDER)) {
            return Optional.of(REGNUMBORDER);
        } else if (propertyNames.contains(CADASTRALNUM)) {
            return Optional.of(CADASTRALNUM);
        } else if (propertyNames.contains(MUNICIPALITY_BOUNDARIES_EGRN_SCHEMA)) {
            return Optional.of(MUNICIPALITY_BOUNDARIES_EGRN_SCHEMA);
        } else {
            return Optional.empty();
        }
    }

    private void fixGeometry(String dbName, ResourceQualifier qualifier) {
        log.debug("Выполняем исправление геометрии для: {}", qualifier.getQualifier());

        try {
            kptImportDao.makeGeometryValid(dbName, qualifier);
        } catch (Exception e) {
            log.error("Не удалось исправить геометрию для таблицы: '{}' => {}",
                      qualifier.getQualifier(), e.getMessage(), e);
        }
    }

    private void unpackGeometryCollection(String dbName, ResourceQualifier qualifier, GeometryType geometryType) {
        log.debug("Выполняем 'распаковку' GeometryCollection для: {}", qualifier.getQualifier());

        try {
            List<String> infectedRecords = kptImportDao.findRecordsWithGeometryCollection(dbName, qualifier)
                                                       .stream()
                                                       .map(feature -> String.valueOf(feature.getId()))
                                                       .collect(Collectors.toList());
            if (infectedRecords.isEmpty()) {
                return;
            }

            log.debug("infectedRecords: {}", infectedRecords);

            kptImportDao.unpackGeometryCollection(dbName,
                                                  qualifier,
                                                  infectedRecords,
                                                  restrictGeometryType(geometryType));
        } catch (Exception e) {
            log.error("Не удалось выполнить 'распаковку' GeometryCollection для таблицы: '{}' => {}",
                      qualifier.getQualifier(), e.getMessage(), e);
        }
    }

    private String restrictGeometryType(GeometryType geometryType) {
        switch (geometryType) {
            case POINT:
            case MULTI_POINT:
                return "POINT";
            case POLYGON:
            case MULTI_POLYGON:
                return "POLYGON";
            case LINE_STRING:
            case MULTI_LINE_STRING:
                return "LINESTRING";
            case CURVE:
            case MULTI_CURVE:
                return "CURVE";
            case SURFACE:
            case MULTI_SURFACE:
                return "SURFACE";
            default:
                return "POLYGON";
        }
    }
}
