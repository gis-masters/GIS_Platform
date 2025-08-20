package ru.mycrg.data_service.dao.core;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CoreTemplateDao {

    public <T> List<T> query(JdbcTemplate jdbcTemplate, String query, BeanPropertyRowMapper<T> rowMapper) {
        return jdbcTemplate.query(query, rowMapper);
    }

    public <T> T queryForObject(JdbcTemplate jdbcTemplate, String query, Class<T> requiredType) {
        return jdbcTemplate.queryForObject(query, requiredType);
    }

    public <T> List<T> queryForList(JdbcTemplate jdbcTemplate, String query, Class<T> requiredType) {
        return jdbcTemplate.queryForList(query, requiredType);
    }

    public void execute(JdbcTemplate jdbcTemplate, String query) {
        jdbcTemplate.execute(query);
    }
}
