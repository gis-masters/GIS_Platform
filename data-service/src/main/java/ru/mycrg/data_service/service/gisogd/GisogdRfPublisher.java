package ru.mycrg.data_service.service.gisogd;

import com.fasterxml.jackson.core.type.TypeReference;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.util.UriComponentsBuilder;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.BaseDao;
import ru.mycrg.data_service.dao.GisogdRfDao;
import ru.mycrg.data_service.dao.SpatialRecordsDao;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.RecordEntity;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.DocumentLibraryService;
import ru.mycrg.data_service.service.SchemaExtractor;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service.service.cqrs.tasks.requests.CreateTaskRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.TableService;
import ru.mycrg.data_service.util.DateTimeUtil;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.dto.TypeDocumentData;
import ru.mycrg.data_service_contract.dto.TypeUrlData;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;
import ru.mycrg.gisog_service_contract.dto.Document;
import ru.mycrg.mediator.Mediator;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.io.IOException;
import java.net.URLDecoder;
import java.util.*;
import java.util.stream.Collectors;

import static java.lang.String.format;
import static java.nio.charset.StandardCharsets.UTF_8;
import static java.util.UUID.fromString;
import static ru.mycrg.data_service.dao.config.DaoProperties.DEFAULT_GEOMETRY_COLUMN_NAME;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.*;
import static ru.mycrg.data_service.service.TaskService.TASKS_SCHEMA;
import static ru.mycrg.data_service.service.TaskService.TASK_TABLE_NAME;
import static ru.mycrg.data_service.service.resources.DatasetService.SCHEMAS_AND_TABLES_QUALIFIER;
import static ru.mycrg.data_service.util.JsonConverter.mapper;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.CONTENT_TYPE_ID;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.GUID;
import static ru.mycrg.data_service_contract.enums.TaskType.SYSTEM;
import static ru.mycrg.data_service_contract.enums.ValueType.DOCUMENT;
import static ru.mycrg.data_service_contract.enums.ValueType.URL;

@Service
public class GisogdRfPublisher {

    public static final String INBOX_MARKER = "inbox_data";

    private static final String TARGET_COLUMN = "gisogdrf_publication_datetime";

    private final Logger log = LoggerFactory.getLogger(GisogdRfPublisher.class);

    private final BaseDao baseDao;
    private final GisogdRfDao gisogdRfDao;
    private final SpatialRecordsDao spatialRecordsDao;

    private final Mediator mediator;
    private final IMessageBusProducer messageBus;
    private final IAuthenticationFacade authenticationFacade;

    private final TableService tableService;
    private final SchemaService schemaService;
    private final SchemaExtractor schemaExtractor;
    private final DocumentLibraryService dlService;

    public GisogdRfPublisher(BaseDao baseDao,
                             Mediator mediator,
                             GisogdRfDao gisogdRfDao,
                             SchemaService schemaService,
                             IMessageBusProducer messageBus,
                             SpatialRecordsDao spatialRecordsDao,
                             SchemaExtractor schemaExtractor,
                             IAuthenticationFacade authenticationFacade,
                             TableService tableService,
                             DocumentLibraryService dlService) {
        this.baseDao = baseDao;
        this.mediator = mediator;
        this.gisogdRfDao = gisogdRfDao;
        this.schemaService = schemaService;
        this.messageBus = messageBus;
        this.schemaExtractor = schemaExtractor;
        this.spatialRecordsDao = spatialRecordsDao;
        this.authenticationFacade = authenticationFacade;
        this.tableService = tableService;
        this.dlService = dlService;
    }

    public void publish(long taskId, ResourceQualifier qualifier) {
        log.debug("Try publish: {}", qualifier);

        IRecord parentDoc = baseDao
                .findById(qualifier)
                .orElseThrow(() -> new DataServiceException("Не найден документ: " + qualifier.getQualifier()));
        String guid = parentDoc.getAsString(GUID.getName());
        if (guid == null) {
            log.debug("Отправка не может быть выполнена. В документе не найдено поле 'guid'.");

            return;
        }

        Map<String, Object> parentContent = parentDoc.getContent();
        if (parentContent.containsKey(DEFAULT_GEOMETRY_COLUMN_NAME)) {
            String wgs84AsText = spatialRecordsDao.fetchGeometryAsGeoJson(qualifier, 3857);
            parentContent.put(DEFAULT_GEOMETRY_COLUMN_NAME, wgs84AsText);
        }

        Document inbox = fetchInbox(qualifier, parentDoc);
        Set<Document> childrenByUrlFormula = fetchByUrlAsFormula(qualifier);
        Set<Document> childrenByUrlDirectly = fetchByTypeUrlDirectly(qualifier, parentContent);
        List<Document> childDocuments = fetchByTypeDocument(qualifier, parentDoc);

        List<Document> children = new ArrayList<>(childDocuments);
        if (inbox != null) {
            children.add(inbox);
        }

        children.addAll(childrenByUrlFormula);
        children.addAll(childrenByUrlDirectly);

        messageBus.produce(
                new PublishToGisogdRfEvent(taskId,
                                           new Document(fromString(guid),
                                                        qualifier.getTable(),
                                                        parentDoc.getAsString(CONTENT_TYPE_ID.getName()),
                                                        parentContent),
                                           children));
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
    public Long fullPublication() {
        List<String> schemas = getSchemasPublishedToGisogdRf(TARGET_COLUMN);
        if (schemas.isEmpty()) {
            String msg = format(
                    "Не найдено предназначенных для отправки в ГИСОГД РФ библиотек. Не найдено схем с полем: %s",
                    TARGET_COLUMN);
            log.warn(msg);

            throw new BadRequestException(msg);
        }

        IRecord record = createSystemTask();
        Long taskId = record.getId();

        log.debug("Start full publication to GISOGD RF. Task: {} at: {}", taskId, DateTimeUtil.nowAsString());
        log.debug("Found {} schemas prepared to publish", schemas.size());
        schemas.forEach(schemaId -> publishBySchema(taskId, schemaId));
        log.debug("All events have been sent. Task: {} at: {}", taskId, DateTimeUtil.nowAsString());

        return taskId;
    }

    private void publishBySchema(Long taskId, String schemaId) {
        log.debug("Publish by schema: {}", schemaId);

        // Библиотеки
        List<ResourceQualifier> libraryQualifiers = dlService.getLibrariesCreatedBySchema(schemaId);
        log.debug("Found {} libraries created by schema", libraryQualifiers.size());
        for (ResourceQualifier lQualifier: libraryQualifiers) {
            List<IRecord> documents = gisogdRfDao.getDocumentsForPublishing(lQualifier);
            log.debug("From library: {} publish: {} documents", lQualifier.getQualifier(), documents.size());

            for (IRecord record: documents) {
                publish(taskId,
                        new ResourceQualifier(lQualifier.getSchema(),
                                              lQualifier.getTable(),
                                              record.getId(),
                                              LIBRARY_RECORD));
            }
        }

        // Слои
        List<ResourceQualifier> layerQualifiers = tableService.getTablesCreatedBySchema(schemaId);
        log.debug("Found {} layers created by schema", layerQualifiers.size());
        for (ResourceQualifier lQualifier: layerQualifiers) {
            List<IRecord> records = gisogdRfDao.getRecordsForPublishing(lQualifier);
            log.debug("From layer: {} publish: {} records", lQualifier.getQualifier(), records.size());

            for (IRecord record: records) {
                publish(taskId,
                        new ResourceQualifier(lQualifier.getSchema(),
                                              lQualifier.getTable(),
                                              record.getId(),
                                              FEATURE));
            }
        }
    }

    private List<Document> fetchByTypeDocument(ResourceQualifier qualifier, IRecord parent) {
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
                String asString = parent.getAsString(documentProperty.getName());
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
    private Set<Document> fetchByTypeUrlDirectly(ResourceQualifier qualifier, Map<String, Object> parentContent) {
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
                      .flatMap(property -> fetchByTypeUrlDirectly(property, parentContent).stream())
                      .collect(Collectors.toSet());
    }

    private List<Document> fetchByTypeUrlDirectly(SimplePropertyDto property,
                                                  Map<String, Object> parentContent) {
        return extractTableQualifiers(property, parentContent)
                .stream()
                .map(this::prepareDocument)
                .collect(Collectors.toList());
    }

    private List<ResourceQualifier> extractTableQualifiers(SimplePropertyDto property,
                                                           Map<String, Object> parentContent) {
        List<ResourceQualifier> result = new ArrayList<>();
        Object value = null;
        try {
            value = parentContent.get(property.getName());

            List<TypeUrlData> urls = mapper.readValue(value.toString(),
                                                      new TypeReference<List<TypeUrlData>>() {
                                                      });

            for (TypeUrlData url: urls) {
                MultiValueMap<String, String> queryParams = UriComponentsBuilder
                        .fromUriString(URLDecoder.decode(String.valueOf(url.getUrl()), UTF_8)).build()
                        .getQueryParams();

                List<String> features = queryParams.get("features");
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
            }
        } catch (IOException e) {
            log.error("Некорректно задан URL: [{}]", value, e);
        }

        return result;
    }

    /**
     * В схеме заданной библиотеки, собираем объекты по связям типа URL.
     * <p>
     *
     * @param qualifier библиотека документов.
     *
     * @return Квалификатор объекта слоя
     */
    @NotNull
    private Set<Document> fetchByUrlAsFormula(ResourceQualifier qualifier) {
        log.debug("Собираем объекты по связям типа URL c формулой 'linkToFeaturesMentioningThisDocument' для: {}",
                  qualifier.getQualifier());

        return getPropsByFormula(qualifier, "linkToFeaturesMentioningThisDocument")
                .stream()
                .flatMap(property -> fetchByUrlAsFormula(qualifier, property).stream())
                .collect(Collectors.toSet());
    }

    private List<Document> fetchByUrlAsFormula(ResourceQualifier qualifier, SimplePropertyDto property) {
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
            Optional<Document> oDocument = fetchTerritoryKey(qualifier, layerComplexNames, columnName, false);
            if (oDocument.isPresent()) {
                result.add(oDocument.get());

                return result;
            } else {
                log.debug("Не удалось найти territorykey [includeParents = false]");

                oDocument = fetchTerritoryKey(qualifier, layerComplexNames, columnName, true);
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

                result.add(prepareDocument(objectQualifier.get()));
            }
        }

        return result;
    }

    private Optional<Document> fetchTerritoryKey(ResourceQualifier qualifier,
                                                 List<String> layerComplexNames,
                                                 String columnName,
                                                 boolean includeParent) {
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
            Document territoryKey = prepareDocument(territory);
            territoryKey.setName("territorykey");
            territoryKey.setContentType("territorykey");

            return Optional.of(territoryKey);
        }

        return Optional.empty();
    }

    @NotNull
    private Document prepareDocument(ResourceQualifier recordQualifier) {
        log.debug("Founded record: '{}'", recordQualifier.getQualifier());

        Optional<IRecord> oLayerRecord = baseDao.findBy(recordQualifier,
                                                        "objectId = " + recordQualifier.getRecordId());
        if (oLayerRecord.isEmpty()) {
            throw new IllegalStateException("Не найдена запись: " + recordQualifier.getRecordId());
        }
        IRecord record = oLayerRecord.get();

        // вытащим геометрию в формате WGS-84 (3857)
        String geometryAsText = spatialRecordsDao.fetchGeometryAsGeoJson(recordQualifier, 3857);
        String guid = record.getAsString(GUID.getName());
        Map<String, Object> content = record.getContent();
        content.put(DEFAULT_GEOMETRY_COLUMN_NAME, geometryAsText);

        return new Document((guid != null) ? fromString(guid) : null,
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

    @Nullable
    private Document fetchInbox(ResourceQualifier qualifier, IRecord record) {
        String inboxGuid = record.getAsString("inbox_data_key");
        if (inboxGuid == null) {
            log.debug("Поле inbox_data_key не заполнено для объекта: " + qualifier.getQualifier());

            return null;
        }

        ResourceQualifier taskQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, TASK_TABLE_NAME, inboxGuid, TASK);
        IRecord inbox = baseDao
                .findBy(taskQualifier, "guid = '" + inboxGuid + "'")
                .orElseThrow(() -> new IllegalStateException("Не найдено входящее сообщение: " + inboxGuid));

        String guid = inbox.getAsString(GUID.getName());

        return new Document((guid != null) ? java.util.UUID.fromString(guid) : null,
                            INBOX_MARKER,
                            INBOX_MARKER,
                            inbox.getContent());
    }

    private List<String> getSchemasPublishedToGisogdRf(String targetProperty) {
        return schemaService.getBySpecificProperty(targetProperty).stream()
                            .map(SchemaDto::getTableName)
                            .collect(Collectors.toList());
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
