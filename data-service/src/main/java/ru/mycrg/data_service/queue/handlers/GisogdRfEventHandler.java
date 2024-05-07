package ru.mycrg.data_service.queue.handlers;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.BaseWriteDao;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.gisog_service_contract.ResponseFromGisogdRfEvent;
import ru.mycrg.gisog_service_contract.dto.Document;
import ru.mycrg.gisog_service_contract.dto.Status;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import java.time.LocalDateTime;
import java.util.Map;

import static java.time.LocalDateTime.now;
import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.data_service.dao.config.DaoProperties.*;
import static ru.mycrg.data_service.util.JsonConverter.getJsonString;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.LAST_MODIFIED;
import static ru.mycrg.gisog_service_contract.dto.Status.SUCCESS;

@Component
public class GisogdRfEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(GisogdRfEventHandler.class);

    private static final String GISOGD_SOURCE_ID = "gisogd_";

    private final DatasourceFactory datasourceFactory;

    public GisogdRfEventHandler(DatasourceFactory datasourceFactory) {
        this.datasourceFactory = datasourceFactory;
    }

    @Override
    public String getEventType() {
        return ResponseFromGisogdRfEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        try {
            ResponseFromGisogdRfEvent event = (ResponseFromGisogdRfEvent) mqEvent;
            log.debug("ResponseFromGisogdRfEvent: {}", event);

            Document parent = event.getParent();
            String schemaName = parent.getSchema();
            String tableName = parent.getName();
            String id = extractId(parent);

            String databaseName = getDefaultDatabaseName(event.getOrgId());
            NamedParameterJdbcTemplate jdbcTemplate =
                    new NamedParameterJdbcTemplate(
                            datasourceFactory.getNamedDataSource(databaseName, GISOGD_SOURCE_ID));
            BaseWriteDao baseWriteDao = new BaseWriteDao(jdbcTemplate);

            Status status = event.getStatus();
            String idTemplate = parent.getContent().containsKey(ID) ? ID : PRIMARY_KEY;
            LocalDateTime currentDatetime = now();
            if (SUCCESS.equals(status)) {
                String query = String.format("UPDATE %s.%s SET " +
                                                     GISOGFRF_PUBLICATION_DATETIME + " = '" + currentDatetime + "', " +
                                                     GISOGFRF_RESPONSE + " = null" +
                                                     "  WHERE " + idTemplate + " = %s",
                                             schemaName, tableName, id);

                log.debug("Query [gisogd-rf SUCCESS response]: [{}]", query);

                baseWriteDao.update(query, new MapSqlParameterSource());
            } else {
                Map<String, String> response = event.getContent();
                response.put("status", event.getStatus().name());

                String query = String.format("UPDATE %s.%s SET " +
                                                     LAST_MODIFIED.getName() + " = '" + currentDatetime + "', " +
                                                     GISOGFRF_RESPONSE + " = :response " +
                                                     "  WHERE " + idTemplate + " = %s",
                                             schemaName, tableName, id);

                log.debug("Query [gisogd-rf FAIL response]: [{}]", query);

                baseWriteDao.update(query,
                                    new MapSqlParameterSource().addValue("response", getJsonString(response)));
            }
        } catch (Exception e) {
            log.error("Не удалось корректно обработать ResponseFromGisogdRfEvent. Причина: {}", e.getMessage());
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
