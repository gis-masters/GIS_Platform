package ru.mycrg.data_service.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.util.StopWatch;
import ru.mycrg.data_service.dto.FtsDictionaryItem;

import javax.annotation.Nullable;
import java.util.List;

import static java.sql.Types.VARCHAR;

@Repository
public class FtsDictionaryDao {

    public static final String DEFAULT_LIMIT = "10";

    private final Logger log = LoggerFactory.getLogger(FtsDictionaryDao.class);

    private final NamedParameterJdbcTemplate pJdbcTemplate;

    public FtsDictionaryDao(NamedParameterJdbcTemplate parameterJdbcTemplate) {
        this.pJdbcTemplate = parameterJdbcTemplate;
    }

    public List<FtsDictionaryItem> search(String text) {
        return search(text, null, null);
    }

    public List<FtsDictionaryItem> search(String text, Integer limit) {
        return search(text, limit, null);
    }

    public List<FtsDictionaryItem> search(String text,
                                          @Nullable Integer limit,
                                          @Nullable Integer type) {
        StopWatch searchWatch = new StopWatch();
        searchWatch.start();

        String whereSection = "word_distance.dist < 0.9";
        if (type != null) {
            whereSection = String.format("(type_id = " + type + " AND %s)", whereSection);
        }

        String asLimit = (limit == null)
                ? "LIMIT " + DEFAULT_LIMIT
                : "LIMIT " + limit;

        String query = "" +
                "SELECT word_distance.dist, d.* " +
                "FROM ( " +
                "        SELECT word, word OPERATOR (public.<->) :searchedText as dist " +
                "        FROM data.fts_dictionary " +
                "    ) AS word_distance " +
                "    JOIN data.fts_dictionary AS d ON word_distance.word = d.word " +
                "WHERE " + whereSection + " " +
                "ORDER BY word_distance.dist " + asLimit;

        log.debug("Search in dictionary query: [{}]", query);

        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("searchedText", text, VARCHAR);

        List<FtsDictionaryItem> result = pJdbcTemplate.query(query,
                                                             parameters,
                                                             new BeanPropertyRowMapper<>(FtsDictionaryItem.class));

        searchWatch.stop();
        double totalTimeSeconds = searchWatch.getTotalTimeSeconds();
        log.debug("Поиск по словарю слова: '{}', типа: '{}' занял: {} сек", text, type, totalTimeSeconds);
        if (totalTimeSeconds > 5) {
            log.warn("!!! ATTENTION !!! Медленный поиск по словарю. Рекомендуется перестроить словарь!");
        }

        return result;
    }
}
