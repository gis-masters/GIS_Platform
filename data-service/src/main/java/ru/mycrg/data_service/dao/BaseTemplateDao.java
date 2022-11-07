package ru.mycrg.data_service.dao;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class BaseTemplateDao {

    public <T> T queryForObject(JdbcTemplate jdbcTemplate, String query, Class<T> requiredType) {
        return jdbcTemplate.queryForObject(query, requiredType);
    }
}
