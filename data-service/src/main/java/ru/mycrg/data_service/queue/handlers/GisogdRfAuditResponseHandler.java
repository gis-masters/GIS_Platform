package ru.mycrg.data_service.queue.handlers;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.BaseWriteDao;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.gisog_service_contract.AuditResponseGisogdRfEvent;
import ru.mycrg.gisog_service_contract.dto.Document;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import java.sql.Types;
import java.time.LocalDateTime;
import java.util.Map;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.data_service.dao.config.DaoProperties.*;
import static ru.mycrg.data_service.util.JsonConverter.asJsonString;

@Component
public class GisogdRfAuditResponseHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(GisogdRfAuditResponseHandler.class);

    private final DatasourceFactory datasourceFactory;

    public GisogdRfAuditResponseHandler(DatasourceFactory datasourceFactory) {
        this.datasourceFactory = datasourceFactory;
    }

    @Override
    public String getEventType() {
        return AuditResponseGisogdRfEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        try {
            AuditResponseGisogdRfEvent event = (AuditResponseGisogdRfEvent) mqEvent;
            log.debug("AuditResponseGisogdRfEvent: {}", asJsonString(event));

            Document parent = event.getParent();
            String idTemplate = parent.getContent().containsKey(ID) ? ID : PRIMARY_KEY;
            String schemaName = parent.getSchema();
            String tableName = parent.getName();
            String id = extractId(parent);

            String databaseName = getDefaultDatabaseName(event.getOrgId());
            NamedParameterJdbcTemplate jdbcTemplate =
                    new NamedParameterJdbcTemplate(datasourceFactory.getDataSource(databaseName));
            BaseWriteDao baseWriteDao = new BaseWriteDao(jdbcTemplate);

            String query = String.format("UPDATE %s.%s SET " +
                                                 "gisogdrf_response = :gisogdrf_response, " +
                                                 "gisogdrf_audit_datetime = :gisogdrf_audit_datetime " +
                                                 " WHERE " + idTemplate + " = %s",
                                         schemaName, tableName, id);

            log.debug("Query [gisogd-rf audit response]: [{}]", query);

            MapSqlParameterSource parameterSource = new MapSqlParameterSource();
            parameterSource.addValue(GISOGFRF_RESPONSE, asJsonString(event.getContent()));
            parameterSource.addValue(GISOGFRF_AUDIT_DATETIME,
                                     LocalDateTime.now(),
                                     Types.TIMESTAMP);

            baseWriteDao.update(query, parameterSource);
        } catch (Exception e) {
            log.error("Не удалось корректно обработать AuditResponseGisogdRfEvent. Причина: {}", e.getMessage());
        }
    }

    @NotNull
    private String extractId(Document parent) {
        Map<String, Object> content = parent.getContent();
        if (content.containsKey(PRIMARY_KEY)) {
            return content.get(PRIMARY_KEY).toString();
        } else if (content.containsKey(ID)) {
            return content.get(ID).toString();
        }

        throw new IllegalStateException("Не удалось достать идентификатор из объекта: " + parent);
    }
}
