package ru.mycrg.data_service.service.cqrs.fts.engines;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;
import ru.mycrg.common_contracts.generated.fts.FtsResponseDto;
import ru.mycrg.common_contracts.generated.fts.FtsType;
import ru.mycrg.common_contracts.generated.page.PageableResources;
import ru.mycrg.data_service.service.cqrs.fts.FtsDictionaryService;
import ru.mycrg.data_service.service.cqrs.fts.IFullTextSearchEngine;
import ru.mycrg.data_service.service.cqrs.fts.requests.FtsRequest;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static ru.mycrg.common_utils.page.PageHandler.pageFromList;

@Component
public class AllPlaceSearchEngine implements IFullTextSearchEngine {

    private final Logger log = LoggerFactory.getLogger(AllPlaceSearchEngine.class);

    private final FeatureSearchEngine featureSearchEngine;
    private final DocumentSearchEngine documentSearchEngine;
    private final FtsDictionaryService ftsDictionaryService;

    public AllPlaceSearchEngine(DocumentSearchEngine documentSearchEngine,
                                FeatureSearchEngine featureSearchEngine,
                                FtsDictionaryService ftsDictionaryService) {
        this.documentSearchEngine = documentSearchEngine;
        this.featureSearchEngine = featureSearchEngine;
        this.ftsDictionaryService = ftsDictionaryService;
    }

    @Override
    public PageableResources<FtsResponseDto> search(FtsRequest request, Set<String> dictionaryWords) {
        log.info("AllPlaceSearcher: {}", request);

        String text = getSearchedText(request);
        if (isCadastrNumber(text)) {
            log.debug("Поисковый запрос: '{}' определен как кадастровый номер", request.getFtsRequestDto().getText());

            return searchAsCadastrNumber(request);
        }

        StopWatch watcher = new StopWatch();
        watcher.start();

        // Search by documents
        Set<String> docWords = ftsDictionaryService.collectWordsForDocuments(text);
        PageableResources<FtsResponseDto> documents = documentSearchEngine.search(request, docWords);

        // Search by layers
        Set<String> layerWords = ftsDictionaryService.collectWordsForFeatures(text);
        PageableResources<FtsResponseDto> features = featureSearchEngine.search(request, layerWords);

        watcher.stop();
        double docTotal = watcher.getTotalTimeSeconds();
        log.debug("Общий поиск занял: {} сек", docTotal);

        return combineResults(request.getPageable(), documents, features);
    }

    @Override
    public PageableResources<FtsResponseDto> searchAsCadastrNumber(FtsRequest request) {
        return combineResults(request.getPageable(),
                              documentSearchEngine.searchAsCadastrNumber(request),
                              featureSearchEngine.searchAsCadastrNumber(request));
    }

    @Override
    public FtsType getType() {
        return null;
    }

    @NotNull
    private static PageableResources<FtsResponseDto> combineResults(Pageable pageable,
                                                                    PageableResources<FtsResponseDto> documents,
                                                                    PageableResources<FtsResponseDto> features) {
        List<FtsResponseDto> combined = new ArrayList<>();
        combined.addAll(documents.getContent());
        combined.addAll(features.getContent());

        // При таком объединении страдает местами постраничность, из-за одинаковых весов, но пока, наверное, не критично
        List<FtsResponseDto> result = combined.stream()
                                              .sorted(ftsBoundComparator)
                                              .limit(pageable.getPageSize())
                                              .collect(Collectors.toList());

        return pageFromList(
                new PageImpl<>(result,
                               pageable,
                               documents.getPage().getTotalElements() + features.getPage().getTotalElements()),
                pageable);
    }
}
