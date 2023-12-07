package ru.mycrg.data_service.dao.detached;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static ru.mycrg.data_service.dao.utils.SqlBuilder.buildCopyQuery;

@Repository
public class KptImportDao {

    private static final Logger log = LoggerFactory.getLogger(KptImportDao.class);
    private static final String CADASTRAL_SQARE_FILTER_TEMPLATE = "(source_doc::json)->>'title' = ?";

    private final DatasourceFactory datasourceFactory;

    public KptImportDao(DatasourceFactory datasourceFactory) {
        this.datasourceFactory = datasourceFactory;
    }

    public Integer countRecordsByCadastralSquare(String cadastralSquare,
                                                 String dbName,
                                                 ResourceQualifier tableQualifier) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(dbName));
        String query = String.format(
                "SELECT COUNT(*) FROM %s.%s WHERE %s",
                tableQualifier.getSchema(), tableQualifier.getTable(), CADASTRAL_SQARE_FILTER_TEMPLATE
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

    /**
     * Удаляет записи в таблице по кадастрвоому номеру
     *
     * @param tableQualifier   таблица, откуда будут удалены записи
     * @param cadasttralSquare параметры, которые будут подставлены в условие
     * @param dbName           название БД
     */
    public void deleteAllByCadatstralSquare(String dbName, ResourceQualifier tableQualifier,
                                              String cadasttralSquare) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(dbName));
        String query = String.format("DELETE FROM %s.%s WHERE %s",
                                     tableQualifier.getSchema(), tableQualifier, CADASTRAL_SQARE_FILTER_TEMPLATE);
        log.debug("Delete by cadastral square query: [{}]", query);
        jdbcTemplate.update(query, cadasttralSquare);
    }

    public void copyCadastralSquare(String dbName,
                                    ResourceQualifier source,
                                    ResourceQualifier target,
                                    List<SimplePropertyDto> sourceProps,
                                    List<SimplePropertyDto> targetProps,
                                    String cadastralSquare) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(dbName));
        String query = buildCopyQuery(source.getTableQualifier(), target.getTableQualifier(), sourceProps, targetProps,
                                      CADASTRAL_SQARE_FILTER_TEMPLATE, Collections.emptyMap());
        log.debug("Copy cadastral square query: [{}]", query);
        jdbcTemplate.update(query, cadastralSquare);
    }
}
