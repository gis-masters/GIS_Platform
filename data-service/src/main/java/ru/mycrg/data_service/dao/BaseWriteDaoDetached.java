package ru.mycrg.data_service.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

@Transactional
@Repository
public class BaseWriteDaoDetached {

    private final Logger log = LoggerFactory.getLogger(BaseWriteDaoDetached.class);

    public void removeRecordsWithFilter(JdbcTemplate pJdbcTemplate, ResourceQualifier rQualifier,
                                        String filter) throws CrgDaoException {
        try {
            String query = String.format("DELETE FROM %s WHERE %s",
                                         rQualifier.getTableQualifier(), filter);

            log.debug("Request to delete record with filter: [{}]", query);

            pJdbcTemplate.execute(query);
        } catch (Exception e) {
            String msg = String.format("Не удалось выполнить удаление объекты из: '%s'",
                                       rQualifier.getTableQualifier());
            log.debug(msg);

            throw new CrgDaoException(msg, e.getCause());
        }
    }
}
