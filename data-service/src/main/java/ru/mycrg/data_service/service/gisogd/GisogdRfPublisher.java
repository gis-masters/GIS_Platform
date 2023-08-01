package ru.mycrg.data_service.service.gisogd;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.BaseDao;
import ru.mycrg.data_service.dao.GisogdRfDao;
import ru.mycrg.data_service.dao.SpatialRecordsDao;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.DocumentLibraryService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static ru.mycrg.data_service.dao.config.DaoProperties.DEFAULT_GEOMETRY_COLUMN_NAME;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.TABLE;
import static ru.mycrg.data_service.dto.ResourceType.TASK;
import static ru.mycrg.data_service.service.resources.DatasetService.SCHEMAS_AND_TABLES_QUALIFIER;

@Service
public class GisogdRfPublisher {

    private final Logger log = LoggerFactory.getLogger(GisogdRfPublisher.class);

    private final BaseDao baseDao;
    private final GisogdRfDao gisogdRfDao;
    private final IMessageBusProducer messageBus;
    private final SpatialRecordsDao spatialRecordsDao;
    private final DocumentLibraryService libraryService;
    private final IAuthenticationFacade authenticationFacade;

    public GisogdRfPublisher(BaseDao baseDao,
                             GisogdRfDao gisogdRfDao,
                             IMessageBusProducer messageBus,
                             SpatialRecordsDao spatialRecordsDao,
                             DocumentLibraryService libraryService,
                             IAuthenticationFacade authenticationFacade) {
        this.baseDao = baseDao;
        this.gisogdRfDao = gisogdRfDao;
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

        IRecord inboxData = fetchInbox(qualifier, document);
        IRecord layerRecord = fetchJoinedToDocumentLayer(qualifier);

        messageBus.produce(
                new PublishToGisogdRfEvent(authenticationFacade.getAccessToken(),
                                           document.getContent(),
                                           inboxData.getContent(),
                                           layerRecord.getContent()));

        // TODO: create task and return id
        return -314L;
    }

    /**
     * В схеме заданной библиотеки, пытаемся найти поле, отвечающее за связь со слоем. Чтобы по этой информации найти
     * конкретный объект слоя.
     *
     * @param qualifier библиотека документов.
     *
     * @return Квалификатор объекта слоя
     */
    private IRecord fetchJoinedToDocumentLayer(ResourceQualifier qualifier) {
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

            return oLayerRecord.get();
        } catch (Exception e) {
            String msg = "Не удается получить информацию о слое, связанном с документом. По причине: " + e.getMessage();

            log.error(msg);
            throw new DataServiceException(msg);
        }
    }

    private IRecord fetchInbox(ResourceQualifier qualifier, IRecord record) {
        String inboxDataKey = record.getAsString("inbox_data_key");
        if (inboxDataKey == null) {
            throw new DataServiceException("Поле inbox_data_key не заполнено для объекта: " + qualifier.toString());
        }

        return baseDao.findBy(new ResourceQualifier(SYSTEM_SCHEMA_NAME, "tasks", inboxDataKey, TASK),
                              String.format("guid = '%s'", inboxDataKey))
                      .orElseThrow(() -> new IllegalStateException("Не найдено входящее сообщение: " + inboxDataKey));
    }
}
