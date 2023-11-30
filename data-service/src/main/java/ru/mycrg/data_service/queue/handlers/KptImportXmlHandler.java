package ru.mycrg.data_service.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;
import ru.mycrg.data_service.kpt_import.model.KptElement;
import ru.mycrg.data_service.kpt_import.model.ZuElement;
import ru.mycrg.data_service.kpt_import.reader.KptXmlElementReader;
import ru.mycrg.data_service.kpt_import.writer.KptElementWriter;
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

import static ru.mycrg.data_service.util.SystemLibraryAttributes.CREATED_AT;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.CREATED_BY;

/**
 * Обработчик запроса на импорт КПТ из XML
 */
@Component
public class KptImportXmlHandler implements IEventHandler {

    private static final Logger log = LoggerFactory.getLogger(KptImportXmlHandler.class);
    private static final int BATCH_INSERT_SIZE = 50;

    private final Map<String, KptXmlElementReader<? extends KptElement>> tagReaders;
    private final Map<Class<? extends KptElement>, KptElementWriter> kptElementsWriters;
    /**
     * Соответствие элементов КПТ со схемами таблиц в БД
     */
    private final Map<Class<? extends KptElement>, String> kptElementSchemaNames = new HashMap<>();
    /**
     * Соответствие названия схем таблиц БД с тэгами xml
     */
    private final Map<String, Set<String>> schemaNameTags = new HashMap<>();

    public KptImportXmlHandler(List<KptXmlElementReader<? extends KptElement>> readers,
                               List<KptElementWriter> writers) {
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
        Set<String> requiredTags = getRequiredTags(importEvent.getLayerSchemas());
        for (ImportSourceFileDto file: importEvent.getSourceFiles()) {
            try {
                importFile(file, requiredTags, importEvent.getLayerSchemas(), importEvent.getInitiatorLogin(),
                           importEvent.getDbName());
            } catch (XMLStreamException ex) {
                log.error("Ошибка чтения xml файла " + file.getPath(), ex);
                //todo task log
            } catch (Exception ex) {
                log.error("Ошибка импорта КПТ kptId={} из файла {}", file.getDocument().getId(), file.getPath(), ex);
            }
        }
    }

    /**
     * Возвращает множество тэгов, которые необходимо парсить
     */
    private Set<String> getRequiredTags(List<SchemaDto> schemas) {
        return schemas.stream().map(schema -> schemaNameTags.get(schema.getName())).flatMap(Set::stream)
                      .collect(Collectors.toSet());
    }

    public void importFile(ImportSourceFileDto file, Set<String> requiredTags, List<SchemaDto> requiredSchemas,
                           String initiator, String databaseName) throws XMLStreamException {
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
                        log.debug("Элемент {} пропущен т.к. не содержит геометрию",
                                  kptElement.getClass().getSimpleName());
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
        }
    }

    private Optional<ZipEntry> extractXmlZipEntry(ZipFile zipFile) {
        Enumeration<? extends ZipEntry> entries = zipFile.entries();
        ZipEntry xmlEntry = null;
        while (entries.hasMoreElements()) {
            ZipEntry entry = entries.nextElement();
            String[] parts = entry.getName().split("\\.");
            if ("xml".equals(parts[parts.length - 1])) {
                xmlEntry = entry;
                break;
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
                                          List<SchemaDto> requiredSchemas) {
        String schemaName = kptElementSchemaNames.get(elementClass);
        return requiredSchemas.stream()
                              .filter(schemaDto -> schemaName.equals(schemaDto.getName()))
                              .findFirst()
                              .get();
    }
}
