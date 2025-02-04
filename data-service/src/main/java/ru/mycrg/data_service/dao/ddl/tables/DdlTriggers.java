package ru.mycrg.data_service.dao.ddl.tables;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import ru.mycrg.common_utils.CrgGlobalProperties;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.List;
import java.util.stream.Collectors;

import static org.apache.commons.lang3.StringUtils.join;
import static ru.mycrg.data_service.dao.utils.ResourceQualifierUtil.getIdField;
import static ru.mycrg.data_service.dto.ResourceType.TABLE;

@Repository
public class DdlTriggers {

    private final Logger log = LoggerFactory.getLogger(DdlTriggers.class);

    private static final String TRIGGER_PREFIX = "trig";

    private final JdbcTemplate jdbcTemplate;

    public DdlTriggers(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void createInsertTrigger(ResourceQualifier qualifier, List<String> fields) {
        createTrigger(qualifier, fields, "INSERT");
    }

    public void dropInsertTrigger(ResourceQualifier qualifier) {
        dropTrigger(qualifier, "INSERT");
    }

    public void createUpdateTrigger(ResourceQualifier qualifier, List<String> fields) {
        createTrigger(qualifier, fields, "UPDATE");
    }

    public void dropUpdateTrigger(ResourceQualifier qualifier) {
        dropTrigger(qualifier, "UPDATE");
    }

    public void createDeleteTrigger(ResourceQualifier qualifier) {
        createTrigger(qualifier, null, "DELETE");
    }

    public void dropDeleteTrigger(ResourceQualifier qualifier) {
        dropTrigger(qualifier, "DELETE");
    }

    private void dropTrigger(ResourceQualifier qualifier, String operation) {
        String schema = qualifier.getSchema();
        String table = qualifier.getTable();
        String triggerName = makeTriggerName(table, operation.toLowerCase());

        String dropQuery = String.format("DROP TRIGGER IF EXISTS %s ON %s.%s", triggerName, schema, table);

        jdbcTemplate.execute(dropQuery);
    }

    private void createTrigger(ResourceQualifier qualifier, List<String> fields, String operation) {
        String schema = qualifier.getSchema();
        String table = qualifier.getTable();
        String triggerName = makeTriggerName(table, operation.toLowerCase());

        String funcName;
        String triggerParams;
        if ("DELETE".equalsIgnoreCase(operation)) {
            funcName = (qualifier.getType() == TABLE)
                    ? "delete_from_fts_layers"
                    : "delete_from_fts_documents";
            triggerParams = String.format("'%s', '%s'", schema, table);
        } else {
            funcName = (qualifier.getType() == TABLE)
                    ? "universal_copy_to_fts_layers"
                    : "universal_copy_to_fts_documents";
            String joinedFields = join(fields.stream().map(String::toLowerCase).collect(Collectors.toList()), ",");
            triggerParams = String.format("'%s', '%s', '%s', '%s'", schema, table, getIdField(qualifier), joinedFields);
        }

        dropTrigger(qualifier, operation);

        String createQuery = String.format(
                "CREATE TRIGGER %s AFTER %s ON %s.%s FOR EACH ROW EXECUTE FUNCTION public.%s(%s)",
                triggerName, operation.toUpperCase(), schema, table, funcName,
                triggerParams);

        log.trace("create {} trigger: [{}]", operation, createQuery);

        jdbcTemplate.execute(createQuery);
    }

    @NotNull
    private static String makeTriggerName(String tableName, String operation) {
        return CrgGlobalProperties.join(TRIGGER_PREFIX, tableName, operation);
    }
}
