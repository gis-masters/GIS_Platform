package ru.mycrg.data_service.dao.detached;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapperResultSetExtractor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.dao.mappers.FeatureRowMapper;
import ru.mycrg.data_service.dao.utils.wellknown_formula_generator.PropertyBuilderWithFormula;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.geo_json.Feature;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import static ru.mycrg.data_service.dao.config.DaoProperties.DEFAULT_GEOMETRY_COLUMN_NAME;
import static ru.mycrg.data_service.dao.utils.SqlBuilder.buildCopyQuery;
import static ru.mycrg.data_service.dao.utils.SqlBuilder.buildCreateTableQuery;
import static ru.mycrg.data_service.kpt_import.KptImportUtils.DS_ID;
import static ru.mycrg.data_service.util.StringUtil.joinAndQuoteMark;

@Repository
public class KptImportDao {

    private static final Logger log = LoggerFactory.getLogger(KptImportDao.class);
    private static final String DOCUMENT_TITLE_FILTER_TEMPLATE = "(source_doc::json)->0->>'title' = ?";

    private final DatasourceFactory datasourceFactory;
    private final PropertyBuilderWithFormula propertyBuilder;

    public KptImportDao(DatasourceFactory datasourceFactory,
                        PropertyBuilderWithFormula propertyBuilder) {
        this.propertyBuilder = propertyBuilder;
        this.datasourceFactory = datasourceFactory;
    }

    public Integer countRecordsByCadastralSquare(String cadastralSquare,
                                                 String dbName,
                                                 ResourceQualifier qualifier) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getNamedDataSource(dbName, DS_ID));
        String query = String.format(
                "SELECT COUNT(*) FROM %s.%s WHERE %s",
                qualifier.getSchema(), qualifier.getTable(), DOCUMENT_TITLE_FILTER_TEMPLATE);

        log.debug("Подсчитываем кол-во записей согласно фильтра: [{}]", query);

        return jdbcTemplate.queryForObject(query, Integer.class, cadastralSquare);
    }

    public LocalDateTime latestOrderCompletionDateByCadastralSquare(String dbName,
                                                                    String cadastralSquare,
                                                                    ResourceQualifier qualifier) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getNamedDataSource(dbName, DS_ID));
        String query = String.format(
                "SELECT dl.date_order_completion " + "FROM %s.%s d " +
                        "JOIN data.dl_data_kpt dl ON ((d.source_doc::json)->>'id')::int = dl.id " +
                        "AND (d.source_doc::json)->0->>'title' = ? AND date_order_completion IS NOT NULL " +
                        "ORDER BY dl.date_order_completion DESC " +
                        "LIMIT 1",
                qualifier.getSchema(), qualifier.getTable());

        log.debug("Latest order completion date by cadastral square query: [{}]", query);
        List<LocalDateTime> result = jdbcTemplate.queryForList(query, LocalDateTime.class, cadastralSquare);

        return result.isEmpty() ? null : result.get(0);
    }

    /**
     * Ищет временные таблицы для импорта КПТ в схеме data
     *
     * @param dbName     название БД
     * @param tableNames названия временных таблиц, которые необходимо найти
     *
     * @return список названий существующих таблиц
     */
    public List<String> findKptTablesByNames(String dbName, Collection<String> tableNames) {
        NamedParameterJdbcTemplate pJdbcTemplate =
                new NamedParameterJdbcTemplate(datasourceFactory.getNamedDataSource(dbName, DS_ID));
        MapSqlParameterSource params = new MapSqlParameterSource("names", tableNames);

        String query = "SELECT t.table_name FROM information_schema.tables t " +
                "WHERE table_schema = 'data' " +
                "AND t.table_name in (:names)";
        log.debug("KPT temporary tables request: [{}]", query);

        return pJdbcTemplate.queryForList(query, params, String.class);
    }

    public void createTable(String dbName,
                            String schemaName,
                            String tableName,
                            List<SimplePropertyDto> properties,
                            String primaryKeyName) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getNamedDataSource(dbName, DS_ID));

        String query = buildCreateTableQuery(schemaName,
                                             tableName,
                                             primaryKeyName,
                                             propertyBuilder.buildProps(properties, primaryKeyName));

        log.debug("Create table query: [{}]", query);

        jdbcTemplate.execute(query);
    }

    /**
     * Удаляет записи в таблице по кадастрвоому номеру
     *
     * @param dbName        целевая БД
     * @param qualifier     целевая таблица, откуда будут удалены записи
     * @param documentTitle title документа
     */
    public void deleteAllByDocumentTitle(String dbName,
                                         ResourceQualifier qualifier,
                                         String documentTitle) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getNamedDataSource(dbName, DS_ID));

        String query = String.format("DELETE FROM %s.%s WHERE %s",
                                     qualifier.getSchema(), qualifier, DOCUMENT_TITLE_FILTER_TEMPLATE);
        log.debug("Запрос на удаление документа по его title: [{}]", query);

        jdbcTemplate.update(query, documentTitle);
    }

    public void copyCadastralSquare(String dbName,
                                    ResourceQualifier source,
                                    ResourceQualifier target,
                                    List<SimplePropertyDto> sourceProps,
                                    List<SimplePropertyDto> targetProps,
                                    String documentTitle) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getNamedDataSource(dbName, DS_ID));

        String query = buildCopyQuery(source.getTableQualifier(), target.getTableQualifier(), sourceProps, targetProps,
                                      DOCUMENT_TITLE_FILTER_TEMPLATE, Collections.emptyMap());
        log.debug("Запрос на копирование кадастровых кварталов: [{}]", query);

        jdbcTemplate.update(query, documentTitle);
    }

    public void deduplicateData(String dbName,
                                ResourceQualifier qualifier,
                                String targetProperty) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getNamedDataSource(dbName, DS_ID));

        String query = String.format(
                "DELETE FROM %1$s a " +
                        "WHERE EXISTS (" +
                        "SELECT 1 " +
                        "FROM %1$s b " +
                        "WHERE a.%2$s = b.%2$s " +
                        "AND a.created_at < b.created_at)",
                qualifier.getTableQualifier(), targetProperty);

        log.debug("Запрос для KPT удаляющий дубли: [{}]", query);

        jdbcTemplate.update(query);
    }

    public void makeGeometryValid(String dbName, ResourceQualifier qualifier) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getNamedDataSource(dbName, DS_ID));

        String query = String.format(
                "UPDATE %s.%s " +
                        "SET %3$s=public.st_makevalid(%3$s) " +
                        "WHERE public.st_isvalid(%3$s)=false",
                qualifier.getSchema(), qualifier.getTable(), DEFAULT_GEOMETRY_COLUMN_NAME);

        jdbcTemplate.execute(query);
    }

    public List<Feature> findRecordsWithGeometryCollection(String dbName, ResourceQualifier qualifier) {
        try {
            JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getNamedDataSource(dbName, DS_ID));

            String query = "SELECT * FROM " + qualifier.getTableQualifier() + " " +
                    " WHERE public.st_geometrytype(shape) = 'ST_GeometryCollection'";

            log.debug("Запрос для поиска объектов с геометрией типа GeometryCollection: [{}]", query);

            return jdbcTemplate.query(query,
                                      new RowMapperResultSetExtractor<>(
                                              new FeatureRowMapper(null)
                                      ));
        } catch (DataAccessException e) {
            return new ArrayList<>();
        }
    }

    public void unpackGeometryCollection(String dbName,
                                         ResourceQualifier qualifier,
                                         List<String> infectedRecords,
                                         String geometryType) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getNamedDataSource(dbName, DS_ID));

        String query = "" +
                "UPDATE " + qualifier.getTableQualifier() + " " +
                "SET shape = subquery.new_shape " +
                "FROM (" +
                "    SELECT" +
                "        dp.geom AS new_shape," +
                "        oks.objectid AS object_id" +
                "    FROM " +
                "        " + qualifier.getTableQualifier() + " AS oks," +
                "        LATERAL public.st_dump(oks.shape) AS dp" +
                "    WHERE" +
                "        oks.objectid IN (" + joinAndQuoteMark(infectedRecords) + ")" +
                "        AND" +
                "        public.st_astext(dp.geom) LIKE '" + geometryType + "%'" +
                ") AS subquery " +
                "WHERE " + qualifier.getTableQualifier() + ".objectid = subquery.object_id";

        log.debug("Запрос 'распаковка' GeometryCollection для таблицы: [{}]", query);

        jdbcTemplate.execute(query);
    }
}
