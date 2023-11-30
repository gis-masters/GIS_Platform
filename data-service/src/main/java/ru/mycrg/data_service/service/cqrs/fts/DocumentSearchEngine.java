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
import ru.mycrg.data_service.dto.LibraryModel;
import ru.mycrg.data_service.dto.RegistryData;
import ru.mycrg.data_service.service.DocumentLibraryService;
import ru.mycrg.data_service.service.cqrs.fts.requests.FtsRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static ru.mycrg.common_contracts.generated.fts.FtsType.DOCUMENT;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;

@Component
public class DocumentSearchEngine implements IFullTextSearchEngine {

    private final Logger log = LoggerFactory.getLogger(DocumentSearchEngine.class);

    private final FtsDao ftsDao;
    private final SpatialRecordsDao spatialRecordsDao;
    private final DocumentLibraryService librariesService;
    private final IAuthenticationFacade authenticationFacade;

    public DocumentSearchEngine(FtsDao ftsDao,
                                SpatialRecordsDao spatialRecordsDao,
                                DocumentLibraryService librariesService,
                                IAuthenticationFacade authenticationFacade) {
        this.ftsDao = ftsDao;
        this.spatialRecordsDao = spatialRecordsDao;
        this.librariesService = librariesService;
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public Page<FtsResponseDto> search(FtsRequest request) {
        log.info("Document searcher: {}", request);

        FtsRequestDto dto = request.getFtsRequestDto();
        List<FtsItem> byAllLibraries = new ArrayList<>();
        getAllowedLibraries(dto)
                .map(ResourceQualifier::libraryQualifier)
                .forEach(libraryQualifier -> {
                    try {
                        log.debug("Поиск по библиотеке: [{}]", libraryQualifier);

                        List<FtsItem> temp;
                        if (authenticationFacade.isOrganizationAdmin()) {
                            temp = ftsDao.searchWithPermissions(libraryQualifier, dto, getBound(dto));
                        } else {
                            RegistryData registryData = librariesService.prepareDataForRegistry(libraryQualifier);

                            temp = ftsDao.searchWithPermissions(libraryQualifier,
                                                                dto.getEcqlFilter(),
                                                                dto.getText(),
                                                                getBound(dto),
                                                                registryData);
                        }

                        byAllLibraries.addAll(temp);
                    } catch (Exception e) {
                        log.error("Не удалось выполнить поиск для библиотеки: '{}'. По причине: {}",
                                  libraryQualifier.getQualifier(), e.getMessage());
                    }
                });

        List<FtsResponseDto> allSortedEntities = fetchEntities(byAllLibraries)
                .sorted(ftsBoundComparator)
                .collect(Collectors.toList());

        log.debug("In all libraries founded: {} documents", allSortedEntities.size());

        Pageable pageable = request.getPageable();
        List<FtsResponseDto> page = allSortedEntities
                .stream()
                .skip(pageable.getOffset())
                .limit(pageable.getPageSize())
                .collect(Collectors.toList());

        return new PageImpl<>(page, pageable, allSortedEntities.size());
    }

    @Override
    public FtsType getType() {
        return DOCUMENT;
    }

    @NotNull
    private Stream<String> getAllowedLibraries(FtsRequestDto dto) {
        List<String> allowedLibraries = librariesService
                .getAll(null).stream()
                .map(LibraryModel::getTableName)
                .collect(Collectors.toList());

        // Разрешенных нет
        if (allowedLibraries.isEmpty()) {
            return Stream.empty();
        }

        // Ничего не запрошено, возвращаем только разрешенные
        List<String> requestedLibraries = getRequestedLibraries(dto).collect(Collectors.toList());
        if (requestedLibraries.isEmpty()) {
            return allowedLibraries.stream();
        }

        // Среди запрошенных оставляем только разрешенные
        return requestedLibraries.stream().filter(allowedLibraries::contains);
    }

    private Stream<String> getRequestedLibraries(FtsRequestDto dto) {
        List<Map<String, Object>> requestedSources = dto.getSources();
        if (requestedSources == null || requestedSources.isEmpty()) {
            return Stream.empty();
        }

        return requestedSources.stream()
                               .map(source -> source.getOrDefault("library", "").toString())
                               .filter(s -> !s.isBlank());
    }

    private Stream<FtsResponseDto> fetchEntities(List<FtsItem> items) {
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
            SchemaDto schema = librariesService.getSchema(libraryName);
            String libraryTitle = librariesService.getInfo(libraryName).getTitle();

            List<FtsResponseDto> features = spatialRecordsDao
                    .findByIds(qualifier, schema, recordIds)
                    .stream()
                    .map(toResponseDto(libraryName, libraryTitle, schema.getName(), items))
                    .collect(Collectors.toList());

            result.addAll(features);
        });

        return result.stream();
    }

    @NotNull
    private static Function<Feature, FtsResponseDto> toResponseDto(String libraryName,
                                                                   String libraryTitle,
                                                                   String schemaName,
                                                                   List<FtsItem> items) {
        return feature -> {
            Optional<FtsItem> oItem = items.stream()
                                           .filter(ftsItem -> ftsItem.getId().equals(feature.getId()))
                                           .findFirst();

            return new FtsResponseDto(DOCUMENT,
                                      oItem.map(FtsItem::getDist).orElse(0f),
                                      Map.of("library", libraryName,
                                             "schema", schemaName,
                                             "title", libraryTitle),
                                      feature.getProperties());
        };
    }
}
