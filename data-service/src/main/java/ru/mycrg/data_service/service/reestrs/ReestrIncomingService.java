package ru.mycrg.data_service.service.reestrs;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.config.Smev3Config;
import ru.mycrg.data_service.dao.detached.DetachedRecordsDao;
import ru.mycrg.data_service.dao.detached.DetachedSchemaDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.entity.reestrs.ReestrIncoming;
import ru.mycrg.data_service.mappers.SchemaMapper;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.UUID;

import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;

@Service
public class ReestrIncomingService {
    private static final Logger log = LoggerFactory.getLogger(ReestrIncomingService.class);
    private static final String SCHEMA_NAME  = "reestr_incoming_schema";
    private static final ResourceQualifier resourceQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, "reestr_incoming");
    private final Smev3Config smev3Config;
    private final DetachedSchemaDao detachedSchemaDao;
    private final DetachedRecordsDao detachedRecordsDao;

    public ReestrIncomingService(Smev3Config smev3Config,
                                 DetachedSchemaDao detachedSchemaDao,
                                 DetachedRecordsDao detachedRecordsDao) {
        this.smev3Config = smev3Config;
        this.detachedSchemaDao = detachedSchemaDao;
        this.detachedRecordsDao = detachedRecordsDao;
    }

    public UUID save(ReestrIncoming message) throws CrgDaoException {
        log.debug("Try to save reestr record: " + message.toString());
        try {
            var schema = detachedSchemaDao
                    .schemaDao(smev3Config.getTargetDb())
                    .find(SCHEMA_NAME);
            detachedRecordsDao.addRecordsAsBatch(
                    resourceQualifier,
                    message,
                    SchemaMapper.mapToDto(schema),
                    smev3Config.getTargetDb()
            );
            log.info("Reestr record saved. id:{}", message.getId());
            return message.getId();
        } catch (CrgDaoException e) {
            log.error("Reestr record not saved. {}", e.getMessage());
            throw new CrgDaoException("Reesrt record not saved" + e.getMessage());
        }
    }
}
