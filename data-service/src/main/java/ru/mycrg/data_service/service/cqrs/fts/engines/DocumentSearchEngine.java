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
import ru.mycrg.data_service.dto.LibraryModel;
import ru.mycrg.data_service.dto.RegistryData;
import ru.mycrg.data_service.service.cqrs.fts.FtsDictionaryService;
import ru.mycrg.data_service.service.cqrs.fts.HeadlineService;
import ru.mycrg.data_service.service.cqrs.fts.IFullTextSearchEngine;
import ru.mycrg.data_service.service.cqrs.fts.requests.FtsRequest;
import ru.mycrg.data_service.service.document_library.DocumentLibraryService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static ru.mycrg.common_contracts.generated.fts.FtsType.DOCUMENT;
import static ru.mycrg.common_utils.page.PageHandler.pageFromList;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.libraryQualifier;

@Component
public class DocumentSearchEngine implements IFullTextSearchEngine {

    private static final ResourceQualifier DOCUMENTS = libraryQualifier("fts_documents");

    private final Logger log = LoggerFactory.getLogger(DocumentSearchEngine.class);

    private final FtsDao ftsDao;
    private final HeadlineService headlineService;
    private final SpatialRecordsDao spatialRecordsDao;
    private final DocumentLibraryService librariesService;
    private final FtsDictionaryService ftsDictionaryService;
    private final IAuthenticationFacade authenticationFacade;

    public DocumentSearchEngine(FtsDao ftsDao,
                                HeadlineService headlineService,
                                SpatialRecordsDao spatialRecordsDao,
                                DocumentLibraryService librariesService,
                                FtsDictionaryService ftsDictionaryService,
                                IAuthenticationFacade authenticationFacade) {
        this.ftsDao = ftsDao;
        this.headlineService = headlineService;
        this.spatialRecordsDao = spatialRecordsDao;
        this.librariesService = librariesService;
        this.ftsDictionaryService = ftsDictionaryService;
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public PageableResources<FtsResponseDto> search(FtsRequest request, Set<String> dictionaryWords) {
        log.info("Document searcher: {}, with dictionary: [{}]", request, dictionaryWords);

        FtsRequestDto dto = request.getFtsRequestDto();
        String text = getSearchedText(request);
        if (isCadastrNumber(text)) {
            log.debug("Поиск в документах кадастрового номера: '{}'", text);

            return searchAsCadastrNumber(request);
        }

        if (dictionaryWords == null) {
            dictionaryWords = ftsDictionaryService.collectWordsForDocuments(text);
        }

        StopWatch docWatcher = new StopWatch();
        docWatcher.start();

        List<FtsItem> byAllLibraries = new ArrayList<>();
        Set<String> fDictionaryWords = dictionaryWords;
        getAllowedLibraries(dto)
                .map(ResourceQualifier::libraryQualifier)
                .forEach(libraryQualifier -> {
                    try {
                        log.debug("Поиск по библиотеке: [{}]", libraryQualifier);

                        RegistryData registryData = null;
                        if (!authenticationFacade.isOrganizationAdmin()) {
                            registryData = librariesService.prepareDataForRegistry(libraryQualifier);
                        }

                        List<FtsItem> temp = ftsDao.searchWithPermissions(libraryQualifier,
                                                                          dto.getEcqlFilter(),
                                                                          text,
                                                                          fDictionaryWords,
                                                                          registryData);

                        byAllLibraries.addAll(temp);
                    } catch (Exception e) {
                        log.error("Не удалось выполнить поиск для библиотеки: '{}'. По причине: {}",
                                  libraryQualifier.getQualifier(), e.getMessage());
                    }
                });

        docWatcher.stop();
        double docTotal = docWatcher.getTotalTimeSeconds();
        log.debug("Поиск по документам занял: {} сек", docTotal);

        List<FtsResponseDto> allSortedEntities = fetchEntities(byAllLibraries, fDictionaryWords)
                .sorted(ftsBoundComparator)
                .collect(Collectors.toList());

        log.debug("In all libraries founded: {} documents", allSortedEntities.size());

        Pageable pageable = request.getPageable();
        List<FtsResponseDto> page = allSortedEntities
                .stream()
                .skip(pageable.getOffset())
                .limit(pageable.getPageSize())
                .collect(Collectors.toList());

        return pageFromList(new PageImpl<>(page, pageable, allSortedEntities.size()), pageable);
    }

    @Override
    public PageableResources<FtsResponseDto> searchAsCadastrNumber(FtsRequest request) {
        Pageable pageable = request.getPageable();
        FtsRequestDto dto = request.getFtsRequestDto();

        List<String> allowedLibraries = getAllowedLibraries(dto).collect(Collectors.toList());
        if (allowedLibraries.isEmpty()) {
            return pageFromList(new PageImpl<>(new ArrayList<>(), pageable, 0), pageable);
        }

        List<FtsItem> founded = ftsDao.searchCadastrNumber(DOCUMENTS, allowedLibraries, null, dto.getText(), pageable);
        List<FtsResponseDto> result = fetchEntities(founded, Set.of(dto.getText())).collect(Collectors.toList());

        return pageFromList(new PageImpl<>(result, pageable, pageable.getPageNumber()), pageable);
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

    private Stream<FtsResponseDto> fetchEntities(List<FtsItem> items,
                                                 @Nullable Set<String> dictionaryWords) {
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
                    .map(feature -> mapToFtsResponseDto(items,
                                                        dictionaryWords,
                                                        feature,
                                                        libraryName,
                                                        libraryTitle,
                                                        schema.getName()))
                    .collect(Collectors.toList());

            result.addAll(features);
        });

        return result.stream();
    }

    private FtsResponseDto mapToFtsResponseDto(List<FtsItem> items,
                                               Set<String> dictionaryWords,
                                               Feature feature,
                                               String libraryName,
                                               String libraryTitle,
                                               String schemaName) {
        Optional<FtsItem> oItem = items.stream()
                                       .filter(ftsItem -> ftsItem.getId().equals(feature.getId()))
                                       .findFirst();
        if (oItem.isEmpty()) {
            return new FtsResponseDto();
        }

        Set<String> headlines = new HashSet<>();
        if (dictionaryWords != null && !dictionaryWords.isEmpty()) {
            headlines = headlineService.fetchHeadlines(oItem.get().getConcatenatedData(), dictionaryWords);

            log.debug("Headlines: {}", headlines);
        }

        return new FtsResponseDto(DOCUMENT,
                                  oItem.map(FtsItem::getDist).orElse(0f),
                                  Map.of("library", libraryName,
                                         "schema", schemaName,
                                         "title", libraryTitle),
                                  feature.getProperties(),
                                  headlines);
    }
}
