package ru.mycrg.data_service.dao.core;

import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class CoreReadDao implements ICoreReadDao {

    private final NamedParameterJdbcTemplate pJdbcTemplate;
    private final CoreTemplateDao coreTemplateDao;

    public CoreReadDao(CoreTemplateDao coreTemplateDao,
                       NamedParameterJdbcTemplate pJdbcTemplate) {
        this.coreTemplateDao = coreTemplateDao;
        this.pJdbcTemplate = pJdbcTemplate;
    }

    @Override
    public boolean exists(String query) {
        Boolean result = coreTemplateDao.queryForObject(pJdbcTemplate.getJdbcTemplate(), query, Boolean.class);

        return Boolean.TRUE.equals(result);
    }

    public <T> Optional<T> queryForObject(String query, Class<T> clazz) {
        T queryResult = coreTemplateDao.queryForObject(pJdbcTemplate.getJdbcTemplate(), query, clazz);

        return Optional.ofNullable(queryResult);
    }

    public void execute(String query) {
        coreTemplateDao.execute(pJdbcTemplate.getJdbcTemplate(), query);
    }

    public <T> List<T> query(String query, Class<T> clazz) {
        BeanPropertyRowMapper<T> rowMapper = new BeanPropertyRowMapper<>(clazz);

        return coreTemplateDao.query(pJdbcTemplate.getJdbcTemplate(), query, rowMapper);
    }
}
