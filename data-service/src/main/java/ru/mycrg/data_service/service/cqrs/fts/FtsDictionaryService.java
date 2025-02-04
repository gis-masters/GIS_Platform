package ru.mycrg.data_service.service.cqrs.fts;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.FtsDictionaryDao;
import ru.mycrg.data_service.dto.FtsDictionaryItem;

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.service.cqrs.fts.IFullTextSearchEngine.notInStopWords;
import static ru.mycrg.data_service.service.cqrs.fts.IFullTextSearchEngine.stopWords;

@Service
public class FtsDictionaryService {

    public static final int LIMIT = 8;

    private final Logger log = LoggerFactory.getLogger(FtsDictionaryService.class);

    private final FtsDictionaryDao ftsDictionaryDao;

    public FtsDictionaryService(FtsDictionaryDao ftsDictionaryDao) {
        this.ftsDictionaryDao = ftsDictionaryDao;
    }

    public Set<String> collectWordsForFeatures(String text) {
        Set<String> result = collectWords(text).stream()
                                               .filter(item -> item.getTypeId().equals(1))
                                               .map(FtsDictionaryItem::getWord)
                                               .collect(Collectors.toSet());

        log.info("Для поискового запроса: '{}' в словаре найдены: \n" +
                         "--- для поиска в слоях - слова: {}",
                 text, result);

        return result;
    }

    public Set<String> collectWordsForDocuments(String text) {
        Set<String> result = collectWords(text).stream()
                                               .filter(item -> item.getTypeId().equals(2))
                                               .map(FtsDictionaryItem::getWord)
                                               .collect(Collectors.toSet());

        log.info("Для поискового запроса: '{}' в словаре найдены: \n" +
                         "--- для поиска в документах - слова: {}",
                 text, result);

        return result;
    }

    private Set<FtsDictionaryItem> collectWords(String text) {
        return Arrays.stream(text.replaceAll("[^a-zA-Z0-9а-яА-Я ]", " ").split(" "))
                     .filter(s -> !s.isBlank() && s.length() > 1)
                     .filter(notInStopWords)
                     .flatMap(word -> getOnlyAbsolute(ftsDictionaryDao.search(word, LIMIT)).stream())
                     .filter(item -> !stopWords.contains(item.getWord()))
                     .collect(Collectors.toSet());
    }

    private List<FtsDictionaryItem> getOnlyAbsolute(List<FtsDictionaryItem> all) {
        List<FtsDictionaryItem> onlyAbsolute = all.stream()
                                                  .filter(item -> item.getDist().equals(0f))
                                                  .collect(Collectors.toList());

        return onlyAbsolute.isEmpty()
                ? all
                : onlyAbsolute;
    }
}
