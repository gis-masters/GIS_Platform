package ru.mycrg.auth_service.dao;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class OrganizationSettingsDao {

    private static final String COLUMN_ID = "id";

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public OrganizationSettingsDao(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional
    public void deleteOrgSettingsById(Long orgId, Long systemOrgId) {
        String sql = "UPDATE organizations " +
                "SET settings = (" +
                "  SELECT jsonb_agg(elem) " +
                "  FROM jsonb_array_elements(settings) AS elem " +
                "  WHERE (elem->>'" + COLUMN_ID + "')::int != :orgId" +
                ") " +
                "WHERE " + COLUMN_ID + " = :systemOrgId";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("orgId", orgId)
                .addValue("systemOrgId", systemOrgId);

        jdbcTemplate.update(sql, params);
    }
}
