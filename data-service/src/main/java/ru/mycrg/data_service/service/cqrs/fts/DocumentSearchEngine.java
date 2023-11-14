package ru.mycrg.data_service.service.cqrs.fts;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import ru.mycrg.common_contracts.generated.fts.FtsRequestDto;
import ru.mycrg.common_contracts.generated.fts.FtsResponseDto;
import ru.mycrg.common_contracts.generated.fts.FtsType;
import ru.mycrg.data_service.dao.FtsDao;
import ru.mycrg.data_service.dao.SpatialRecordsDao;
import ru.mycrg.data_service.dto.FtsItem;
import ru.mycrg.data_service.service.DocumentLibraryService;
import ru.mycrg.data_service.service.SchemaExtractor;
import ru.mycrg.data_service.service.cqrs.fts.requests.FtsRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static ru.mycrg.common_contracts.generated.fts.FtsType.DOCUMENT;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;

@Component
public class DocumentSearchEngine implements IFullTextSearchEngine {

    private static final ResourceQualifier DOCUMENTS = new ResourceQualifier(SYSTEM_SCHEMA_NAME,
                                                                             "fts_documents",
                                                                             LIBRARY);

    private final Logger log = LoggerFactory.getLogger(DocumentSearchEngine.class);

    private final FtsDao ftsDao;
    private final SchemaExtractor schemaExtractor;
    private final SpatialRecordsDao spatialRecordsDao;
    private final DocumentLibraryService librariesService;

    public DocumentSearchEngine(FtsDao ftsDao,
                                SchemaExtractor schemaExtractor,
                                SpatialRecordsDao spatialRecordsDao,
                                DocumentLibraryService librariesService) {
        this.ftsDao = ftsDao;
        this.schemaExtractor = schemaExtractor;
        this.spatialRecordsDao = spatialRecordsDao;
        this.librariesService = librariesService;
    }

    @Override
    public Page<FtsResponseDto> search(FtsRequest request) {
        log.info("Document searcher: {}", request);
        Pageable pageable = request.getPageable();
        FtsRequestDto dto = request.getFtsRequestDto();
        String ecqlFilter = dto.getEcqlFilter();

        List<ResourceQualifier> sources = getSources(dto);
        if (sources.isEmpty()) {
            return new PageImpl<>(new ArrayList<>(), pageable, 0);
        }

        List<String> libNames = sources.stream().map(ResourceQualifier::getTable).collect(Collectors.toList());
        List<FtsItem> founded = ftsDao.search(DOCUMENTS, libNames, ecqlFilter, dto.getText(), getBound(dto), pageable);
        Long total = ftsDao.countTotal(DOCUMENTS, libNames, ecqlFilter, dto.getText(), getBound(dto));

        List<FtsResponseDto> result = fetchEntities(founded);

        return new PageImpl<>(result, pageable, total);
    }

    @Override
    public FtsType getType() {
        return DOCUMENT;
    }

    @NotNull
    private List<ResourceQualifier> getSources(FtsRequestDto dto) {
        List<ResourceQualifier> result = new ArrayList<>();

        List<ResourceQualifier> allowedSources = librariesService
                .getAll(dto.getEcqlFilter())
                .stream()
                .map(library -> new ResourceQualifier(SYSTEM_SCHEMA_NAME, library.getTableName(), LIBRARY))
                .collect(Collectors.toList());

        List<Map<String, Object>> requestedSources = dto.getSources();
        if (requestedSources == null || requestedSources.isEmpty()) {
            return allowedSources;
        }

        requestedSources.forEach(data -> {
            String library = String.valueOf(data.get("library"));
            allowedSources.stream()
                          .filter(qualifier -> library.equalsIgnoreCase(qualifier.getTable()))
                          .findFirst()
                          .ifPresent(result::add);
        });

        return result;
    }

    private List<FtsResponseDto> fetchEntities(List<FtsItem> items) {
        // Перегруппируем данные, чтобы доставать сущности из отдельных библиотек одним запросом.
        Map<String, List<Long>> featuresByLibrary = new HashMap<>();
        items.forEach(ftsItem -> {
            List<Long> ids = featuresByLibrary.getOrDefault(ftsItem.getTable(), new ArrayList<>());
            ids.add(ftsItem.getId());
            featuresByLibrary.put(ftsItem.getTable(), ids);
        });

        List<FtsResponseDto> result = new ArrayList<>();
        featuresByLibrary.forEach((libraryName, recordIds) -> {
            ResourceQualifier qualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, libraryName, LIBRARY);
            SchemaDto schema = schemaExtractor.get(qualifier).orElse(null);
            if (schema == null) {
                return;
            }

            List<FtsResponseDto> features = spatialRecordsDao
                    .findByIds(qualifier, schema, recordIds)
                    .stream()
                    .map(toResponseDto(libraryName, schema.getName(), items))
                    .collect(Collectors.toList());

            result.addAll(features);
        });

        return result.stream()
                     .sorted(ftsBoundComparator)
                     .collect(Collectors.toList());
    }

    @NotNull
    private static Function<Feature, FtsResponseDto> toResponseDto(String libraryName,
                                                                   String schemaName,
                                                                   List<FtsItem> items) {
        return feature -> {
            Optional<FtsItem> oItem = items.stream()
                                           .filter(ftsItem -> ftsItem.getId().equals(feature.getId()))
                                           .findFirst();

            return new FtsResponseDto(DOCUMENT,
                                      oItem.map(FtsItem::getDist).orElse(0f),
                                      Map.of("library", libraryName, "schema", schemaName),
                                      feature.getProperties());
        };
    }
}
