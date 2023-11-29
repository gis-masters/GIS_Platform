package ru.mycrg.data_service.service.cqrs.fts;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.common_contracts.generated.fts.FtsRequestDto;
import ru.mycrg.common_contracts.generated.fts.FtsResponseDto;
import ru.mycrg.common_contracts.generated.fts.FtsType;
import ru.mycrg.data_service.dao.FtsDao;
import ru.mycrg.data_service.dao.SpatialRecordsDao;
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
    private final IAuthenticationFacade authenticationFacade;

    public FeatureSearchEngine(FtsDao ftsDao,
                               TableService tableService,
                               DatasetService datasetService,
                               SchemaExtractor schemaExtractor,
                               SpatialRecordsDao spatialRecordsDao,
                               IAuthenticationFacade authenticationFacade) {
        this.ftsDao = ftsDao;
        this.tableService = tableService;
        this.datasetService = datasetService;
        this.schemaExtractor = schemaExtractor;
        this.spatialRecordsDao = spatialRecordsDao;
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public Page<FtsResponseDto> search(FtsRequest request) {
        log.info("FeatureSearcher: {}", request);
        Pageable pageable = request.getPageable();
        FtsRequestDto dto = request.getFtsRequestDto();

        List<String> tableNames = new ArrayList<>();
        if (!authenticationFacade.isOrganizationAdmin()) {
            List<ResourceQualifier> allowedTables = getAllowedSources(dto);
            if (allowedTables.isEmpty()) {
                return new PageImpl<>(new ArrayList<>(), pageable, 0);
            }

            tableNames = allowedTables.stream().map(ResourceQualifier::getTable).collect(Collectors.toList());
        }

        List<FtsItem> founded = ftsDao.search(LAYERS, tableNames, null, dto.getText(), getBound(dto), pageable);
        Long total = ftsDao.countTotal(LAYERS, new ArrayList<>(), null, dto.getText(), getBound(dto));

        List<FtsResponseDto> result = fetchEntities(founded);

        return new PageImpl<>(result, request.getPageable(), total);
    }

    @Override
    public FtsType getType() {
        return FEATURE;
    }

    @NotNull
    private List<ResourceQualifier> getAllowedSources(FtsRequestDto dto) {
        List<SchemasAndTables> allowedDatasets = datasetService.getAll();
        List<ResourceQualifier> allowedTables = getAllowedTables(allowedDatasets);

        List<ResourceQualifier> allowedSources = new ArrayList<>();
        List<Map<String, Object>> requestedSources = dto.getSources();
        if (requestedSources == null || requestedSources.isEmpty()) {
            return allowedTables;
        }

        requestedSources.forEach(data -> {
            String dataset = String.valueOf(data.get("dataset"));
            String table = String.valueOf(data.get("table"));
            allowedTables.stream()
                         .filter(qualifier -> dataset.equalsIgnoreCase(qualifier.getSchema())
                                 && table.equalsIgnoreCase(qualifier.getTable()))
                         .findFirst()
                         .ifPresent(allowedSources::add);
        });

        return allowedSources;
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
        });

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
