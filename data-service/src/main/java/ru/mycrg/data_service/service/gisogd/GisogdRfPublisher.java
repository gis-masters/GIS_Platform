package ru.mycrg.data_service.service.gisogd;

import com.fasterxml.jackson.core.type.TypeReference;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.BaseDao;
import ru.mycrg.data_service.dao.GisogdRfDao;
import ru.mycrg.data_service.dao.SpatialRecordsDao;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.RecordEntity;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.SchemaExtractor;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service.service.cqrs.tasks.requests.CreateTaskRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.dto.TypeDocumentData;
import ru.mycrg.data_service_contract.enums.ValueType;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;
import ru.mycrg.gisog_service_contract.dto.Document;
import ru.mycrg.mediator.Mediator;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.*;
import java.util.stream.Collectors;

import static java.lang.String.format;
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

@Service
public class GisogdRfPublisher {

    public static final String INBOX_MARKER = "inbox_data";

    private static final String TARGET_COLUMN = "gisogdrf_publication_datetime";

    private final Logger log = LoggerFactory.getLogger(GisogdRfPublisher.class);

    private final BaseDao baseDao;
    private final Mediator mediator;
    private final GisogdRfDao gisogdRfDao;
    private final SchemaService schemaService;
    private final IMessageBusProducer messageBus;
    private final SchemaExtractor schemaExtractor;
    private final SpatialRecordsDao spatialRecordsDao;
    private final IAuthenticationFacade authenticationFacade;

    public GisogdRfPublisher(BaseDao baseDao,
                             Mediator mediator,
                             GisogdRfDao gisogdRfDao,
                             SchemaService schemaService,
                             IMessageBusProducer messageBus,
                             SpatialRecordsDao spatialRecordsDao,
                             SchemaExtractor schemaExtractor,
                             IAuthenticationFacade authenticationFacade) {
        this.baseDao = baseDao;
        this.mediator = mediator;
        this.gisogdRfDao = gisogdRfDao;
        this.schemaService = schemaService;
        this.messageBus = messageBus;
        this.schemaExtractor = schemaExtractor;
        this.spatialRecordsDao = spatialRecordsDao;
        this.authenticationFacade = authenticationFacade;
    }

    public Long publish(ResourceQualifier qualifier) {
        log.debug("Try publish: {}", qualifier);

        IRecord parentDoc = baseDao
                .findById(qualifier)
                .orElseThrow(() -> new DataServiceException("Не найден документ: " + qualifier.getQualifier()));
        String guid = parentDoc.getAsString(GUID.getName());
        String contentType = parentDoc.getAsString(CONTENT_TYPE_ID.getName());

        Map<String, Object> parentContent = parentDoc.getContent();
        if (parentContent.containsKey(DEFAULT_GEOMETRY_COLUMN_NAME)) {
            String wgs84AsText = spatialRecordsDao.fetchGeometryAsGeoJson(qualifier, 3857);
            parentContent.put(DEFAULT_GEOMETRY_COLUMN_NAME, wgs84AsText);
        }

        Document inbox = fetchInbox(qualifier, parentDoc);
        Document layer = fetchJoinedByUrlLayers(qualifier);
        List<Document> childDocuments = fetchJoinedDocuments(qualifier, parentDoc);

        List<Document> children = new ArrayList<>(childDocuments);
        if (inbox != null) {
            children.add(inbox);
        }
        if (layer != null) {
            children.add(layer);
        }

        Document parent = new Document(fromString(guid), qualifier.getTable(), contentType, parentContent);
        messageBus.produce(
                new PublishToGisogdRfEvent(-314L, parent, children));

        // TODO: create task and return id
        return -314L;
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

        log.debug("Found {} schemas prepared to publish to GISOGD RF", schemas.size());
        schemas.forEach(this::publish);

        return record.getId();
    }

    private List<Document> fetchJoinedDocuments(ResourceQualifier qualifier, IRecord parent) {
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
                        baseDao.findBy(childQualifier)
                               .ifPresentOrElse(record -> {
                                   String guid = record.getAsString(GUID.getName());
                                   String contentType = record.getAsString(CONTENT_TYPE_ID.getName());

                                   result.add(
                                           new Document(UUID.fromString(guid), library, contentType,
                                                        record.getContent()));
                               }, () -> {
                                   log.warn("Не найден связанный документ. [{}]", childQualifier.getQualifier());
                               });
                    } catch (Exception e) {
                        log.warn("Не удалось получить документ: [{}]", childQualifier.getQualifier());
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

    /**
     * В схеме заданной библиотеки, пытаемся найти поле типа URL, отвечающее за связь со слоем.
     * <p>
     * Чтобы по этой информации найти конкретный объект слоя.
     *
     * @param qualifier библиотека документов.
     *
     * @return Квалификатор объекта слоя
     */
    @Nullable
    private Document fetchJoinedByUrlLayers(ResourceQualifier qualifier) {
        try {
            String targetFormulaName = "linkToFeaturesMentioningThisDocument";

            Optional<SchemaDto> oSchema = schemaExtractor.get(qualifier);
            if (oSchema.isEmpty()) {
                return null;
            }

            Optional<SimplePropertyDto> oProperty = oSchema
                    .get().getProperties().stream()
                    .filter(propertyDto -> targetFormulaName.equals(propertyDto.getCalculatedValueWellKnownFormula()))
                    .findFirst();
            if (oProperty.isEmpty()) {
                log.debug("Нет связанных по URL объектов. Ожидается 'calculatedValueWellKnownFormula': " +
                                  "'linkToFeaturesMentioningThisDocument'");

                return null;
            }

            Map<String, Object> formulaParams = (Map<String, Object>) oProperty.get().getValueFormulaParams();
            List<String> layerComplexNames = (List<String>) formulaParams.get("layers");
            log.info("Found layers: {}", layerComplexNames.size());

            String datasetIdentifier = null;
            String layerName = null;
            Long recordId = null;
            for (String layerComplexName: layerComplexNames) {
                layerName = layerComplexName.split(":")[1];
                if (layerName == null) {
                    log.warn("Не верно заданы параметры valueFormulaParams. " +
                                     "Не удалось вытащить название слоя из layerComplexName: {}", layerComplexName);
                    continue;
                }

                // Тащим запись о слое, чтобы достать путь к набору данных
                String filterForLayer = "identifier = '" + layerName + "'";
                Optional<IRecord> oLayer = baseDao.findBy(SCHEMAS_AND_TABLES_QUALIFIER, filterForLayer);
                if (oLayer.isEmpty()) {
                    log.warn("Не найден слой: {}", layerName);
                    continue;
                }

                long datasetId = Long.parseLong(oLayer.get().getContent().get("path").toString().split("root/")[1]);

                // Тащим запись о наборе данных, чтобы достать его название
                IRecord dataset = baseDao
                        .findById(new ResourceQualifier(SCHEMAS_AND_TABLES_QUALIFIER, datasetId))
                        .orElseThrow(() -> new IllegalStateException("Не найден набор данных по id: " + datasetId));
                datasetIdentifier = dataset.getContent().get("identifier").toString();
                log.debug("founded dataset: {}", datasetIdentifier);

                // Ищем в слое запись, которая ссылается на документ. Берем id.
                Optional<Long> oRecordId = gisogdRfDao.findJoinedToDocumentLayerRecordId(datasetIdentifier,
                                                                                         layerName,
                                                                                         qualifier.getTableQualifier(),
                                                                                         qualifier.getRecordId());

                if (oRecordId.isPresent()) {
                    recordId = oRecordId.get();

                    break;
                } else {
                    log.debug("NOT found record in LAYER: {}.{}", datasetIdentifier, layerName);
                }
            }

            if (recordId == null || datasetIdentifier == null || layerName == null) {
                throw new IllegalStateException("Не удалось найти запись.");
            }

            log.debug("Founded record with ID: '{}' in LAYER: {}.{}", recordId, datasetIdentifier, layerName);

            ResourceQualifier lrQualifier = new ResourceQualifier(datasetIdentifier, layerName, recordId, TABLE);
            Optional<IRecord> oLayerRecord = baseDao.findBy(lrQualifier, "objectId = " + recordId);
            if (oLayerRecord.isEmpty()) {
                throw new IllegalStateException("Не найдена запись: " + recordId);
            }

            // вытащим геометрию в формате WGS-84 (3857)
            String geometryAsText = spatialRecordsDao.fetchGeometryAsGeoJson(lrQualifier, 3857);
            oLayerRecord.get().getContent().put(DEFAULT_GEOMETRY_COLUMN_NAME, geometryAsText);

            IRecord record = oLayerRecord.get();
            String guid = record.getAsString(GUID.getName());

            return new Document(fromString(guid), layerName, layerName, record.getContent());
        } catch (Exception e) {
            String msg = "Не удается получить информацию о слое, связанном с документом. По причине: " + e.getMessage();

            log.error(msg);
            throw new DataServiceException(msg);
        }
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

        return new Document(fromString(guid), INBOX_MARKER, INBOX_MARKER, inbox.getContent());
    }

    private void publish(String schemaName) {
        log.info("Schema name: {}", schemaName);

        // TODO: найти созданные по этой схеме слои или библиотеки
        // TODO: выбирать данные порционно из источника на отправку по заданным критериям
        // TODO: собрать qualifier и вызвать основной publish метод
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
