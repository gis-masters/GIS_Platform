package ru.mycrg.data_service.service.gisogd;

import com.fasterxml.jackson.core.type.TypeReference;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.util.UriComponentsBuilder;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.BaseDao;
import ru.mycrg.data_service.dao.GisogdRfDao;
import ru.mycrg.data_service.dao.SpatialRecordsDao;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.RecordEntity;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.SchemaExtractor;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service.service.cqrs.tasks.requests.CreateTaskRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.dto.TypeDocumentData;
import ru.mycrg.data_service_contract.dto.TypeUrlData;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;
import ru.mycrg.gisog_service_contract.dto.Document;
import ru.mycrg.mediator.Mediator;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.net.URLDecoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import static java.lang.String.format;
import static java.nio.charset.StandardCharsets.UTF_8;
import static java.time.LocalDateTime.now;
import static java.time.format.DateTimeFormatter.ISO_DATE_TIME;
import static java.util.UUID.fromString;
import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultOrganizationName;
import static ru.mycrg.data_service.config.CrgCommonConfig.SYSTEM_DATETIME_PATTERN;
import static ru.mycrg.data_service.dao.config.DaoProperties.DEFAULT_GEOMETRY_COLUMN_NAME;
import static ru.mycrg.data_service.dao.config.DaoProperties.GISOGFRF_RESPONSE;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.*;
import static ru.mycrg.data_service.service.TaskService.TASKS_SCHEMA;
import static ru.mycrg.data_service.service.TaskService.TASK_TABLE_NAME;
import static ru.mycrg.data_service.service.resources.DatasetService.SCHEMAS_AND_TABLES_QUALIFIER;
import static ru.mycrg.data_service.util.JsonConverter.asJsonString;
import static ru.mycrg.data_service.util.JsonConverter.mapper;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.*;
import static ru.mycrg.data_service_contract.enums.TaskType.SYSTEM;
import static ru.mycrg.data_service_contract.enums.ValueType.DOCUMENT;
import static ru.mycrg.data_service_contract.enums.ValueType.URL;

@Service
public class GisogdRfPublisher {

    public static final String INBOX_MARKER = "inbox_data";
    public static final String FILE_WITH_FIELDS = "gisogdrfFields.json";

    @Value("${crg-options.fileStoragePath}")
    private String baseFileStoragePath;

    private final Logger log = LoggerFactory.getLogger(GisogdRfPublisher.class);

    private final BaseDao baseDao;
    private final GisogdRfDao gisogdRfDao;
    private final SpatialRecordsDao spatialRecordsDao;

    private final Mediator mediator;
    private final IMessageBusProducer messageBus;
    private final IAuthenticationFacade authenticationFacade;

    private final GisogdRfUtil gisogdRfUtil;
    private final SchemaService schemaService;
    private final SchemaExtractor schemaExtractor;

    public GisogdRfPublisher(BaseDao baseDao,
                             Mediator mediator,
                             GisogdRfDao gisogdRfDao,
                             GisogdRfUtil gisogdRfUtil,
                             SchemaService schemaService,
                             IMessageBusProducer messageBus,
                             SchemaExtractor schemaExtractor,
                             SpatialRecordsDao spatialRecordsDao,
                             IAuthenticationFacade authenticationFacade) {
        this.baseDao = baseDao;
        this.mediator = mediator;
        this.messageBus = messageBus;
        this.gisogdRfDao = gisogdRfDao;
        this.gisogdRfUtil = gisogdRfUtil;
        this.schemaService = schemaService;
        this.schemaExtractor = schemaExtractor;
        this.spatialRecordsDao = spatialRecordsDao;
        this.authenticationFacade = authenticationFacade;
    }

    public void publish(long taskId, ResourceQualifier qualifier, int srid) {
        log.debug("Try publish: {}", qualifier);

        IRecord parentDoc = baseDao
                .findById(qualifier)
                .orElseThrow(() -> new DataServiceException("Не найден документ: " + qualifier.getQualifier()));

        publishDocument(taskId, qualifier, srid, parentDoc);
    }

    /**
     * Публикация всего.
     * <p><br>
     * Список таблиц, из которых отправляются данные должен формироваться по критерию: в схеме данных есть поле
     * gisogdrf_publication_datetime
     * <p><br>
     * <p> Существуют критерии какие записи должны быть отправлены:
     * <ul>
     *   <li>не отправляются папки</li>
     *   <li>направляются документы, у которых не указана gisogdrf_publication_datetime - это новые, еще ни разу не
     *       синхронизированные документы.</li>
     *   <li>направляются документы, у которых last_modified после даты gisogdrf_publication_datetime - это обновленные
     *       документы</li>
     * </ul>
     *
     * @return Идентификатор начатой системной задачи.
     */
    public Long fullPublication(Long limit, int srid) {
        IRecord record = createSystemTask();
        Long taskId = record.getId();

        log.debug("Start full publication to GISOGD RF. With LIMIT: [{}] Task: [{}] at: [{}]",
                  limit, taskId, now().format(DateTimeFormatter.ofPattern(SYSTEM_DATETIME_PATTERN)));

        List<GisogdData> sortedGisogdEntities = gisogdRfUtil
                .getSchemasPreparedForGisogdRf()
                .stream()
                .flatMap(schemaId -> gisogdRfUtil.collectGisogdRfEntities(schemaId).stream())
                .filter(gisogdData -> gisogdData.getPublishOrder() >= 0)
                .sorted(Comparator.comparing(GisogdData::getPublishOrder))
                .collect(Collectors.toList());

        log.debug("Gisogd Data sorted by order: {}", sortedGisogdEntities);

        sortedGisogdEntities.forEach(gisogdData -> publish(gisogdData.getResourceQualifier(), taskId, limit, srid));

        log.debug("All events have been sent. Task: {} at: {}", taskId, now().format(ISO_DATE_TIME));

        return taskId;
    }

    private void publishDocument(long taskId, ResourceQualifier qualifier, int srid, IRecord parentDoc) {
        String guid = parentDoc.getAsString(GUID.getName());
        if (guid == null) {
            log.warn("Отправка не может быть выполнена. В документе [{}] не найдено поле 'guid'",
                     qualifier.getQualifier());

            return;
        }

        Map<String, Object> parentContent = parentDoc.getContent();
        if (parentContent.containsKey(DEFAULT_GEOMETRY_COLUMN_NAME)) {
            String wgs84AsText = spatialRecordsDao.fetchGeometryAsGeoJson(qualifier, srid);
            parentContent.put(DEFAULT_GEOMETRY_COLUMN_NAME, wgs84AsText);
        }

        Map<String, Object> clearedContent = clearBySettings(qualifier.getTable(), parentContent);

        log.info("Родительский объект до: [{}]", parentContent);
        log.info("Родительский объект после удаления полей: [{}]", clearedContent);

        List<Document> documents = fetchByTypeDocument(qualifier, clearedContent);
        Set<Document> urlAsFormula = fetchByUrlAsFormula(qualifier, srid);
        Set<Document> urlDirectly = fetchByTypeUrlDirectly(qualifier, clearedContent, srid);

        List<Document> children = new ArrayList<>(documents);
        children.addAll(urlAsFormula);
        children.addAll(urlDirectly);
        children.forEach(child -> removeFields(child.getContent()));

        List<Document> notSyncedChildren = new ArrayList<>();
        children.forEach(child -> {
            if ("territorykey".equals(child.getName())) {
                String territoryGuid = (String) child.getContent().get("guid");

                ResourceQualifier territoryQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, "territory");
                String filterByGuid = "guid = '" + territoryGuid + "'";

                Optional<IRecord> oTerritory = baseDao.findBy(territoryQualifier, filterByGuid);
                if (oTerritory.isPresent()) {
                    IRecord territory = oTerritory.get();
                    String territoryStatus = (String) territory.getContent().get("gisogdrf_sync_status");

                    if (!"Синхронизирован".equals(territoryStatus)) {
                        notSyncedChildren.add(child);
                    }
                }

                return;
            }

            String syncStatus = (String) child.getContent().get("gisogdrf_sync_status");
            if (!"Синхронизирован".equals(syncStatus)) {
                notSyncedChildren.add(child);
            }
        });

        if (!notSyncedChildren.isEmpty()) {
            log.info("У документа: {} есть не синхронизированные дети: {}", guid, notSyncedChildren.size());

            Map<String, String> response = new HashMap<>();
            for (Document child: notSyncedChildren) {
                Object gisogdrfSyncStatus = child.getContent().get("gisogdrf_sync_status");
                if (gisogdrfSyncStatus != null) {
                    response.put(child.getName(), gisogdrfSyncStatus.toString());
                }
            }

            gisogdRfDao.writeErrors(qualifier, response);

            return;
        }

        PublishToGisogdRfEvent event = new PublishToGisogdRfEvent(
                authenticationFacade.getOrganizationId(),
                taskId,
                new Document(fromString(guid),
                             qualifier.getSchema(),
                             qualifier.getTable(),
                             parentDoc.getAsString(CONTENT_TYPE_ID.getName()),
                             clearedContent),
                children);

        log.debug("Publish to GISOGD_RF: [{}]", asJsonString(event));

        messageBus.produce(event);
    }

    private void removeFields(Map<String, Object> documentContent) {
        Arrays.asList(VERSIONS.getName(), GISOGFRF_RESPONSE)
              .forEach(field -> {
                  if (documentContent.containsKey(field)) {
                      documentContent.remove(field, documentContent.get(field));
                  }
              });
    }

    private Map<String, Object> clearBySettings(String libraryName, Map<String, Object> documentContent) {
        Path pathToFile = Path.of(format("%s/%s/%s",
                                         baseFileStoragePath,
                                         getDefaultOrganizationName(authenticationFacade.getOrganizationId()),
                                         FILE_WITH_FIELDS));

        Map<String, List<String>> data;
        try {
            data = mapper.readValue(Files.readAllBytes(pathToFile), HashMap.class);
        } catch (Exception e) {
            String msg = String.format("Не удалось считать данные из файла: [%s] По причине: %s",
                                       pathToFile, e.getMessage());
            log.error(msg, e);

            return documentContent;
        }

        List<String> fields = data.get(libraryName);
        if (fields == null || fields.isEmpty()) {
            log.warn("Для библиотеки: {} в файле конфигурации: {} не заданы поля!!!", libraryName, FILE_WITH_FIELDS);

            return documentContent;
        }

        Map<String, Object> result = new HashMap<>();
        for (String key: fields) {
            result.put(key, documentContent.get(key));
        }

        return result;
    }

    private void publish(ResourceQualifier qualifier, Long taskId, Long limit, int srid) {
        log.debug("Publish by qualifier: {}", qualifier.getQualifier());
        try {
            // Библиотеки
            if (qualifier.getType().equals(LIBRARY)) {
                List<IRecord> documents = gisogdRfDao.getDocumentsForPublishing(qualifier, limit);
                log.debug("From library: {} publish: {} documents", qualifier.getQualifier(), documents.size());

                for (IRecord record: documents) {
                    publishDocument(taskId,
                                    new ResourceQualifier(qualifier.getSchema(),
                                                          qualifier.getTable(),
                                                          record.getId(),
                                                          LIBRARY_RECORD),
                                    srid,
                                    record);
                }
            } else if (qualifier.getType().equals(TABLE)) {
                // Слои
                List<IRecord> records = gisogdRfDao.getRecordsForPublishing(qualifier, limit);
                log.debug("From layer: {} publish: {} records", qualifier.getQualifier(), records.size());

                for (IRecord record: records) {
                    publishDocument(taskId,
                                    new ResourceQualifier(qualifier.getSchema(),
                                                          qualifier.getTable(),
                                                          record.getId(),
                                                          FEATURE),
                                    srid,
                                    record);
                }
            } else {
                log.error("Передан неподдерживаемый тип qualifier: {}", qualifier.getType());
            }
        } catch (Exception e) {
            log.error("Не удалось начать публикацию: [{}]. По причине: {}",
                      qualifier.getQualifier(), e.getMessage(), e);
        }
    }

    private List<Document> fetchByTypeDocument(ResourceQualifier qualifier, Map<String, Object> content) {
        try {
            List<Document> result = new ArrayList<>();

            Optional<SchemaDto> oSchema = schemaExtractor.get(qualifier);
            if (oSchema.isEmpty()) {
                log.debug("Не найдена схема для: {}", qualifier.getQualifier());

                return result;
            }

            List<SimplePropertyDto> documentProperties = oSchema
                    .get().getProperties().stream()
                    .filter(propertyDto -> propertyDto.getValueType().equalsIgnoreCase(DOCUMENT.name()))
                    .collect(Collectors.toList());
            if (documentProperties.isEmpty()) {
                log.debug("В схеме: [{}] нет полей типа DOCUMENT", oSchema.get().getName());

                return result;
            }

            for (SimplePropertyDto documentProperty: documentProperties) {
                String asString = (String) content.get(documentProperty.getName());
                if (asString == null) {
                    continue;
                }

                List<TypeDocumentData> records = mapper.readValue(asString,
                                                                  new TypeReference<List<TypeDocumentData>>() {
                                                                  });
                log.debug("For property {} found joined {} documents", documentProperty.getName(), records.size());
                for (TypeDocumentData data: records) {
                    Long id = data.getId();
                    String library = data.getLibraryTableName();

                    ResourceQualifier childQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, library, id, LIBRARY);
                    try {
                        baseDao.findById(childQualifier)
                               .ifPresentOrElse(record -> {
                                   String guid = record.getAsString(GUID.getName());
                                   String contentType = record.getAsString(CONTENT_TYPE_ID.getName());

                                   result.add(new Document((guid != null) ? fromString(guid) : null,
                                                           SYSTEM_SCHEMA_NAME,
                                                           library,
                                                           contentType,
                                                           record.getContent()));
                               }, () -> {
                                   log.warn("Не найден связанный документ. [{}]", childQualifier.getQualifier());
                               });
                    } catch (Exception e) {
                        log.warn("Не удалось получить документ: [{}]", childQualifier.getQualifier(), e);
                    }
                }
            }

            return result;
        } catch (Exception e) {
            String msg = format("Не удалось получить объекты по связям типа [DOCUMENT] для: [%s]. По причине: %s",
                                qualifier.getQualifier(), e.getMessage());
            log.debug(msg);

            throw new DataServiceException(msg);
        }
    }

    @NotNull
    private Set<Document> fetchByTypeUrlDirectly(ResourceQualifier qualifier,
                                                 Map<String, Object> parentContent,
                                                 int srid) {
        log.debug("Собираем объекты по связям типа URL связанными напрямую. для: {}", qualifier.getQualifier());

        Optional<SchemaDto> oSchema = schemaExtractor.get(qualifier);
        if (oSchema.isEmpty()) {
            return new HashSet<>();
        }

        // Заранее понятно что это дичь - но пока схемы не трогаем.
        // Нужно строить логику не на основе того что чего-то нет, а явно - на основе того что что-то есть.
        return oSchema.get()
                      .getProperties().stream()
                      .filter(propertyDto -> URL.name().equalsIgnoreCase(propertyDto.getValueType()))
                      .filter(propertyDto -> propertyDto.getCalculatedValueWellKnownFormula() == null &&
                              propertyDto.getCalculatedValueFormula() == null)
                      .flatMap(property -> fetchByTypeUrlDirectly(property, parentContent, srid).stream())
                      .collect(Collectors.toSet());
    }

    private List<Document> fetchByTypeUrlDirectly(SimplePropertyDto property,
                                                  Map<String, Object> parentContent,
                                                  int srid) {
        return extractTableQualifiers(property, parentContent)
                .stream()
                .map(recordQualifier -> prepareDocument(recordQualifier, srid))
                .collect(Collectors.toList());
    }

    /**
     * В схеме заданной библиотеки, собираем объекты по связям типа URL.
     * <p>
     *
     * @param qualifier библиотека документов.
     * @param srid
     *
     * @return Квалификатор объекта слоя
     */
    @NotNull
    private Set<Document> fetchByUrlAsFormula(ResourceQualifier qualifier, int srid) {
        log.debug("Собираем объекты по связям типа URL c формулой 'linkToFeaturesMentioningThisDocument' для: {}",
                  qualifier.getQualifier());

        return getPropsByFormula(qualifier, "linkToFeaturesMentioningThisDocument")
                .stream()
                .flatMap(property -> fetchByUrlAsFormula(qualifier, property, srid).stream())
                .collect(Collectors.toSet());
    }

    private List<Document> fetchByUrlAsFormula(ResourceQualifier qualifier, SimplePropertyDto property, int srid) {
        List<Document> result = new ArrayList<>();

        Map<String, Object> formulaParams = (Map<String, Object>) property.getValueFormulaParams();
        boolean includeParents = false;
        if (formulaParams.containsKey("includeParents")) {
            includeParents = (boolean) formulaParams.get("includeParents");
        }

        String columnName = (String) formulaParams.get("property");
        if (columnName.isEmpty()) {
            log.warn("Не корректно настроено поле: {}. Отсутствует 'property'", property.getName());

            return result;
        }

        List<String> layerComplexNames = (List<String>) formulaParams.get("layers");
        log.debug("In property: '{}' found layers: {}", property.getName(), layerComplexNames.size());
        if (layerComplexNames.isEmpty()) {
            log.warn("Не корректно настроено поле: {}. Не указаны слои 'layers'", property.getName());

            return result;
        }

        boolean isTerritoryKey = "territorykey".equalsIgnoreCase(property.getName());
        if (isTerritoryKey) {
            Optional<Document> oDocument = fetchTerritoryKey(qualifier, layerComplexNames, columnName, false, srid);
            if (oDocument.isPresent()) {
                result.add(oDocument.get());

                return result;
            } else {
                log.debug("Не удалось найти territorykey [includeParents = false]");

                oDocument = fetchTerritoryKey(qualifier, layerComplexNames, columnName, true, srid);
                if (oDocument.isPresent()) {
                    result.add(oDocument.get());

                    return result;
                } else {
                    log.debug("Не удалось найти territorykey [includeParents = true]");
                }
            }
        } else {
            for (String layerComplexName: layerComplexNames) {
                Optional<ResourceQualifier> objectQualifier = findRecord(qualifier,
                                                                         layerComplexName,
                                                                         columnName,
                                                                         includeParents);
                if (objectQualifier.isEmpty()) {
                    log.debug("Не удалось найти запись в слое: {}", layerComplexName);

                    continue;
                }

                result.add(prepareDocument(objectQualifier.get(), srid));
            }
        }

        return result;
    }

    private Optional<Document> fetchTerritoryKey(ResourceQualifier qualifier,
                                                 List<String> layerComplexNames,
                                                 String columnName,
                                                 boolean includeParent, int srid) {
        ResourceQualifier territory = null;
        for (String layerComplexName: layerComplexNames) {
            Optional<ResourceQualifier> objectQualifier = findRecord(qualifier,
                                                                     layerComplexName,
                                                                     columnName,
                                                                     includeParent);
            if (objectQualifier.isPresent()) {
                territory = objectQualifier.get();

                break;
            }
        }

        if (territory != null) {
            Document territoryKey = prepareDocument(territory, srid);
            territoryKey.setName("territorykey");
            territoryKey.setContentType("territorykey");

            return Optional.of(territoryKey);
        }

        return Optional.empty();
    }

    private List<ResourceQualifier> extractTableQualifiers(SimplePropertyDto property,
                                                           Map<String, Object> parentContent) {
        Object value = null;
        List<TypeUrlData> urls = new ArrayList<>();
        try {
            value = parentContent.get(property.getName());

            urls = mapper.readValue(value.toString(),
                                    new TypeReference<List<TypeUrlData>>() {
                                    });
        } catch (Exception e) {
            log.error("Задано некорректное значение в поле: [{}]. Не соответствует типа TypeUrlData", value, e);
        }

        List<ResourceQualifier> result = new ArrayList<>();
        for (TypeUrlData url: urls) {
            try {
                MultiValueMap<String, String> queryParams = UriComponentsBuilder
                        .fromUriString(URLDecoder.decode(String.valueOf(url.getUrl()), UTF_8)).build()
                        .getQueryParams();

                List<String> features = queryParams.get("features");
                if (features == null) {
                    log.warn("В URL: [{}] не найдены features", value);

                    break;
                }

                for (String feature: features) {
                    Map<String, Map<String, List<Long>>> data =
                            mapper.readValue(feature,
                                             new TypeReference<Map<String, Map<String, List<Long>>>>() {
                                             });
                    data.forEach((schema, featureAsMap) -> {
                        featureAsMap.forEach((tableName, ids) -> {
                            for (Long id: ids) {
                                result.add(new ResourceQualifier(schema, tableName, id, TABLE));
                            }
                        });
                    });
                }
            } catch (Exception e) {
                log.error("Не удалось обработать URL: [{}]", value, e);
            }
        }

        return result;
    }

    @NotNull
    private Document prepareDocument(ResourceQualifier recordQualifier, int srid) {
        log.debug("Founded record: '{}'", recordQualifier.getQualifier());

        Optional<IRecord> oLayerRecord = baseDao.findBy(recordQualifier,
                                                        "objectId = " + recordQualifier.getRecordId());
        if (oLayerRecord.isEmpty()) {
            throw new IllegalStateException("Не найдена запись: " + recordQualifier.getRecordId());
        }
        IRecord record = oLayerRecord.get();

        // вытащим геометрию
        String geometryAsText = spatialRecordsDao.fetchGeometryAsGeoJson(recordQualifier, srid);
        String guid = record.getAsString(GUID.getName());
        Map<String, Object> content = record.getContent();
        content.put(DEFAULT_GEOMETRY_COLUMN_NAME, geometryAsText);

        return new Document((guid != null) ? fromString(guid) : null,
                            recordQualifier.getSchema(),
                            recordQualifier.getTable(),
                            recordQualifier.getTable(),
                            content);
    }

    private Optional<ResourceQualifier> findRecord(ResourceQualifier qualifier,
                                                   String complexName,
                                                   String columnName,
                                                   boolean includeParents) {
        log.debug("Fetch from layer: {}", complexName);

        try {
            String layerName = complexName.split(":")[1];
            if (layerName == null) {
                log.warn("Не верно заданы параметры valueFormulaParams. " +
                                 "Не удалось вытащить название слоя из layerComplexName: {}", complexName);

                return Optional.empty();
            }

            // Тащим запись о слое, чтобы достать путь к набору данных
            String filterForLayer = "identifier = '" + layerName + "'";
            Optional<IRecord> oLayer = baseDao.findBy(SCHEMAS_AND_TABLES_QUALIFIER, filterForLayer);
            if (oLayer.isEmpty()) {
                log.warn("Не найден слой: {}", layerName);

                return Optional.empty();
            }

            long datasetId = Long.parseLong(oLayer.get().getContent().get("path").toString().split("root/")[1]);

            // Тащим запись о наборе данных, чтобы достать его название
            IRecord dataset = baseDao
                    .findById(new ResourceQualifier(SCHEMAS_AND_TABLES_QUALIFIER, datasetId))
                    .orElseThrow(() -> new IllegalStateException("Не найден набор данных по id: " + datasetId));
            String datasetIdentifier = dataset.getContent().get("identifier").toString();
            log.debug("founded dataset: {}", datasetIdentifier);

            // Ищем в слое запись, которая ссылается на документ. Берем id.
            Long recordId = null;
            if (includeParents) {
                Optional<Long> oRecordId = gisogdRfDao
                        .findJoinedToDocumentLayerRecordIdWithParents(datasetIdentifier,
                                                                      layerName,
                                                                      columnName,
                                                                      qualifier.getTableQualifier(),
                                                                      qualifier.getRecordId());

                if (oRecordId.isPresent()) {
                    recordId = oRecordId.get();
                } else {
                    log.debug("Not found record in LAYER: '{}.{}' Mode: [PARENT ON]", datasetIdentifier, layerName);
                }
            } else {
                Optional<Long> oRecordId = gisogdRfDao.findJoinedToDocumentLayerRecordId(datasetIdentifier,
                                                                                         layerName,
                                                                                         columnName,
                                                                                         qualifier.getTableQualifier(),
                                                                                         qualifier.getRecordId());

                if (oRecordId.isPresent()) {
                    recordId = oRecordId.get();
                } else {
                    log.debug("Not found record in LAYER: '{}.{}' Mode: [PARENT OFF]", datasetIdentifier, layerName);
                }
            }

            return recordId == null
                    ? Optional.empty()
                    : Optional.of(new ResourceQualifier(datasetIdentifier, layerName, recordId, FEATURE));
        } catch (Exception e) {
            log.error("Не удается получить информацию из слоя: {}. По причине: {}",
                      complexName, e.getMessage(), e);
        }

        return Optional.empty();
    }

    @NotNull
    private List<SimplePropertyDto> getPropsByFormula(ResourceQualifier qualifier, String formulaName) {
        Optional<SchemaDto> oSchema = schemaExtractor.get(qualifier);
        if (oSchema.isEmpty()) {
            return new ArrayList<>();
        }

        List<SimplePropertyDto> result = oSchema
                .get()
                .getProperties().stream()
                .filter(propertyDto -> formulaName.equals(propertyDto.getCalculatedValueWellKnownFormula()))
                .collect(Collectors.toList());

        if (result.isEmpty()) {
            log.debug("Нет свойств с заданной формулой: '{}'", formulaName);

            return new ArrayList<>();
        }

        return result;
    }

    private IRecord createSystemTask() {
        SchemaDto tasksSchema = this.schemaService
                .getSchemaByName(TASKS_SCHEMA)
                .orElseThrow(() -> new NotFoundException("Не найдена схема задач: " + TASKS_SCHEMA));

        Map<String, Object> content = new HashMap<>();
        content.put("owner_id", authenticationFacade.getUserDetails().getUserId());
        content.put("type", SYSTEM.name());

        return mediator.execute(
                new CreateTaskRequest(tasksSchema,
                                      new ResourceQualifier(SYSTEM_SCHEMA_NAME, TASK_TABLE_NAME, TASK),
                                      new RecordEntity(content)));
    }
}
