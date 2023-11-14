package ru.mycrg.data_service.service.cqrs.fts;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Component;
import ru.mycrg.common_contracts.generated.fts.FtsRequestDto;
import ru.mycrg.common_contracts.generated.fts.FtsResponseDto;
import ru.mycrg.common_contracts.generated.fts.FtsType;
import ru.mycrg.data_service.dao.FtsDao;
import ru.mycrg.data_service.dao.SpatialRecordsDao;
import ru.mycrg.data_service.dto.FtsItem;
import ru.mycrg.data_service.service.SchemaExtractor;
import ru.mycrg.data_service.service.cqrs.fts.requests.FtsRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;

import java.util.*;
import java.util.function.Function;
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
    private final SchemaExtractor schemaExtractor;
    private final SpatialRecordsDao spatialRecordsDao;

    public FeatureSearchEngine(FtsDao ftsDao,
                               SchemaExtractor schemaExtractor,
                               SpatialRecordsDao spatialRecordsDao) {
        this.ftsDao = ftsDao;
        this.schemaExtractor = schemaExtractor;
        this.spatialRecordsDao = spatialRecordsDao;
    }

    @Override
    public Page<FtsResponseDto> search(FtsRequest request) {
        log.info("FeatureSearcher: {}", request);
        FtsRequestDto dto = request.getFtsRequestDto();

        List<FtsItem> founded = ftsDao.search(LAYERS, new ArrayList<>(), null, dto.getText(),
                                              getBound(dto), request.getPageable());
        Long total = ftsDao.countTotal(LAYERS, new ArrayList<>(), dto.getEcqlFilter(), dto.getText(), getBound(dto));

        List<FtsResponseDto> result = fetchEntities(founded);

        return new PageImpl<>(result, request.getPageable(), total);
    }

    @Override
    public FtsType getType() {
        return FEATURE;
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
            String dataset = split[0];
            String table = split[1];
            ResourceQualifier qualifier = new ResourceQualifier(dataset, table);

            SchemaDto schema = schemaExtractor.get(qualifier).orElse(null);
            if (schema == null) {
                return;
            }

            List<FtsResponseDto> features = spatialRecordsDao
                    .findByIds(qualifier, schema, recordIds)
                    .stream()
                    .map(toResponseDto(dataset, table, schema.getName(), tables))
                    .collect(Collectors.toList());

            result.addAll(features);
        });

        return result.stream()
                     .sorted(ftsBoundComparator)
                     .collect(Collectors.toList());
    }

    @NotNull
    private static Function<Feature, FtsResponseDto> toResponseDto(String dataset,
                                                                   String table,
                                                                   String schemaName,
                                                                   List<FtsItem> items) {
        return feature -> {
            Optional<FtsItem> oItem = items.stream()
                                           .filter(ftsItem -> ftsItem.getId().equals(feature.getId()))
                                           .findFirst();

            return new FtsResponseDto(FEATURE,
                                      oItem.map(FtsItem::getDist).orElse(0f),
                                      Map.of("dataset", dataset, "table", table, "schema", schemaName),
                                      feature.getProperties());
        };
    }
}
