package ru.mycrg.data_service.service.cqrs.fts;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.FtsDao;
import ru.mycrg.data_service.dto.FtsHeadline;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class HeadlineService {

    private final static Logger log = LoggerFactory.getLogger(HeadlineService.class);

    private static final double THRESHOLD_LEVEL = 0.6;

    private final FtsDao ftsDao;

    public HeadlineService(FtsDao ftsDao) {
        this.ftsDao = ftsDao;
    }

    @NotNull
    public Set<String> fetchHeadlines(String text,
                                      @Nullable Set<String> dictionaryWords) {
        if (dictionaryWords == null) {
            return new HashSet<>();
        } else if (dictionaryWords.isEmpty()) {
            return dictionaryWords;
        }

        try {
            Set<FtsHeadline> result = new HashSet<>();
            dictionaryWords.forEach(dWord -> {
                ftsDao.searchHeadlines(dWord, text).stream()
                      .filter(headline -> headline.getDist() < THRESHOLD_LEVEL)
                      .forEach(result::add);
            });

            return result.stream()
                         .map(FtsHeadline::getData)
                         .collect(Collectors.toSet());
        } catch (Exception e) {
            log.error("Не удалось собрать слова для подсветки. По причине: {}", e.getMessage(), e);

            return new HashSet<>();
        }
    }
}
