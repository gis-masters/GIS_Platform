package ru.mycrg.data_service.service.gisogd;

import com.fasterxml.jackson.core.type.TypeReference;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StopWatch;
import org.springframework.web.util.UriComponentsBuilder;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.BaseReadDao;
import ru.mycrg.data_service.dao.GisogdRfDao;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.schemas.SchemaExtractor;
import ru.mycrg.data_service.service.schemas.SchemaUtil;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.dto.TypeDocumentData;
import ru.mycrg.data_service_contract.dto.TypeUrlData;
import ru.mycrg.gisog_service_contract.PublishToGisogdRfEvent;
import ru.mycrg.gisog_service_contract.dto.Document;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.net.URLDecoder;
import java.util.*;
import java.util.stream.Collectors;

import static java.lang.String.format;
import static java.nio.charset.StandardCharsets.UTF_8;
import static java.util.UUID.fromString;
import static ru.mycrg.common_utils.CrgGlobalProperties.getTableNameFromComplexName;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.FEATURE;
import static ru.mycrg.data_service.dto.ResourceType.TABLE;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.libraryRecordQualifier;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.systemTable;
import static ru.mycrg.data_service.util.JsonConverter.asJsonString;
import static ru.mycrg.data_service.util.JsonConverter.mapper;
import static ru.mycrg.data_service.util.LogUtil.withoutHeavyFields;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.CONTENT_TYPE_ID;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.GUID;
import static ru.mycrg.data_service_contract.enums.ValueType.DOCUMENT;
import static ru.mycrg.data_service_contract.enums.ValueType.URL;

@Component
public class RecordPublisher {

    private final Logger log = LoggerFactory.getLogger(RecordPublisher.class);

    private final BaseReadDao baseReadDao;
    private final GisogdRfDao gisogdRfDao;

    private final IMessageBusProducer messageBus;
    private final IAuthenticationFacade authenticationFacade;

    private final SchemaExtractor schemaExtractor;
    private final GisogdRfLibraryFieldsMapper libraryFieldsMapper;
    private final RecordsCache recordsCache;

    public RecordPublisher(BaseReadDao baseReadDao,
                           GisogdRfDao gisogdRfDao,
                           IMessageBusProducer messageBus,
                           SchemaExtractor schemaExtractor,
                           IAuthenticationFacade authenticationFacade,
                           GisogdRfLibraryFieldsMapper libraryFieldsMapper,
                           RecordsCache recordsCache) {
        this.baseReadDao = baseReadDao;
        this.messageBus = messageBus;
        this.gisogdRfDao = gisogdRfDao;
        this.schemaExtractor = schemaExtractor;
        this.authenticationFacade = authenticationFacade;
        this.libraryFieldsMapper = libraryFieldsMapper;
        this.recordsCache = recordsCache;
    }

    public Map<String, Long> publishDocument(Long taskId,
                                             ResourceQualifier qualifier,
                                             int srid,
                                             IRecord initialRecord) {
        Map<String, Long> watchLog = new HashMap<>();

        String guid = initialRecord.getAsString(GUID.getName());
        if (guid == null) {
            log.warn("Отправка не может быть выполнена. В документе [{}] не найдено поле 'guid'",
                     qualifier.getQualifier());

            return watchLog;
        }

        StopWatch publishWatcher = new StopWatch("Публикация: " + qualifier.getQualifier());
        publishWatcher.start("Маппинг полей согласно ГИСОГД РФ");
        Map<String, Object> mappedContent = libraryFieldsMapper.mapBySettings(qualifier.getTable(),
                                                                              initialRecord.getContent());
        publishWatcher.stop();
        watchLog.put(publishWatcher.getLastTaskName(), publishWatcher.getLastTaskTimeMillis());

        log.debug("Родительский объект до: [{}]", withoutHeavyFields(initialRecord.getContent()));
        log.debug("Родительский объект после удаления полей: [{}]", withoutHeavyFields(mappedContent));

        publishWatcher.start("childrenByDocument");
        List<Document> childrenByDocument = fetchByDocument(qualifier, mappedContent);
        publishWatcher.stop();
        watchLog.put(publishWatcher.getLastTaskName(), publishWatcher.getLastTaskTimeMillis());

        publishWatcher.start("childrenByUrlAsLinkToFeaturesFormula");
        Set<Document> childrenByUrlAsLinkToFeaturesFormula = fetchByUrlAsLinkToFeaturesFormula(qualifier, srid);
        publishWatcher.stop();
        watchLog.put(publishWatcher.getLastTaskName(), publishWatcher.getLastTaskTimeMillis());

        publishWatcher.start("childrenByUrlDirectly");
        Set<Document> childrenByUrlDirectly = fetchByUrlDirectly(qualifier, mappedContent, srid);
        publishWatcher.stop();
        watchLog.put(publishWatcher.getLastTaskName(), publishWatcher.getLastTaskTimeMillis());

        publishWatcher.start("Формирование массива детей(с маппингом полей)");
        List<Document> children = new ArrayList<>();
        children.addAll(childrenByDocument);
        children.addAll(childrenByUrlAsLinkToFeaturesFormula);
        children.addAll(childrenByUrlDirectly);

        // Для "детей" маппим контент - чтобы отправлялось только то, что нужно для ГИСОГД РФ
        children.forEach(child -> {
            child.setContent(libraryFieldsMapper.mapBySettings(child.getName(), child.getContent()));
        });
        publishWatcher.stop();
        watchLog.put(publishWatcher.getLastTaskName(), publishWatcher.getLastTaskTimeMillis());

        publishWatcher.start("Формирование списка не синхронизированных детей");
        List<Document> notSyncedChildren = new ArrayList<>();
        children.forEach(child -> {
            if ("territorykey".equals(child.getName())) {
                String territoryGuid = (String) child.getContent().get("guid");
                String filterByGuid = "guid = '" + territoryGuid + "'";

                baseReadDao.findBy(systemTable("territory"), filterByGuid)
                           .ifPresent(territory -> {
                               if (isNotSynced(territory.getAsString("gisogdrf_sync_status"))) {
                                   notSyncedChildren.add(child);
                               }
                           });
            } else {
                String syncStatus = (String) child.getContent().get("gisogdrf_sync_status");
                if (isNotSynced(syncStatus)) {
                    notSyncedChildren.add(child);
                }
            }
        });
        publishWatcher.stop();
        watchLog.put(publishWatcher.getLastTaskName(), publishWatcher.getLastTaskTimeMillis());

        if (!notSyncedChildren.isEmpty()) {
            publishWatcher.start("Запись ошибок о несинхронизированных детях");
            log.info("У документа: {} есть не синхронизированные дети: {}", guid, notSyncedChildren.size());

            Map<String, String> response = new HashMap<>();
            for (Document child: notSyncedChildren) {
                Object gisogdrfSyncStatus = child.getContent().get("gisogdrf_sync_status");
                if (gisogdrfSyncStatus != null) {
                    response.put(child.getName(), gisogdrfSyncStatus.toString());
                }
            }

            gisogdRfDao.writeErrors(qualifier, response);

            publishWatcher.stop();
            watchLog.put(publishWatcher.getLastTaskName(), publishWatcher.getLastTaskTimeMillis());

            return watchLog;
        }

        publishWatcher.start("Формирование и отправка события в очередь");
        PublishToGisogdRfEvent event = new PublishToGisogdRfEvent(
                authenticationFacade.getOrganizationId(),
                taskId,
                new Document(fromString(guid),
                             qualifier.getSchema(),
                             qualifier.getTable(),
                             initialRecord.getAsString(CONTENT_TYPE_ID.getName()),
                             mappedContent),
                children);

        log.debug("Публикуемое событие: [{}]", asJsonString(event));

        messageBus.produce(event);

        publishWatcher.stop();
        watchLog.put(publishWatcher.getLastTaskName(), publishWatcher.getLastTaskTimeMillis());
        log.debug(publishWatcher.prettyPrint());

        return watchLog;
    }

    // Статусы прописаны в схемах
    private boolean isNotSynced(String status) {
        return !"Синхронизирован".equals(status) &&
                !"Cинхронизация завершилась предупреждением".equals(status);
    }

    private List<Document> fetchByDocument(ResourceQualifier qualifier, Map<String, Object> content) {
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
                List<TypeDocumentData> documents = getDocuments(content, documentProperty);
                for (TypeDocumentData document: documents) {
                    String library = document.getLibraryTableName();
                    ResourceQualifier childDocQualifier = libraryRecordQualifier(library, document.getId());

                    try {
                        // Ищем среди библиотек документов
                        Optional<IRecord> childRecord = baseReadDao.findById(childDocQualifier);
                        childRecord.ifPresentOrElse(record -> {
                            String guid = record.getAsString(GUID.getName());
                            String contentType = record.getAsString(CONTENT_TYPE_ID.getName());

                            result.add(new Document((guid != null) ? fromString(guid) : null,
                                                    SYSTEM_SCHEMA_NAME,
                                                    library,
                                                    contentType,
                                                    record.getContent()));
                        }, () -> {
                            log.warn("Не найден связанный документ. [{}]", childDocQualifier.getQualifier());
                        });
                    } catch (Exception e) {
                        log.warn("Не удалось получить документ: [{}]", childDocQualifier.getQualifier(), e);
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
    private List<TypeDocumentData> getDocuments(Map<String, Object> content,
                                                SimplePropertyDto property) {
        String name = property.getName();
        String asString = null;
        try {
            asString = (String) content.get(name);
            if (asString == null) {
                return new ArrayList<>();
            }

            List<TypeDocumentData> records = mapper.readValue(asString,
                                                              new TypeReference<List<TypeDocumentData>>() {
                                                              });

            log.debug("Для свойства: '{}' найдено {} документ(ов)", name, records.size());

            return records;
        } catch (Exception e) {
            log.warn("Для поля: '{}' не удалось распарсить данные по связанным документам. " +
                             "Строка: '{}' не соответствует формату DOCUMENT !!!", name, asString);

            return new ArrayList<>();
        }
    }

    @NotNull
    private Set<Document> fetchByUrlDirectly(ResourceQualifier qualifier,
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
                      .flatMap(property -> fetchByUrlDirectly(property, parentContent, srid).stream())
                      .collect(Collectors.toSet());
    }

    private List<Document> fetchByUrlDirectly(SimplePropertyDto property,
                                              Map<String, Object> parentContent,
                                              int srid) {
        List<Document> result = new ArrayList<>();
        for (ResourceQualifier qualifier: extractTableQualifiers(property, parentContent)) {
            prepareDocument(qualifier, srid).ifPresent(result::add);
        }

        return result;
    }

    /**
     * В схеме заданной библиотеки, собираем объекты по связям типа URL.
     * <p>
     *
     * @param qualifier библиотека документов.
     * @param srid      код EPSG
     *
     * @return Квалификатор объекта слоя
     */
    @NotNull
    private Set<Document> fetchByUrlAsLinkToFeaturesFormula(ResourceQualifier qualifier, int srid) {
        log.debug("Собираем объекты по связям типа URL c формулой 'linkToFeaturesMentioningThisDocument' для: {}",
                  qualifier.getQualifier());

        return schemaExtractor
                .get(qualifier)
                .map(schema -> SchemaUtil.getPropsByFormula(schema, "linkToFeaturesMentioningThisDocument"))
                .orElseGet(ArrayList::new)
                .stream()
                .flatMap(property -> fetchByUrlAsLinkToFeaturesFormula(qualifier, property, srid).stream())
                .collect(Collectors.toSet());
    }

    private List<Document> fetchByUrlAsLinkToFeaturesFormula(ResourceQualifier qualifier,
                                                             SimplePropertyDto property,
                                                             int srid) {
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

                prepareDocument(objectQualifier.get(), srid)
                        .ifPresent(result::add);
            }
        }

        return result;
    }

    private Optional<Document> fetchTerritoryKey(ResourceQualifier qualifier,
                                                 List<String> layerComplexNames,
                                                 String columnName,
                                                 boolean includeParent,
                                                 int srid) {
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
            Optional<Document> oDocument = prepareDocument(territory, srid);
            if (oDocument.isPresent()) {
                Document territoryKey = oDocument.get();
                territoryKey.setName("territorykey");
                territoryKey.setContentType("territorykey");

                return Optional.of(territoryKey);
            }
        }

        return Optional.empty();
    }

    // TODO: вынести - это вспомогательный код.
    //  Формирует ResourceQualifier для документов, прикрепленных по определенному полю
    private List<ResourceQualifier> extractTableQualifiers(SimplePropertyDto property,
                                                           Map<String, Object> parentContent) {
        Object value = null;
        List<TypeUrlData> urls = new ArrayList<>();
        try {
            value = parentContent.get(property.getName());
            if (value != null) {
                urls = mapper.readValue(value.toString(),
                                        new TypeReference<List<TypeUrlData>>() {
                                        });
            }
        } catch (Exception e) {
            log.error("Задано некорректное значение в поле: [{}]. Не соответствует типу TypeUrlData", value, e);
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

    private Optional<Document> prepareDocument(ResourceQualifier recordQualifier, int srid) {
        log.debug("Подготовим документ для: '{}'", recordQualifier.getQualifier());

        Optional<IRecord> oRecord = gisogdRfDao.getRecord(recordQualifier, srid);
        if (oRecord.isEmpty()) {
            log.warn("Не найдена запись: {}", recordQualifier.getRecordId());

            return Optional.empty();
        }

        IRecord record = oRecord.get();
        String guid = record.getAsString(GUID.getName());

        return Optional.of(
                new Document((guid != null) ? fromString(guid) : null,
                             recordQualifier.getSchema(),
                             recordQualifier.getTable(),
                             recordQualifier.getTable(),
                             record.getContent()));
    }

    private Optional<ResourceQualifier> findRecord(ResourceQualifier qualifier,
                                                   String complexName,
                                                   String columnName,
                                                   boolean includeParents) {
        log.debug("Fetch from layer: {}", complexName);

        try {
            Optional<String> oTableName = getTableNameFromComplexName(complexName);
            if (oTableName.isEmpty()) {
                log.warn("Не верно заданы параметры valueFormulaParams. " +
                                 "Не удалось вытащить название таблицы из layerComplexName: {}", complexName);

                return Optional.empty();
            }

            // Тащим идентификатор набора данных текущего слоя из ранее собранного кеша, по ключу: "tableDatasetPairs"
            String tableName = oTableName.get();
            String datasetIdentifier;
            Optional<IRecord> oRecord = recordsCache.getRecord("tableDatasetPairs", tableName);
            if (oRecord.isPresent()) {
                datasetIdentifier = oRecord.get().getAsString("dataset");
                log.debug("Для таблицы: '{}' определен родительский набор данных: {}", tableName, datasetIdentifier);
            } else {
                log.warn("Не найден родитель для таблицы: {}", tableName);

                return Optional.empty();
            }

            // Ищем в слое запись, которая ссылается на документ. Берем id.
            Long recordId = null;
            if (includeParents) {
                Optional<Long> oRecordId = gisogdRfDao
                        .findJoinedToDocumentLayerRecordIdWithParents(datasetIdentifier,
                                                                      tableName,
                                                                      columnName,
                                                                      qualifier.getTableQualifier(),
                                                                      qualifier.getRecordId());

                if (oRecordId.isPresent()) {
                    recordId = oRecordId.get();
                } else {
                    log.debug("Не найдена запись в слое: '{}.{}' [PARENT ON]", datasetIdentifier, tableName);
                }
            } else {
                Optional<Long> oRecordId = gisogdRfDao
                        .findJoinedToDocumentLayerRecordId(datasetIdentifier,
                                                           tableName,
                                                           columnName,
                                                           qualifier.getTableQualifier(),
                                                           qualifier.getRecordId());

                if (oRecordId.isPresent()) {
                    recordId = oRecordId.get();
                } else {
                    log.debug("Не найдена запись в слое: '{}.{}' [PARENT OFF]", datasetIdentifier, tableName);
                }
            }

            return recordId == null
                    ? Optional.empty()
                    : Optional.of(new ResourceQualifier(datasetIdentifier, tableName, recordId, FEATURE));
        } catch (Exception e) {
            log.error("Не удается получить информацию из слоя: {}. По причине: {}",
                      complexName, e.getMessage(), e);
        }

        return Optional.empty();
    }
}
