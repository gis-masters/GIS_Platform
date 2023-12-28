package ru.mycrg.data_service.service.cqrs.fts;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.FtsDao;
import ru.mycrg.data_service.dto.FtsHeadline;

import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
public class HeadlineService {

    private final static Logger log = LoggerFactory.getLogger(HeadlineService.class);

    private static final double THRESHOLD_LEVEL = 0.5;
    private static final double ACCEPTABLE_DIFF_BETWEEN_NEIGHBORS = 0.05;

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
            return dictionaryWords.stream()
                                  .map(dWord -> ftsDao.searchHeadlines(dWord, text))
                                  .flatMap(this::bestHeadlines)
                                  .map(FtsHeadline::getData)
                                  .collect(Collectors.toSet());
        } catch (Exception e) {
            log.error("Не удалось собрать слова для подсветки. По причине: {}", e.getMessage(), e);

            return new HashSet<>();
        }
    }

    public Stream<FtsHeadline> bestHeadlines(Set<FtsHeadline> allHeadlines) {
        log.debug("bestHeadlines INPUT: {}", allHeadlines);

        if (allHeadlines == null || allHeadlines.isEmpty()) {
            return Stream.empty();
        }

        if (allHeadlines.size() == 1) {
            return allHeadlines.stream();
        }

        Set<FtsHeadline> result = new HashSet<>();
        for (Iterator<FtsHeadline> iterator = allHeadlines.iterator(); iterator.hasNext(); ) {
            FtsHeadline current = iterator.next();
            if (current.getDist() < THRESHOLD_LEVEL) {
                result.add(current);
                break;
            }

            if (result.isEmpty()) {
                result.add(current);
            }

            if (!iterator.hasNext()) {
                break;
            }

            FtsHeadline next = iterator.next();
            if (Math.abs(next.getDist() - current.getDist()) < ACCEPTABLE_DIFF_BETWEEN_NEIGHBORS) {
                result.add(next);
            }
        }

        log.debug("bestHeadlines OUTPUT: {}", result);

        return result.stream();
    }
}
