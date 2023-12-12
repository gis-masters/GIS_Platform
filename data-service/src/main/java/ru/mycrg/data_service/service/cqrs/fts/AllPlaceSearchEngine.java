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
import ru.mycrg.data_service.dao.FtsDictionaryDao;
import ru.mycrg.data_service.dto.FtsDictionaryItem;
import ru.mycrg.data_service.service.cqrs.fts.requests.FtsRequest;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class AllPlaceSearchEngine implements IFullTextSearchEngine {

    private final Logger log = LoggerFactory.getLogger(AllPlaceSearchEngine.class);

    private final FtsDictionaryDao ftsDictionaryDao;
    private final FeatureSearchEngine featureSearchEngine;
    private final DocumentSearchEngine documentSearchEngine;

    public AllPlaceSearchEngine(FtsDictionaryDao ftsDictionaryDao,
                                DocumentSearchEngine documentSearchEngine,
                                FeatureSearchEngine featureSearchEngine) {
        this.ftsDictionaryDao = ftsDictionaryDao;
        this.documentSearchEngine = documentSearchEngine;
        this.featureSearchEngine = featureSearchEngine;
    }

    @Override
    public Page<FtsResponseDto> search(FtsRequest request, Set<String> dictionaryWords) {
        log.info("AllPlaceSearcher: {}", request);

        String text = request.getFtsRequestDto().getText().trim();
        if (isCadastrNumber(text)) {
            log.debug("Поисковый запрос: '{}' определен как кадастровый номер", request.getFtsRequestDto().getText());

            return searchAsCadastrNumber(request);
        }

        // Search words in dictionary
        StopWatch wordsWatcher = new StopWatch();
        wordsWatcher.start();

        Set<FtsDictionaryItem> words = collectWordsFromDictionary(text);
        Set<String> docWords = words.stream()
                                    .filter(item -> item.getTypeId().equals(2))
                                    .map(FtsDictionaryItem::getWord)
                                    .collect(Collectors.toSet());
        Set<String> layerWords = words.stream()
                                      .filter(item -> item.getTypeId().equals(1))
                                      .map(FtsDictionaryItem::getWord)
                                      .collect(Collectors.toSet());

        wordsWatcher.stop();
        double totalTimeSeconds = wordsWatcher.getTotalTimeSeconds();
        log.info("Для поискового запроса: '{}' в словаре найдены: \n" +
                         "--- для поиска в слоях слова: {} \n" +
                         "--- для поиска в документах слова: {}\n" +
                         "--- затраченное на поиск по словарю время: {} сек",
                 text, layerWords, docWords, totalTimeSeconds);

        // Search by documents
        StopWatch docWatcher = new StopWatch();
        docWatcher.start();

        Page<FtsResponseDto> documents = documentSearchEngine.search(request, docWords);

        docWatcher.stop();
        double docTotal = docWatcher.getTotalTimeSeconds();
        log.debug("Поиск по документам занял: {} сек", docTotal);

        // Search by layers
        StopWatch layerWatcher = new StopWatch();
        layerWatcher.start();

        Page<FtsResponseDto> features = featureSearchEngine.search(request, layerWords);

        layerWatcher.stop();
        double layerTotal = layerWatcher.getTotalTimeSeconds();
        log.debug("Поиск по слоям занял: {} сек", layerTotal);

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

    private Set<FtsDictionaryItem> collectWordsFromDictionary(String text) {
        String trimedText = text.trim();
        List<String> splitedText = Arrays.stream(trimedText.replaceAll("[^a-zA-Z0-9а-яА-Я ]", " ").split(" "))
                                         .collect(Collectors.toList());

        if (splitedText.size() == 1) {
            return new HashSet<>(ftsDictionaryDao.search(trimedText));
        }

        Set<FtsDictionaryItem> words = new HashSet<>();
        for (String word: splitedText) {
            words.addAll(ftsDictionaryDao.search(word, 6));
        }

        return words;
    }
}
