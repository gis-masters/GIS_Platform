package ru.mycrg.data_service.dao.detached;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public class KptImportValidationDao {

    private static final Logger log = LoggerFactory.getLogger(KptImportValidationDao.class);

    private final DatasourceFactory datasourceFactory;

    public KptImportValidationDao(DatasourceFactory datasourceFactory) {
        this.datasourceFactory = datasourceFactory;
    }

    public Integer countRecordsByCadastralSquare(String cadastralSquare,
                                                 String dbName,
                                                 ResourceQualifier tableQualifier) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(dbName));
        String query = String.format(
                "SELECT COUNT(*) FROM %s.%s WHERE (source_doc::json)->>'title' = ?",
                tableQualifier.getSchema(), tableQualifier.getTable()
        );
        log.debug("Count records by cadastral square query: [{}]", query);

        return jdbcTemplate.queryForObject(query, Integer.class, cadastralSquare);
    }

    public LocalDateTime latestOrderCompletionDateByCadastralSquare(String dbName,
                                                                    String cadastralSquare,
                                                                    ResourceQualifier tableQualifier) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(dbName));
        String query = String.format(
                "SELECT dl.date_order_completion " + "FROM %s.%s d " +
                        "JOIN data.dl_data_kpt dl ON ((d.source_doc::json)->>'id')::int = dl.id " +
                        "AND (d.source_doc::json)->>'title' = ? AND date_order_completion IS NOT NULL " +
                        "ORDER BY dl.date_order_completion DESC " +
                        "LIMIT 1",
                tableQualifier.getSchema(), tableQualifier.getTable()
        );
        log.debug("Latest order completion date by cadastral square query: [{}]", query);
        List<LocalDateTime> result = jdbcTemplate.queryForList(query, LocalDateTime.class, cadastralSquare);

        return result.isEmpty() ? null : result.get(0);
    }
}
