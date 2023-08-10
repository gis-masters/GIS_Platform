package ru.mycrg.data_service.service.gisogd;

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
import ru.mycrg.data_service.service.DocumentLibraryService;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service.service.cqrs.tasks.requests.CreateTaskRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.TableService;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;
import ru.mycrg.gisog_service_contract.dto.Document;
import ru.mycrg.mediator.Mediator;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.*;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.dao.config.DaoProperties.DEFAULT_GEOMETRY_COLUMN_NAME;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.TABLE;
import static ru.mycrg.data_service.dto.ResourceType.TASK;
import static ru.mycrg.data_service.service.TaskService.TASKS_SCHEMA;
import static ru.mycrg.data_service.service.TaskService.TASK_TABLE_NAME;
import static ru.mycrg.data_service.service.resources.DatasetService.SCHEMAS_AND_TABLES_QUALIFIER;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.CONTENT_TYPE_ID;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.GUID;
import static ru.mycrg.data_service_contract.enums.TaskType.SYSTEM;

@Service
public class GisogdRfPublisher {

    private static final String TARGET_COLUMN = "gisogdrf_publication_datetime";

    private final Logger log = LoggerFactory.getLogger(GisogdRfPublisher.class);

    private final BaseDao baseDao;
    private final Mediator mediator;
    private final GisogdRfDao gisogdRfDao;
    private final SchemaService schemaService;
    private final IMessageBusProducer messageBus;
    private final SpatialRecordsDao spatialRecordsDao;
    private final DocumentLibraryService libraryService;
    private final IAuthenticationFacade authenticationFacade;

    public GisogdRfPublisher(BaseDao baseDao,
                             Mediator mediator,
                             GisogdRfDao gisogdRfDao,
                             SchemaService schemaService,
                             IMessageBusProducer messageBus,
                             SpatialRecordsDao spatialRecordsDao,
                             DocumentLibraryService libraryService,
                             IAuthenticationFacade authenticationFacade) {
        this.baseDao = baseDao;
        this.mediator = mediator;
        this.gisogdRfDao = gisogdRfDao;
        this.schemaService = schemaService;
        this.messageBus = messageBus;
        this.libraryService = libraryService;
        this.spatialRecordsDao = spatialRecordsDao;
        this.authenticationFacade = authenticationFacade;
    }

    public Long publish(ResourceQualifier qualifier) {
        log.debug("Try publish: {}", qualifier);

        IRecord document = baseDao
                .findById(qualifier)
                .orElseThrow(() -> new DataServiceException("Не найден документ: " + qualifier.toString()));
        String guid = document.getAsString(GUID.getName());
        String contentType = document.getAsString(CONTENT_TYPE_ID.getName());

        Document parent = new Document(UUID.fromString(guid), qualifier.getTable(), contentType, document.getContent());
        Document inbox = fetchInbox(qualifier, document);
        Document layer = fetchJoinedToDocumentLayer(qualifier);

        messageBus.produce(
                new PublishToGisogdRfEvent(-314L, parent, List.of(inbox, layer)));

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
            String msg = String.format(
                    "Не найдено предназначенных для отправки в ГИСОГД РФ библиотек. Не найдено схем с полем: %s",
                    TARGET_COLUMN);
            log.warn(msg);

            throw new BadRequestException(msg);
        }

        IRecord record = createSystemTask();

        log.debug("Found {} schemas prepared to publish to GISOGD RF", schemas.size());
        schemas.forEach(this::publishLibrary);

        return record.getId();
    }

    /**
     * В схеме заданной библиотеки, пытаемся найти поле, отвечающее за связь со слоем. Чтобы по этой информации найти
     * конкретный объект слоя.
     *
     * @param qualifier библиотека документов.
     *
     * @return Квалификатор объекта слоя
     */
    private Document fetchJoinedToDocumentLayer(ResourceQualifier qualifier) {
        try {
            String targetFormulaName = "linkToFeaturesMentioningThisDocument";

            SchemaDto schema = libraryService.getSchema(qualifier.getTable());
            SimplePropertyDto property = schema
                    .getProperties().stream()
                    .filter(propertyDto -> targetFormulaName.equals(
                            propertyDto.getCalculatedValueWellKnownFormula()))
                    .findFirst()
                    .orElseThrow(() -> new DataServiceException(
                            "В схеме библиотеки на найдена связь с объектом на карте! " +
                                    "Ожидается 'calculatedValueWellKnownFormula': 'linkToFeaturesMentioningThisDocument'"));

            Map<String, Object> formulaParams = (Map<String, Object>) property.getValueFormulaParams();
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

            return new Document(UUID.fromString(guid), layerName, layerName, record.getContent());
        } catch (Exception e) {
            String msg = "Не удается получить информацию о слое, связанном с документом. По причине: " + e.getMessage();

            log.error(msg);
            throw new DataServiceException(msg);
        }
    }

    private Document fetchInbox(ResourceQualifier qualifier, IRecord record) {
        String inboxDataKey = record.getAsString("inbox_data_key");
        if (inboxDataKey == null) {
            throw new DataServiceException("Поле inbox_data_key не заполнено для объекта: " + qualifier.toString());
        }

        IRecord inbox = baseDao.findBy(new ResourceQualifier(SYSTEM_SCHEMA_NAME, "tasks", inboxDataKey, TASK),
                                       String.format("guid = '%s'", inboxDataKey))
                               .orElseThrow(() -> new IllegalStateException(
                                       "Не найдено входящее сообщение: " + inboxDataKey));

        String guid = inbox.getAsString(GUID.getName());

        return new Document(UUID.fromString(guid), "inbox_data", "inbox_data", inbox.getContent());
    }

    private void publishLibrary(String library) {
        log.info("LIBRARY: {}", library);

        // выбирать порциями и отправлять.
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
