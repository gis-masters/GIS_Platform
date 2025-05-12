package ru.mycrg.data_service.dao.detached;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.dto.FullAddressDto;
import ru.mycrg.data_service.dto.LocalityDto;

import java.util.List;
import java.util.Map;

import static org.apache.commons.lang3.StringUtils.isNumeric;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.INITIAL_DB_NAME;

@Repository
public class FiasDao {

    private final Logger log = LoggerFactory.getLogger(FiasDao.class);

    private final DatasourceFactory datasourceFactory;

    public FiasDao(DatasourceFactory datasourceFactory) {
        this.datasourceFactory = datasourceFactory;
    }

    public void writeValue(Map<String, List<String>> infos) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(INITIAL_DB_NAME));
        String queryUpdate = "";

        try {
            for (Map.Entry<String, List<String>> info: infos.entrySet()) {

                List<String> queries = info.getValue();
                for (String query: queries) {
                    queryUpdate = query;
                    jdbcTemplate.update(queryUpdate);
                }
            }
        } catch (DataAccessException e) {
            log.error("Не удалось записать в БД, sql:[{}],error: {}", queryUpdate, e.getMessage());
        }
    }

    public void truncateFiasData() {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(INITIAL_DB_NAME));

        String schemaName = "fiaz";
        String sqlGetAllTableBySchema = "SELECT table_name" +
                " FROM information_schema.tables" +
                " WHERE table_schema = '" + schemaName + "';";
        String sqlTruncateTableInSchema = "TRUNCATE ";

        List<String> recordAsTableName = jdbcTemplate.queryForList(sqlGetAllTableBySchema, String.class);
        for (int i = 0; i < recordAsTableName.size(); i++) {
            String separator = i == recordAsTableName.size() - 1 ? "; " : ",";
            sqlTruncateTableInSchema += schemaName + "." + recordAsTableName.get(i) + separator;
        }

        log.debug("Query to truncate fias data: [{}]", sqlTruncateTableInSchema);

        jdbcTemplate.execute(sqlTruncateTableInSchema);
    }

    public void generateFullAddressesAndSave() {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(INITIAL_DB_NAME));

        String sql = "INSERT INTO fiaz.full_address (objectid, fulladdress, oktmo) " +
                "SELECT houses.objectid         as objectid," +
                "       concat(\n" +
                "               CASE\n" +
                "                   WHEN address6.typename is null THEN ''" +
                "                   ELSE concat(address6.typename, ' ', address6.name, ', ')" +
                "                   END," +
                "               CASE" +
                "                   WHEN address5.typename is null THEN ''" +
                "                   ELSE concat(address5.typename, ' ', address5.name, ', ')" +
                "                   END,\n" +
                "               address4.typename, ' ', address4.name, ', '," +
                "               address3.typename, ' ', address3.name, ', '," +
                "               address2.typename, ' ', address2.name, ', '," +
                "               address.typename, ' ', address.name, ', '," +
                "               'д.', housenum) as fulladdress," +
                "       m_hierarchy.oktmo       as oktmo " +
                "FROM fiaz.houses as houses" +
                "         JOIN fiaz.mun_hierarchy m_hierarchy on m_hierarchy.objectid = houses.objectid" +
                "         JOIN fiaz.address_objects address on address.objectid = m_hierarchy.parentobjid" +
                "         JOIN fiaz.mun_hierarchy m2 on address.objectid = m2.objectid" +
                "         JOIN fiaz.address_objects address2 on address2.objectid = m2.parentobjid" +
                "         JOIN fiaz.mun_hierarchy m3 on address2.objectid = m3.objectid" +
                "         JOIN fiaz.address_objects address3 on address3.objectid = m3.parentobjid" +
                "         JOIN fiaz.mun_hierarchy m4 on address3.objectid = m4.objectid" +
                "         JOIN fiaz.address_objects address4 on address4.objectid = m4.parentobjid" +
                "         LEFT JOIN fiaz.mun_hierarchy m5 on address4.objectid = m5.objectid" +
                "         LEFT JOIN fiaz.address_objects address5 on address5.objectid = m5.parentobjid" +
                "         LEFT JOIN fiaz.mun_hierarchy m6 on address5.objectid = m6.objectid" +
                "         LEFT JOIN fiaz.address_objects address6 on address6.objectid = m6.parentobjid " +
                "WHERE houses.isactual = true" +
                "  AND houses.isactive = true" +
                "  AND m_hierarchy.isactive = true" +
                "  AND address.isactual = true" +
                "  AND address.isactive = true" +
                "  AND m2.isactive = true" +
                "  AND address2.isactual = true" +
                "  AND address2.isactive = true" +
                "  AND m3.isactive = true" +
                "  AND address3.isactual = true" +
                "  AND address3.isactive = true" +
                "  AND m4.isactive = true" +
                "  AND address4.isactual = true" +
                "  AND address4.isactive = true";

        log.debug("Query to generate full address from FIAS data: [{}]", sql);

        jdbcTemplate.execute(sql);
    }

    public void generateLocalityData() {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(INITIAL_DB_NAME));

        String sql = "INSERT INTO fiaz.locality_oktmo (objectid, locality, oktmo) " +
                "SELECT addr.objectid                                                                AS objectid, " +
                "       concat(addr2.typename, ' ', addr2.name, ', ', addr.typename, ' ', addr.name) AS locality, " +
                "       m.oktmo                                                                      AS oktmo " +
                "FROM fiaz.mun_hierarchy m " +
                "         JOIN fiaz.address_objects addr on addr.objectid = m.objectid " +
                "         JOIN fiaz.address_objects addr2 on addr2.objectid = m.parentobjid " +
                "WHERE addr.level in ('4', '5', '6') " +
                "  AND addr.isactual = true " +
                "  AND addr.isactive = true " +
                "  AND addr2.isactual = true " +
                "  AND addr2.isactive = true " +
                "  AND m.isactive = true; ";

        log.debug("Query to generate locality OKTMO data from FIAS data: [{}]", sql);

        jdbcTemplate.execute(sql);
    }

    public List<FullAddressDto> getAddresses(String address) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(INITIAL_DB_NAME));

        String[] partsOfAddress = address.split("[\\s,]+");
        String params = "";

        for (int i = 0; i < partsOfAddress.length; i++) {
            if (i == 0) {
                params += " lower(fulladdress) like lower('%" + partsOfAddress[i] + "%')";
            } else if (i == partsOfAddress.length - 1) {
                String lastPart = partsOfAddress[i];
                if (isNumeric(lastPart)) {
                    params += " and lower(fulladdress) like lower('%д." + partsOfAddress[i] + "%')";
                } else {
                    params += " and lower(fulladdress) like lower('%" + partsOfAddress[i] + "%')";
                }
            } else {
                params += " and lower(fulladdress) like lower('%" + partsOfAddress[i] + "%')";
            }
        }
        params += " order by fulladdress limit 10";

        String query = " SELECT * " +
                "FROM fiaz.full_address " +
                "WHERE " + params;

        log.debug("Query to search full address from FIAS data: [{}]", query);

        return jdbcTemplate.query(query, new BeanPropertyRowMapper<>(FullAddressDto.class));
    }

    public List<FullAddressDto> getAddressesByCompleteMatch(String address) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(INITIAL_DB_NAME));

        String query = " SELECT * " +
                "FROM fiaz.full_address " +
                "WHERE lower(fulladdress) like lower('%" + address + "%')" +
                " LIMIT 10";

        log.debug("Query to search complete match full address from FIAS data: [{}]", query);

        return jdbcTemplate.query(query, new BeanPropertyRowMapper<>(FullAddressDto.class));
    }

    public List<LocalityDto> getLocalities(String address) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(INITIAL_DB_NAME));

        String[] partsOfAddress = address.split("[\\s,]+");
        String params = "";

        for (int i = 0; i < partsOfAddress.length; i++) {
            params += i == 0
                    ? " lower(locality) like lower('%" + partsOfAddress[i] + "%')"
                    : " and lower(locality) like lower('%" + partsOfAddress[i] + "%')";
        }

        String query = " SELECT * " +
                "FROM fiaz.locality_oktmo " +
                "WHERE " + params + " ORDER BY locality LIMIT 10 ";

        log.debug("Query to search locality OKTMO from FIAS data: [{}]", query);

        return jdbcTemplate.query(query, new BeanPropertyRowMapper<>(LocalityDto.class));
    }
}
