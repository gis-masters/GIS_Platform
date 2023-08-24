package ru.mycrg.data_service.queue.handlers;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.BaseTemplateDao;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.gisog_service_contract.ResponseFromGisogdRfEvent;
import ru.mycrg.gisog_service_contract.dto.Document;
import ru.mycrg.gisog_service_contract.dto.Status;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import java.util.Map;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.data_service.dao.config.DaoProperties.ID;
import static ru.mycrg.data_service.dao.config.DaoProperties.PRIMARY_KEY;
import static ru.mycrg.data_service.util.JsonConverter.getJsonString;
import static ru.mycrg.gisog_service_contract.dto.Status.SUCCESS;

@Component
public class GisogdRfEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(GisogdRfEventHandler.class);

    private final DatasourceFactory datasourceFactory;
    private final BaseTemplateDao baseTemplateDao;

    public GisogdRfEventHandler(DatasourceFactory datasourceFactory,
                                BaseTemplateDao baseTemplateDao) {
        this.datasourceFactory = datasourceFactory;
        this.baseTemplateDao = baseTemplateDao;
    }

    @Override
    public String getEventType() {
        return "ResponseFromGisogdRfEvent";
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
            JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(databaseName));

            Status status = event.getStatus();
            if (SUCCESS.equals(status)) {
                String query = String.format("UPDATE %s.%s SET " +
                                                     "last_modified = now(), " +
                                                     "gisogdrf_publication_datetime = now(), " +
                                                     "gisogdrf_response = null" +
                                                     "  WHERE id = %s",
                                             schemaName, tableName, id);

                log.debug("Update publication date query: [{}]", query);

                baseTemplateDao.execute(jdbcTemplate, query);

                log.debug("Publication date was successfully updated");
            } else {
                Map<String, String> response = event.getContent();
                String responseAsString = getJsonString(response);

                String query = String.format("UPDATE %s.%s SET " +
                                                     "last_modified = now(), " +
                                                     "gisogdrf_response = '" + responseAsString + "' " +
                                                     "  WHERE id = %s",
                                             schemaName, tableName, id);

                log.debug("Write gisogdrf response query: [{}]", query);

                baseTemplateDao.execute(jdbcTemplate, query);

                log.debug("Gisogdrf response successfully updated written");
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
