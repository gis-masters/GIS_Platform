package ru.mycrg.data_service.kpt_import.writer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.data_service.dao.detached.DetachedRecordsDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.kpt_import.model.KptElement;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.List;
import java.util.Map;

import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.kpt_import.KptImportUtils.*;

public abstract class KptElementDBWriter implements KptElementWriter {

    private final Logger log = LoggerFactory.getLogger(KptElementDBWriter.class);
    private final DetachedRecordsDao recordsDao;
    private final ResourceQualifier resourceQualifier;

    protected KptElementDBWriter(DetachedRecordsDao recordsDao) {
        this.recordsDao = recordsDao;
        this.resourceQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, tmbTableName(getSchemaName()));
    }

    @Override
    public void writeBatch(List<KptElement> kptElements, SchemaDto tableSchemaDto, String databaseName) {
        Map<String, Object>[] batch = kptElements.stream().map(KptElement::getContent).toArray(Map[]::new);
        try {
            recordsDao.addRecordsAsBatch(resourceQualifier, batch, tableSchemaDto, databaseName, DS_ID);
        } catch (CrgDaoException e) {
            log.error("Ошибка при добавлении batch записей в таблицу " + resourceQualifier, e);
        }
    }
}
