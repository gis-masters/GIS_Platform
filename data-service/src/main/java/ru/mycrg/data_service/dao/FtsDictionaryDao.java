package ru.mycrg.data_service.dao;

import org.jetbrains.annotations.NotNull;
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

    private final Logger log = LoggerFactory.getLogger(FtsDictionaryDao.class);

    private final NamedParameterJdbcTemplate pJdbcTemplate;

    public FtsDictionaryDao(NamedParameterJdbcTemplate parameterJdbcTemplate) {
        this.pJdbcTemplate = parameterJdbcTemplate;
    }

    public List<FtsDictionaryItem> search(String text, Integer limit) {
        return search(text, limit, null);
    }

    public List<FtsDictionaryItem> search(String text,
                                          @NotNull Integer limit,
                                          @Nullable Integer type) {
        StopWatch searchWatch = new StopWatch();
        searchWatch.start();

        String typeSection = "";
        if (type != null) {
            typeSection = "AND type_id = " + type;
        }

        String query = "" +
                "SELECT wd.dist, d.* " +
                "FROM ( " +
                "        SELECT word, type_id, word OPERATOR (public.<->) :searchedText as dist " +
                "        FROM data.fts_dictionary " +
                "    ) AS wd " +
                "    JOIN data.fts_dictionary AS d ON wd.word = d.word AND wd.type_id = d.type_id " +
                "WHERE wd.dist < 0.9 " + typeSection +
                "ORDER BY wd.dist LIMIT " + limit;

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
