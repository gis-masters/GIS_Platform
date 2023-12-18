package ru.mycrg.data_service.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;
import ru.mycrg.data_service.dao.detached.DetachedRecordsDao;
import ru.mycrg.data_service.dao.detached.KptImportDao;
import ru.mycrg.data_service.dao.detached.TaskLogDetachedDao;
import ru.mycrg.data_service.dao.detached.TasksDetachedDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.TaskLogDto;
import ru.mycrg.data_service.kpt_import.TmpTablesCreator;
import ru.mycrg.data_service.kpt_import.model.*;
import ru.mycrg.data_service.kpt_import.model.oks.OksBuildingElement;
import ru.mycrg.data_service.kpt_import.model.oks.OksConstructionElement;
import ru.mycrg.data_service.kpt_import.model.oks.OksUnderConstructionElement;
import ru.mycrg.data_service.kpt_import.reader.KptXmlElementReader;
import ru.mycrg.data_service.kpt_import.reader.kvartal.KvartalPartialDataReader;
import ru.mycrg.data_service.kpt_import.validation.KptImportLogLevel;
import ru.mycrg.data_service.kpt_import.validation.KptImportValidationResult;
import ru.mycrg.data_service.kpt_import.validation.KptImportValidatorService;
import ru.mycrg.data_service.kpt_import.writer.KptElementWriter;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.ImportSourceFileDto;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.dto.TypeDocumentData;
import ru.mycrg.data_service_contract.dto.import_.KptImportTableDto;
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
                               TasksDetachedDao tasksDetachedDao) {
        this.validationService = validationService;
        this.recordsDao = recordsDao;
        this.taskLogDetachedDao = taskLogDetachedDao;
        this.kptImportDao = kptImportDao;
        this.tmpTablesCreator = tmpTablesCreator;
        this.tasksDetachedDao = tasksDetachedDao;
        Map<String, KptXmlElementReader<? extends KptElement>> tmpReaders = new HashMap<>();
        Map<Class<? extends KptElement>, KptElementWriter> tmpWriters = new HashMap<>();
        readers.forEach(reader -> tmpReaders.put(reader.getXmlTag(), reader));
        writers.forEach(writer -> writer.getTargetClasses().forEach(clz -> tmpWriters.put(clz, writer)));
        tagReaders = Collections.unmodifiableMap(tmpReaders);
        kptElementsWriters = Collections.unmodifiableMap(tmpWriters);
        initSchemaNameTags();
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

    @Override
    public String getEventType() {
        return KptImportXmlRequestEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent event) {
        StopWatch importTimer = new StopWatch();
        importTimer.start();
        log.info("Получено событие импорта КПТ из XML id: {}", event.getId());
        KptImportXmlRequestEvent importEvent = (KptImportXmlRequestEvent) event;
        String dbName = importEvent.getDbName();

        if (taskCancelled(dbName, importEvent.getTaskId())) {
            return;
        }
        tasksDetachedDao.updateStatus(dbName, importEvent.getTaskId(), TaskStatus.IN_PROGRESS);
        running.set(true);

        List<KptImportTableDto> targetTables = importEvent.getTables();
        Collection<SchemaDto> requiredSchemas = targetTables.stream()
                                                            .map(KptImportTableDto::getSchemaDto)
                                                            .collect(Collectors.toList());
        Map<Class<? extends KptElement>, KptElementWriter> requiredWriters = chooseWriters(requiredSchemas);
        Set<String> requiredTags = getRequiredTags(requiredSchemas);

        try {
            tmpTablesCreator.createIfNotExists(dbName, requiredSchemas);
        } catch (Exception e) {
            String message = "Не удалось создать временные таблицы для импорта!";
            log.error(message, e);
            writeTaskLog(dbName, importEvent.getTaskId(), KptImportLogLevel.ERROR, message);
            return;
        }

        try {
            cleanTmpTables(requiredSchemas, dbName);
        } catch (CrgDaoException e) {
            log.error("Ошибка очистки временной таблицы!", e);
            writeTaskLog(dbName, importEvent.getTaskId(), KptImportLogLevel.ERROR,
                         "Не удалось очистить временные таблицы");
            return;
        }

        int threadsCount = Math.min(4, importEvent.getSourceFiles().size());
        CountDownLatch latch = new CountDownLatch(importEvent.getSourceFiles().size());
        ExecutorService executorService = Executors.newFixedThreadPool(threadsCount);
        for (int i = 0; i < importEvent.getSourceFiles().size(); ++i) {
            int finalI = i;
            executorService.execute(() -> executeFile(importEvent.getSourceFiles().get(finalI),
                                                      requiredTags,
                                                      requiredSchemas,
                                                      requiredWriters,
                                                      importEvent,
                                                      dbName,
                                                      targetTables,
                                                      latch)
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

        importTimer.stop();
        log.info("Импорт {} выполнен за {} сек", importEvent.getId(), importTimer.getTotalTimeSeconds());
    }

    private void executeFile(ImportSourceFileDto file, Set<String> requiredTags,
                             Collection<SchemaDto> requiredSchemas,
                             Map<Class<? extends KptElement>, KptElementWriter> requiredWriters,
                             KptImportXmlRequestEvent importEvent, String dbName,
                             List<KptImportTableDto> targetTables, CountDownLatch latch) {
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();
        boolean validate = importEvent.getValidationSettings() != null;

        if (!running.get()) {
            latch.countDown();
            return;
        }

        try {
            importFile(file, requiredTags, requiredSchemas, requiredWriters, importEvent.getInitiatorLogin(),
                       dbName, importEvent.getValidationSettings().getDateOrderCompletion());
        } catch (XMLStreamException | IOException ex) {
            log.error("Ошибка чтения xml файла " + file.getPath(), ex);
            writeTaskLog(dbName, importEvent.getTaskId(), KptImportLogLevel.ERROR,
                         String.format("Не прочитать файл КПТ %s: %s", file.getPath(), ex.getMessage()));
            latch.countDown();
            return;
        } catch (Exception ex) {
            log.error("Ошибка импорта КПТ kptId={} из файла {}", file.getDocument().getId(), file.getPath(), ex);
            writeTaskLog(dbName, importEvent.getTaskId(), KptImportLogLevel.ERROR,
                         String.format("Непредвиденная ошибка импорта файла КПТ %s: %s", file.getPath(),
                                       ex.getMessage())
            );
            latch.countDown();
            return;
        }

        if (validate) {
            validationService.validate(file.getDocument().getTitle(),
                                       importEvent.getValidationSettings(),
                                       targetTables,
                                       dbName,
                                       importEvent.getTaskId()
            );
        }

        for (KptImportTableDto table: targetTables) {
            if (!running.get()) {
                break;
            }

            ResourceQualifier rq = new ResourceQualifier(table.getResourceQualifierDto().getDataset(),
                                                         table.getResourceQualifierDto().getTable());

            try {
                copyData(table.getSchemaDto(),
                         rq,
                         file.getDocument().getTitle(),
                         importEvent.getDbName()
                );
            } catch (Exception e) {
                log.error("Ошибка переноса данных из временной таблицы в "
                                  + table.getResourceQualifierDto().getTable(), e);
            }

            deduplicateData(dbName, table.getSchemaDto(), rq);
        }
        latch.countDown();
    }

    public void cancelImport() {
        running.set(false);
    }

    /**
     * Возвращает множество тэгов, которые необходимо парсить
     */
    private Set<String> getRequiredTags(Collection<SchemaDto> schemas) {
        return schemas.stream().map(schema -> schemaNameTags.get(schema.getName())).flatMap(Set::stream)
                      .collect(Collectors.toSet());
    }

    public void importFile(ImportSourceFileDto file, Set<String> requiredTags, Collection<SchemaDto> requiredSchemas,
                           Map<Class<? extends KptElement>, KptElementWriter> requiredWriters,
                           String initiator, String databaseName, String acsepAt) throws XMLStreamException,
                                                                                         IOException {
        String filePath = file.getPath();
        StopWatch timer = new StopWatch();
        timer.start();

        KvartalElement kvartalElement = new KvartalElement(new HashMap<>()); //кадастровый квартал

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
                        log.error("Ошибка чтения элемента в " + tagReader.getClass().getSimpleName(), e);
                        continue;
                    }

                    persistKptElements(kptElements, requiredWriters, toWrite, requiredSchemas, databaseName,
                                       initiator, file.getDocument(), acsepAt);
                }

                for (KptElementWriter writer: toWrite.keySet()) {
                    List<KptElement> batch = toWrite.get(writer);
                    if (!batch.isEmpty()) {
                        writeBatch(writer, batch, getKptElementSchema(writer, requiredSchemas), databaseName);
                    }
                }

                if (!kvartalElement.getContent().isEmpty()) {
                    fillContentWithCommonData(kvartalElement.getContent(), initiator, file.getDocument(), acsepAt);
                    KptElementWriter kvartalWriter = requiredWriters.get(KvartalElement.class);
                    SchemaDto schema = getKptElementSchema(kvartalWriter, requiredSchemas);
                    List<KptElement> list = new ArrayList<>();
                    list.add(kvartalElement);
                    writeBatch(kvartalWriter, list, schema, databaseName);
                }

                timer.stop();
                log.info("Файл {} обработан за {} сек", filePath, timer.getTotalTimeSeconds());
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

    private void fillContentWithCommonData(Map<String, Object> content, String initiator, TypeDocumentData document,
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
            ResourceQualifier rq = new ResourceQualifier(SYSTEM_SCHEMA_NAME, tmbTableName(schema.getName()));
            recordsDao.truncateTable(rq, dbName);
        }
    }

    private void copyData(SchemaDto schema, ResourceQualifier targetQualifier, String cadastralSquare, String dbName) {
        StopWatch timer = new StopWatch();
        timer.start();

        Set<String> generatedValues = Set.of("area", "lenght");
        String sourceTable = tmbTableName(schema.getName());
        ResourceQualifier sourceQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, sourceTable);
        List<SimplePropertyDto> properties = schema.getProperties().stream()
                                                   .filter(it -> !generatedValues.contains((it.getName())))
                                                   .collect(Collectors.toList());

        kptImportDao.deleteAllByCadatstralSquare(dbName, targetQualifier, cadastralSquare);
        kptImportDao.copyCadastralSquare(dbName, sourceQualifier, targetQualifier, properties,
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

    private boolean taskCancelled(String dbName, long taskId) {
        return tasksDetachedDao.getTaskStatus(dbName, taskId) == TaskStatus.CANCELED;
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
            log.error("Ошибка сохранения данных слоя " + writer.getSchemaName(), e);
        }
        batch.clear();
    }

    private void deduplicateData(String dbName, SchemaDto schemaDto, ResourceQualifier resourceQualifier) {
        List<String> properties = schemaDto.getProperties().stream().map(SimplePropertyDto::getName).collect(
                Collectors.toList());
        boolean hasCadastralnum = properties.stream().anyMatch(CADASTRALNUM_PROPERTY::equals);
        boolean hasRegnumbodr = properties.stream().anyMatch(REGNUMBORD_PROPERTY::equals);

        if (!hasCadastralnum && !hasRegnumbodr) {
            log.error("Невозможно дедуплицировать строки для таблицы {} - нет полей cadastralnum/regnumbord для " +
                              "группировки", resourceQualifier);
            return;
        }

        String groupByProperty = hasCadastralnum ? CADASTRALNUM_PROPERTY : REGNUMBORD_PROPERTY;

        try {
            kptImportDao.deduplicateData(dbName, resourceQualifier, groupByProperty, "created_at");
        } catch (Exception e) {
            log.error("Ошибка дедупликации данных!", e);
        }
    }
}
