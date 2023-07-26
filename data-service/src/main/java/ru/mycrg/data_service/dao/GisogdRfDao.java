package ru.mycrg.data_service.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.gisog_service_contract.dto.LandPlot;

import java.util.List;
import java.util.Optional;

@Repository
public class GisogdRfDao {

    private final Logger log = LoggerFactory.getLogger(GisogdRfDao.class);

    private final JdbcTemplate jdbcTemplate;

    public GisogdRfDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<LandPlot> fetchLandPlot(ResourceQualifier qualifier) {
        String number = qualifier.getRecordId().toString();
        String tableQualifier = qualifier.getTableQualifier();

        String query = "" +
                "SELECT " +
                "  map_place.guid, " +
                "  map_place.status, " +
                "  map_place.cadastralnum, " +
                "  map_place.area, " +
                "  public.st_astext(" +
                "    public.st_transform(map_place.shape, 3857)" +
                "  ) as location " +
                "FROM " +
                "  " + tableQualifier + " as data_13 " +
                "  join (" +
                "    SELECT " +
                "      jsonb_extract_path_text(elem :: jsonb, 'id') AS map_id, " +
                "      status as status, " +
                "      cadastralnum as cadastralnum, " +
                "      area as area, " +
                "      guid as guid, " +
                "      shape as shape " +
                "    FROM " +
                "      dataset_a72886.section13_789_833e, " +
                "      LATERAL jsonb_array_elements_text(file :: jsonb) AS elem" +
                "  ) as map_place on data_13.id :: int = map_place.map_id :: int " +
                "where " +
                "  data_13.id = " + number + " " +
                "limit (1)";

        log.debug("fetch landPlot for gisogdRf: [{}]", query);

        List<LandPlot> plots = jdbcTemplate.query(query, new BeanPropertyRowMapper<>(LandPlot.class));

        if (plots.isEmpty()) {
            return Optional.empty();
        } else {
            return Optional.of(plots.get(0));
        }
    }
}
