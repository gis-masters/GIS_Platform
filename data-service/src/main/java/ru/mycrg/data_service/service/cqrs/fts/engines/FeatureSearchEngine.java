package ru.mycrg.data_service.service.cqrs.fts.engines;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.common_contracts.generated.fts.FtsRequestDto;
import ru.mycrg.common_contracts.generated.fts.FtsResponseDto;
import ru.mycrg.common_contracts.generated.fts.FtsType;
import ru.mycrg.common_contracts.generated.page.PageableResources;
import ru.mycrg.data_service.dao.FtsDao;
import ru.mycrg.data_service.dao.SpatialRecordsDao;
import ru.mycrg.data_service.dto.FtsItem;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.service.PsqlTimeoutService;
import ru.mycrg.data_service.service.cqrs.fts.FtsDictionaryService;
import ru.mycrg.data_service.service.cqrs.fts.HeadlineService;
import ru.mycrg.data_service.service.cqrs.fts.IFullTextSearchEngine;
import ru.mycrg.data_service.service.cqrs.fts.requests.FtsRequest;
import ru.mycrg.data_service.service.resources.DatasetService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.TableService;
import ru.mycrg.data_service.service.schemas.SchemaExtractor;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static ru.mycrg.common_contracts.generated.fts.FtsType.FEATURE;
import static ru.mycrg.common_utils.page.PageHandler.pageFromList;
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
    private final HeadlineService headlineService;
    private final SchemaExtractor schemaExtractor;
    private final SpatialRecordsDao spatialRecordsDao;
    private final FtsDictionaryService ftsDictionaryService;
    private final IAuthenticationFacade authenticationFacade;
    private final PsqlTimeoutService psqlTimeoutService;

    public FeatureSearchEngine(FtsDao ftsDao,
                               TableService tableService,
                               DatasetService datasetService,
                               HeadlineService headlineService,
                               SchemaExtractor schemaExtractor,
                               SpatialRecordsDao spatialRecordsDao,
                               FtsDictionaryService ftsDictionaryService,
                               IAuthenticationFacade authenticationFacade,
                               PsqlTimeoutService psqlTimeoutService) {
        this.ftsDao = ftsDao;
        this.tableService = tableService;
        this.datasetService = datasetService;
        this.headlineService = headlineService;
        this.schemaExtractor = schemaExtractor;
        this.spatialRecordsDao = spatialRecordsDao;
        this.ftsDictionaryService = ftsDictionaryService;
        this.authenticationFacade = authenticationFacade;
        this.psqlTimeoutService = psqlTimeoutService;
    }

    @Override
    public PageableResources<FtsResponseDto> search(FtsRequest request,
                                                    @Nullable Set<String> dictionaryWords) {
        log.info("FeatureSearcher: {}, with dictionary: [{}]", request, dictionaryWords);

        FtsRequestDto dto = request.getFtsRequestDto();
        String text = getSearchedText(request);

        // Если кадастровый номер, то все упростим
        if (isCadastrNumber(text)) {
            log.debug("Поиск в слоях кадастрового номера: '{}'", text);

            return searchAsCadastrNumber(request);
        }

        // Проверим права и запрошенные ресурсы
        Pageable pageable = request.getPageable();
        List<String> allowedTables = getAllowedSources(dto);
        if (allowedTables == null) {
            return pageFromList(new PageImpl<>(new ArrayList<>(), pageable, 0), pageable);
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

        final Set<String> dwords = dictionaryWords;
        List<FtsItem> founded = psqlTimeoutService.execute(() -> {
            return ftsDao.search(LAYERS,
                                 allowedTables,
                                 text,
                                 dwords,
                                 pageable);
        });
        foundWatcher.stop();
        double totalTimeSeconds = foundWatcher.getTotalTimeSeconds();
        log.debug("Поиск по слоям выполнен за: {} сек", totalTimeSeconds);

        // Long total = ftsDao.countTotal(LAYERS, allowedTables, null, text, getBound(dto));

        List<FtsResponseDto> result = fetchEntities(founded, dictionaryWords);

        return pageFromList(new PageImpl<>(result, pageable, pageable.getPageNumber()), pageable);
    }

    @Override
    public PageableResources<FtsResponseDto> searchAsCadastrNumber(FtsRequest request) {
        Pageable pageable = request.getPageable();
        FtsRequestDto dto = request.getFtsRequestDto();

        List<String> allowedTables = getAllowedSources(dto);
        if (allowedTables == null) {
            return pageFromList(new PageImpl<>(new ArrayList<>(), pageable, 0), pageable);
        }

        List<FtsItem> founded = ftsDao.searchCadastrNumber(LAYERS, allowedTables, null, dto.getText(), pageable);
        List<FtsResponseDto> result = fetchEntities(founded, Set.of(dto.getText()));

        return pageFromList(new PageImpl<>(result, pageable, pageable.getPageNumber()), pageable);
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
                                       return ResourceQualifier.tableQualifier(dataset, table);
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

    @NotNull
    private List<FtsResponseDto> fetchEntities(List<FtsItem> ftsItems,
                                               @Nullable Set<String> dictionaryWords) {
        StopWatch fetchEntitiesWatcher = new StopWatch();
        fetchEntitiesWatcher.start();

        // Перегруппируем данные, чтобы доставать сущности из отдельных библиотек одним запросом.
        Map<String, List<Long>> featuresByTable = new HashMap<>();
        ftsItems.forEach(ftsItem -> {
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

                Optional<SchemaDto> oSchema = schemaExtractor.get(tableQualifier);
                if (oSchema.isEmpty()) {
                    return;
                }

                List<FtsResponseDto> features = spatialRecordsDao
                        .findByIds(tableQualifier, oSchema.get(), recordIds)
                        .stream()
                        .map(toResponseDto(ftsItems, dictionaryWords, tableQualifier, oSchema.get()))
                        .collect(Collectors.toList());

                result.addAll(features);
            } catch (Exception e) {
                log.error("Не удалось достать объекты: {} из: {}. По причине: {}",
                          recordIds, complexName, e.getMessage());
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
    private Function<Feature, @NotNull FtsResponseDto> toResponseDto(List<FtsItem> ftsItems,
                                                                     Set<String> dictionaryWords,
                                                                     ResourceQualifier tableQualifier,
                                                                     SchemaDto schema) {
        return feature -> ftsItems
                .stream()
                .filter(ftsItem -> ftsItem.getId().equals(feature.getId()))
                .findFirst()
                .map(item -> mapToFtsResponseDto(item, dictionaryWords, feature, tableQualifier, schema))
                .orElseGet(FtsResponseDto::new);
    }

    @NotNull
    private FtsResponseDto mapToFtsResponseDto(FtsItem oItem,
                                               Set<String> dictionaryWords,
                                               Feature feature,
                                               ResourceQualifier tableQualifier,
                                               SchemaDto schema) {
        IResourceModel dataset = datasetService.getInfo(tableQualifier.getSchema());
        IResourceModel table = tableService.getInfo(tableQualifier);

        Set<String> headlines = new HashSet<>();
        if (dictionaryWords != null && !dictionaryWords.isEmpty()) {
            headlines = headlineService.fetchHeadlines(oItem.getConcatenatedData(), dictionaryWords);

            log.debug("For input: [{}] and by dictionary words: [{}] Headlines: {}",
                      oItem.getConcatenatedData(), dictionaryWords, headlines);
        }

        return new FtsResponseDto(FEATURE,
                                  oItem.getDist(),
                                  Map.of("dataset",
                                         dataset.getIdentifier(),
                                         "datasetTitle",
                                         dataset.getTitle(),
                                         "table", table.getIdentifier(),
                                         "tableTitle", table.getTitle(),
                                         "geometryType",
                                         schema.getGeometryType().getType(),
                                         "schema", schema.getName()),
                                  feature,
                                  headlines);
    }
}
