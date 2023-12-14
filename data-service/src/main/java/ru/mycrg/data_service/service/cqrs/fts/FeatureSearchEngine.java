package ru.mycrg.data_service.service.cqrs.fts;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.common_contracts.generated.fts.FtsRequestDto;
import ru.mycrg.common_contracts.generated.fts.FtsResponseDto;
import ru.mycrg.common_contracts.generated.fts.FtsType;
import ru.mycrg.data_service.dao.FtsDao;
import ru.mycrg.data_service.dao.SpatialRecordsDao;
import ru.mycrg.data_service.dto.FtsDictionaryItem;
import ru.mycrg.data_service.dto.FtsItem;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.service.SchemaExtractor;
import ru.mycrg.data_service.service.cqrs.fts.requests.FtsRequest;
import ru.mycrg.data_service.service.resources.DatasetService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.TableService;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;

import java.util.*;
import java.util.stream.Collectors;

import static ru.mycrg.common_contracts.generated.fts.FtsType.FEATURE;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;

@Component
public class FeatureSearchEngine implements IFullTextSearchEngine {

    private static final ResourceQualifier LAYERS = new ResourceQualifier(SYSTEM_SCHEMA_NAME,
                                                                          "fts_layers",
                                                                          LIBRARY);

    private final Logger log = LoggerFactory.getLogger(FeatureSearchEngine.class);

    private final FtsDao ftsDao;
    private final TableService tableService;
    private final DatasetService datasetService;
    private final SchemaExtractor schemaExtractor;
    private final SpatialRecordsDao spatialRecordsDao;
    private final FtsDictionaryService ftsDictionaryService;
    private final IAuthenticationFacade authenticationFacade;

    public FeatureSearchEngine(FtsDao ftsDao,
                               TableService tableService,
                               DatasetService datasetService,
                               SchemaExtractor schemaExtractor,
                               SpatialRecordsDao spatialRecordsDao,
                               FtsDictionaryService ftsDictionaryService,
                               IAuthenticationFacade authenticationFacade) {
        this.ftsDao = ftsDao;
        this.tableService = tableService;
        this.datasetService = datasetService;
        this.schemaExtractor = schemaExtractor;
        this.spatialRecordsDao = spatialRecordsDao;
        this.ftsDictionaryService = ftsDictionaryService;
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public Page<FtsResponseDto> search(FtsRequest request,
                                       @Nullable Set<String> dictionaryWords) {
        log.info("FeatureSearcher: {}, with dictionary: [{}]", request, dictionaryWords);

        FtsRequestDto dto = request.getFtsRequestDto();
        String text = dto.getText().trim();

        // Если кадастровый номер, то все упростим
        if (isCadastrNumber(text)) {
            log.debug("Поиск в слоях кадастрового номера: '{}'", text);

            return searchAsCadastrNumber(request);
        }

        // Проверим права и запрошенные ресурсы
        Pageable pageable = request.getPageable();
        List<String> allowedTables = getAllowedSources(dto);
        if (allowedTables == null) {
            return new PageImpl<>(new ArrayList<>(), pageable, 0);
        }

        // Соберем слова из словаря если их нам не прислали
        // TODO: пустой список безсмысленен - запрос ничего не найдет.
        // Надо или искать по другому или возвращать return new PageImpl<>(new ArrayList<>(), pageable, 0);
        if (dictionaryWords == null) {
            dictionaryWords = ftsDictionaryService.collectWordsForFeatures(text);
        }

        // Собственно основной поиск
        StopWatch foundWatcher = new StopWatch();
        foundWatcher.start();
        List<FtsItem> founded = ftsDao.search(LAYERS,
                                              allowedTables,
                                              null,
                                              text,
                                              dictionaryWords,
                                              0f,
                                              pageable);
        foundWatcher.stop();
        double totalTimeSeconds = foundWatcher.getTotalTimeSeconds();
        log.debug("Поиск выполнен за: {} сек", totalTimeSeconds);

        // Long total = ftsDao.countTotal(LAYERS, allowedTables, null, text, getBound(dto));

        List<FtsResponseDto> result = fetchEntities(founded);

        return new PageImpl<>(result, pageable, pageable.getPageNumber());
    }

    @Override
    public Page<FtsResponseDto> searchAsCadastrNumber(FtsRequest request) {
        Pageable pageable = request.getPageable();
        FtsRequestDto dto = request.getFtsRequestDto();

        List<String> allowedTables = getAllowedSources(dto);
        if (allowedTables == null) {
            return new PageImpl<>(new ArrayList<>(), pageable, 0);
        }

        List<FtsItem> founded = ftsDao.searchCadastrNumber(LAYERS, allowedTables, null, dto.getText(), pageable);
        List<FtsResponseDto> result = fetchEntities(founded);

        return new PageImpl<>(result, pageable, pageable.getPageNumber());
    }

    @Override
    public FtsType getType() {
        return FEATURE;
    }

    /**
     * @return null - разрешений нет. Пустой список - доступно всё.
     */
    @Nullable
    private List<String> getAllowedSources(FtsRequestDto dto) {
        List<ResourceQualifier> requestedTables = getRequestedLibraries(dto);

        if (authenticationFacade.isOrganizationAdmin()) {
            if (requestedTables.isEmpty()) {
                return new ArrayList<>();
            }

            return requestedTables.stream()
                                  .map(ResourceQualifier::getTable)
                                  .collect(Collectors.toList());
        }

        List<SchemasAndTables> allowedDatasets = datasetService.getAll();
        List<ResourceQualifier> allowedTables = getAllowedTables(allowedDatasets);

        // Разрешенных нет
        if (allowedTables.isEmpty()) {
            return null;
        }

        // Ничего не запрошено, возвращаем только разрешенные
        if (requestedTables.isEmpty()) {
            return allowedTables.stream()
                                .map(ResourceQualifier::getTable)
                                .collect(Collectors.toList());
        }

        // Среди запрошенных оставляем только разрешенные
        return requestedTables.stream()
                              .filter(requestedTable -> isExistInAllowed(requestedTable, allowedTables))
                              .map(ResourceQualifier::getTable)
                              .collect(Collectors.toList());
    }

    private boolean isExistInAllowed(ResourceQualifier requestedTable, List<ResourceQualifier> allowedTables) {
        return allowedTables.stream()
                            .anyMatch(allowedTable -> allowedTable.getTable().equals(requestedTable.getTable())
                                    && allowedTable.getSchema().equals(requestedTable.getSchema()));
    }

    @NotNull
    private List<ResourceQualifier> getRequestedLibraries(FtsRequestDto dto) {
        List<Map<String, Object>> requestedSources = dto.getSources();
        if (requestedSources == null || requestedSources.isEmpty()) {
            return new ArrayList<>();
        }

        return requestedSources.stream()
                               .map(source -> {
                                   String dataset = source.getOrDefault("dataset", "").toString();
                                   String table = source.getOrDefault("table", "").toString();

                                   if (!dataset.isBlank() || !table.isBlank()) {
                                       return ResourceQualifier.libraryQualifier(dataset, table);
                                   } else {
                                       return null;
                                   }
                               })
                               .filter(Objects::nonNull)
                               .collect(Collectors.toList());
    }

    private List<ResourceQualifier> getAllowedTables(List<SchemasAndTables> allowedDatasets) {
        List<ResourceQualifier> result = new ArrayList<>();
        allowedDatasets.forEach(dataset -> {
            List<ResourceQualifier> allowedTables = tableService
                    .getAll(dataset)
                    .stream()
                    .map(table -> new ResourceQualifier(dataset.getIdentifier(), table.getIdentifier()))
                    .collect(Collectors.toList());

            result.addAll(allowedTables);
        });

        return result;
    }

    private List<FtsResponseDto> fetchEntities(List<FtsItem> tables) {
        StopWatch fetchEntitiesWatcher = new StopWatch();
        fetchEntitiesWatcher.start();

        // Перегруппируем данные, чтобы доставать сущности из отдельных библиотек одним запросом.
        Map<String, List<Long>> featuresByTable = new HashMap<>();
        tables.forEach(ftsItem -> {
            String key = ftsItem.getSchema() + "." + ftsItem.getTable();
            List<Long> ids = featuresByTable.getOrDefault(key, new ArrayList<>());
            ids.add(ftsItem.getId());
            featuresByTable.put(key, ids);
        });

        List<FtsResponseDto> result = new ArrayList<>();
        featuresByTable.forEach((complexName, recordIds) -> {
            try {
                String[] split = complexName.split("\\.");
                String datasetId = split[0];
                String tableId = split[1];
                ResourceQualifier tableQualifier = new ResourceQualifier(datasetId, tableId);

                SchemaDto schema = schemaExtractor.get(tableQualifier).orElse(null);
                if (schema == null) {
                    return;
                }

                List<FtsResponseDto> features = spatialRecordsDao
                        .findByIds(tableQualifier, schema, recordIds)
                        .stream()
                        .map(feature -> mapToResponseDto(feature, tableQualifier, schema, tables))
                        .collect(Collectors.toList());

                result.addAll(features);
            } catch (Exception e) {
                log.error("Не удалось достать объекты: {} из: {}", recordIds, complexName);
            }
        });

        fetchEntitiesWatcher.stop();
        double totalTimeSeconds = fetchEntitiesWatcher.getTotalTimeSeconds();
        log.debug("Собрали данные найденных сущностей за: {} сек", totalTimeSeconds);

        return result.stream()
                     .sorted(ftsBoundComparator)
                     .collect(Collectors.toList());
    }

    @NotNull
    private FtsResponseDto mapToResponseDto(Feature feature,
                                            ResourceQualifier tableQualifier,
                                            SchemaDto schema,
                                            List<FtsItem> items) {
        IResourceModel dataset = datasetService.getInfo(tableQualifier.getSchema());
        IResourceModel table = tableService.getInfo(tableQualifier);

        Optional<FtsItem> oItem = items.stream()
                                       .filter(ftsItem -> ftsItem.getId().equals(feature.getId()))
                                       .findFirst();

        return new FtsResponseDto(FEATURE,
                                  oItem.map(FtsItem::getDist).orElse(0f),
                                  Map.of("dataset", dataset.getIdentifier(),
                                         "datasetTitle", dataset.getTitle(),
                                         "table", table.getIdentifier(),
                                         "tableTitle", table.getTitle(),
                                         "geometryType", schema.getGeometryType().getType(),
                                         "schema", schema.getName()),
                                  feature.getProperties());
    }
}
