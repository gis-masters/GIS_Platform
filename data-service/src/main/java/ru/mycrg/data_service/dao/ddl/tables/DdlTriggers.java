package ru.mycrg.data_service.dao.ddl.tables;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.List;

@Repository
public class DdlTriggers {

    private final DdlTriggersDetached ddlTriggersDetached;
    private final JdbcTemplate jdbcTemplate;

    public DdlTriggers(DdlTriggersDetached ddlTriggersDetached, JdbcTemplate jdbcTemplate) {
        this.ddlTriggersDetached = ddlTriggersDetached;
        this.jdbcTemplate = jdbcTemplate;
    }

    public void createInsertTrigger(ResourceQualifier qualifier, List<String> fields) {
        ddlTriggersDetached.createInsertTrigger(jdbcTemplate, qualifier, fields);
    }

    public void createUpdateTrigger(ResourceQualifier qualifier, List<String> fields) {
        ddlTriggersDetached.createUpdateTrigger(jdbcTemplate, qualifier, fields);
    }

    public void createDeleteTrigger(ResourceQualifier qualifier) {
        ddlTriggersDetached.createDeleteTrigger(jdbcTemplate, qualifier);
    }
}
