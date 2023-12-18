package ru.mycrg.data_service.service.cqrs.fts;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.FtsDictionaryDao;
import ru.mycrg.data_service.dto.FtsDictionaryItem;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.service.cqrs.fts.IFullTextSearchEngine.notInStopWords;

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

    public Set<FtsDictionaryItem> collectWords(String text) {
        List<String> splitedText = Arrays.stream(text.replaceAll("[^a-zA-Z0-9а-яА-Я ]", " ").split(" "))
                                         .filter(s -> !s.isBlank() && s.length() > 1)
                                         .filter(notInStopWords)
                                         .collect(Collectors.toList());

        if (splitedText.size() == 1) {
            return new HashSet<>(ftsDictionaryDao.search(text, LIMIT));
        }

        Set<FtsDictionaryItem> words = new HashSet<>();
        for (String word: splitedText) {
            List<FtsDictionaryItem> allFound = ftsDictionaryDao.search(word, LIMIT);
            if (hazAbsoluteWords(allFound)) {
                List<FtsDictionaryItem> onlyAbsolute = allFound.stream()
                                                                      .filter(item -> item.getDist().equals(0f))
                                                                      .collect(Collectors.toList());

                words.addAll(onlyAbsolute);
            } else {
                words.addAll(allFound);
            }
        }

        return words;
    }

    /**
     * Проверим есть ли в выборке элементы с точным совпадением - это те у которых dist = 0
     */
    private boolean hazAbsoluteWords(List<FtsDictionaryItem> dictionaryItems) {
        return dictionaryItems.get(0).getDist().equals(0f);
    }
}
