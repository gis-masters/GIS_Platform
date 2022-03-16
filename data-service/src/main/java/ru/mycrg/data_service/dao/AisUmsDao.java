package ru.mycrg.data_service.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.dto.AisUmsDto;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.List;

import static ru.mycrg.data_service.dao.utils.SqlBuilder.buildInSection;

@Repository
public class AisUmsDao {

    private final Logger log = LoggerFactory.getLogger(AisUmsDao.class);

    private final String DATA_SOURCE_NAME = "database_1";

    private final DatasourceFactory datasourceFactory;

    public AisUmsDao(DatasourceFactory datasourceFactory) {
        this.datasourceFactory = datasourceFactory;
    }

    public void updateTable(ResourceQualifier tQualifier, List<AisUmsDto> aisUmsData) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(DATA_SOURCE_NAME));

        for (AisUmsDto aisUmsDto: aisUmsData) {
            String updateAisUmsColumns = "UPDATE " + tQualifier.getQualifier() +
                    " SET aisums_property_type = '" + aisUmsDto.getPropertyType() + "'," +
                    "     aisums_number = '" + aisUmsDto.getRegNum() + "'" +
                    " WHERE cad_num = '" + aisUmsDto.getCadNum() + "'";

            log.debug("Update query with AIS UMS data: [{}]", updateAisUmsColumns);

            jdbcTemplate.update(updateAisUmsColumns);
        }
    }

    public List<String> getAllTablesNameBySchemas(String datasetName, List<String> schemas) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(DATA_SOURCE_NAME));

        String query = "SELECT identifier AS table_name " +
                "FROM data.schemas_and_tables " +
                "WHERE path = (SELECT concat(path, '/', id) AS path " +
                "              FROM data.schemas_and_tables " +
                "              WHERE identifier = '" + datasetName + "' " +
                "                AND is_folder = true) " +
                "  AND schema_id IN (" + buildInSection(schemas) + ")" +
                "  AND is_folder = FALSE";

        log.debug("Query to get all tables names: [{}]", query);

        return jdbcTemplate.queryForList(query, String.class);
    }
}
