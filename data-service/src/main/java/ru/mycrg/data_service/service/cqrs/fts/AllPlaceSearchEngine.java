package ru.mycrg.data_service.service.cqrs.fts;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;
import ru.mycrg.common_contracts.generated.fts.FtsResponseDto;
import ru.mycrg.common_contracts.generated.fts.FtsType;
import ru.mycrg.data_service.service.cqrs.fts.requests.FtsRequest;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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
    public Page<FtsResponseDto> search(FtsRequest request, Set<String> dictionaryWords) {
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
        Page<FtsResponseDto> documents = documentSearchEngine.search(request, docWords);

        // Search by layers
         Set<String> layerWords = ftsDictionaryService.collectWordsForFeatures(text);
        Page<FtsResponseDto> features = featureSearchEngine.search(request, layerWords);

        watcher.stop();
        double docTotal = watcher.getTotalTimeSeconds();
        log.debug("Общий поиск занял: {} сек", docTotal);

        return combineResults(request.getPageable(), documents, features);
    }

    @Override
    public Page<FtsResponseDto> searchAsCadastrNumber(FtsRequest request) {
        return combineResults(request.getPageable(),
                              documentSearchEngine.searchAsCadastrNumber(request),
                              featureSearchEngine.searchAsCadastrNumber(request));
    }

    @Override
    public FtsType getType() {
        return null;
    }

    @NotNull
    private static PageImpl<FtsResponseDto> combineResults(Pageable pageable,
                                                           Page<FtsResponseDto> documents,
                                                           Page<FtsResponseDto> features) {
        List<FtsResponseDto> combined = new ArrayList<>();
        combined.addAll(documents.getContent());
        combined.addAll(features.getContent());

        // При таком объединении страдает местами постраничность, из-за одинаковых весов, но пока, наверное, не критично
        List<FtsResponseDto> result = combined.stream()
                                              .sorted(ftsBoundComparator)
                                              .limit(pageable.getPageSize())
                                              .collect(Collectors.toList());

        return new PageImpl<>(result, pageable, documents.getTotalElements() + features.getTotalElements());
    }
}
