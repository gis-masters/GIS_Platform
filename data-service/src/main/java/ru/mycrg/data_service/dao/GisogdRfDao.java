package ru.mycrg.data_service.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class GisogdRfDao {

    private final Logger log = LoggerFactory.getLogger(GisogdRfDao.class);

    private final JdbcTemplate jdbcTemplate;

    public GisogdRfDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Long findJoinedToDocumentLayerRecordId(String dataset,
                                                  String layer,
                                                  String libraryQualifier,
                                                  Object recordId) {
        String query = "" +
                "SELECT " +
                "  dl.id AS layer_record_id " +
                "FROM " +
                "  " + libraryQualifier + " AS dl " +
                "  join (" +
                "    SELECT " +
                "      jsonb_extract_path_text(elem :: jsonb, 'id') AS layerRecordId" +
                "    FROM" +
                "      " + dataset + "." + layer + "," +
                "      LATERAL jsonb_array_elements_text(file :: jsonb) AS elem" +
                "  ) AS layer on dl.id :: int = layer.layerRecordId :: int " +
                "WHERE dl.id = " + recordId + " limit (1)";

        log.debug("find joined to document layer record id for gisogdRf: [{}]", query);

        return jdbcTemplate.queryForObject(query, Long.class);
    }
}
