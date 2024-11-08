package ru.mycrg.data_service.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.dao.mappers.RecordRowMapper;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.util.JsonConverter;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static ru.mycrg.data_service.dao.config.DaoProperties.GISOGFRF_RESPONSE;
import static ru.mycrg.data_service.dao.utils.ResourceQualifierUtil.getIdField;

@Repository
public class GisogdRfDao {

    private final Logger log = LoggerFactory.getLogger(GisogdRfDao.class);

    private final JdbcTemplate jdbcTemplate;

    public GisogdRfDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<Long> findJoinedToDocumentLayerRecordId(String dataset,
                                                            String layer,
                                                            String column,
                                                            String libraryQualifier,
                                                            Object libraryRecordId) {
        String query = "" +
                "SELECT " +
                "  layer_record_id " +
                "FROM " +
                "  " + libraryQualifier + " AS dl " +
                "  join (" +
                "    SELECT " +
                "      ttt.objectid AS layer_record_id," +
                "      jsonb_extract_path_text(elem :: jsonb, 'id') AS layerRecordId" +
                "    FROM" +
                "      " + dataset + "." + layer + " AS ttt," +
                "      LATERAL jsonb_array_elements_text(" + column + " :: jsonb) AS elem" +
                "  ) AS layer on dl.id :: int = layer.layerRecordId :: int " +
                "WHERE dl.id = " + libraryRecordId + " LIMIT (1)";

        log.debug("find joined to document layer record id for gisogdRf: [{}]", query);

        List<Long> ids = jdbcTemplate.queryForList(query, Long.class);

        return ids.isEmpty()
                ? Optional.empty()
                : Optional.ofNullable(ids.get(0));
    }

    public Optional<Long> findJoinedToDocumentLayerRecordIdWithParents(String dataset,
                                                                       String layer,
                                                                       String column,
                                                                       String libraryQualifier,
                                                                       Object libraryRecordId) {
        String query = "" +
                "WITH parsed_map AS ( " +
                "  SELECT " +
                "    jsonb_extract_path_text(elem :: jsonb, 'id') AS map_id, " +
                "    * " +
                "  FROM " +
                "    " + dataset + "." + layer + ", " +
                "    LATERAL jsonb_array_elements_text(" + column + " :: jsonb) AS elem " +
                ") " +
                "SELECT " +
                "  map_place.objectId " +
                "FROM " + libraryQualifier + " as dl " +
                "  JOIN parsed_map as map_place ON map_place.map_id :: int IN ( " +
                "    SELECT val :: int " +
                "    FROM " +
                "      unnest( " +
                "        string_to_array(dl.path, '/') " +
                "      ) AS t(val) " +
                "    WHERE t.val <> 'root' AND t.val <> '' " +
                "  ) " +
                "  OR dl.id :: int = map_place.map_id :: int " +
                "WHERE dl.id = " + libraryRecordId + " LIMIT (1)";

        log.debug("find joined to document layer record id for gisogdRf with parents: [{}]", query);

        List<Long> ids = jdbcTemplate.queryForList(query, Long.class);

        return ids.isEmpty()
                ? Optional.empty()
                : Optional.ofNullable(ids.get(0));
    }

    /**
     * Выборка документов готовых к отправке.
     * <p>
     * Сюда подпадают документы в статусе: "Синхронизация завершилась ошибкой" и "Не синхронизирован".
     *
     * @param qualifier Квалификатор библиотеки
     * @param limit     Лимит
     */
    public List<IRecord> getDocumentsForPublishing(ResourceQualifier qualifier, Long limit) {
        String query = "SELECT * FROM " + qualifier.getQualifier() +
                " WHERE is_folder = false " +
                "   AND (gisogdrf_sync_status = 'Не синхронизирован' OR " +
                "        gisogdrf_sync_status = 'Синхронизация завершилась ошибкой')" +
                " LIMIT " + limit;

        return jdbcTemplate.query(query, new RecordRowMapper(null));
    }

    /**
     * Выборка записей готовых к отправке.
     * <p>
     * Сюда подпадают записи в статусе: "Синхронизация завершилась ошибкой" и "Не синхронизирован". Геометрия из shape
     * сразу достается в нужном для отправки формате: GeoJSON.
     *
     * @param qualifier Квалификатор библиотеки
     * @param limit     Лимит
     */
    public List<IRecord> getRecordsForPublishing(ResourceQualifier qualifier, Long limit, int srid) {
        String query = "SELECT *, public.st_AsGeoJSON(public.st_transform(shape::public.geometry, " + srid + ")) as shape" +
                " FROM " + qualifier.getQualifier() +
                " WHERE gisogdrf_sync_status = 'Не синхронизирован' OR " +
                "       gisogdrf_sync_status = 'Синхронизация завершилась ошибкой'" +
                " LIMIT " + limit;

        return jdbcTemplate.query(query, new RecordRowMapper(null));
    }

    public Optional<IRecord> getRecord(ResourceQualifier qualifier, int srid) {
        String query = String.format(
                "SELECT *, public.st_AsGeoJSON(public.st_transform(shape::public.geometry, %d)) as shape FROM %s WHERE %s = %s",
                srid, qualifier.getTableQualifier(), getIdField(qualifier), qualifier.getRecordId());

        List<IRecord> records = jdbcTemplate.query(query, new RecordRowMapper(null));
        if (records.isEmpty()) {
            return Optional.empty();
        }

        return Optional.ofNullable(records.get(0));
    }

    public List<IRecord> findAllForAudit(ResourceQualifier qualifier, Long limit) {
        String query = "SELECT * FROM " + qualifier.getQualifier() +
                " WHERE gisogdrf_sync_status = 'В процессе синхронизации'" +
                " LIMIT " + limit;

        return jdbcTemplate.query(query, new RecordRowMapper(null));
    }

    public List<IRecord> findAllPairsTablesAndTheirDatasets() {
        String query = "" +
                "WITH tmp(table_id, dataset_id) AS " +
                "(" +
                "  SELECT identifier AS table_id, REPLACE(path, '/root/', '') AS dataset_id " +
                "  FROM data.schemas_and_tables " +
                ") " +
                "SELECT tmp.table_id AS table, identifier AS dataset FROM data.schemas_and_tables AS sat " +
                "JOIN tmp ON tmp.dataset_id::text = sat.id::text";

        return jdbcTemplate.query(query, new RecordRowMapper(null));
    }

    public void writeErrors(ResourceQualifier qualifier, Map<String, String> response) {
        String asJson = JsonConverter.asJsonString(response);

        String query = String.format("UPDATE %s SET %s = '%s' WHERE %s = %s",
                                     qualifier.getTableQualifier(), GISOGFRF_RESPONSE, asJson, getIdField(qualifier),
                                     qualifier.getRecordId());

        log.debug("Write errors query: [{}]", query);

        jdbcTemplate.update(query);
    }
}
