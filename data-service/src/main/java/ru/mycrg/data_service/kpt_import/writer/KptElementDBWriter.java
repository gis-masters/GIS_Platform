package ru.mycrg.data_service.kpt_import.writer;

import org.postgis.Geometry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.data_service.dao.detached.DetachedRecordsDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.kpt_import.model.KptElement;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

import static ru.mycrg.data_service.dao.config.DaoProperties.DEFAULT_GEOMETRY_COLUMN_NAME;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.kpt_import.KptImportUtils.DS_ID;
import static ru.mycrg.data_service.kpt_import.KptImportUtils.tmbTableName;

public abstract class KptElementDBWriter implements KptElementWriter {

    private final Logger log = LoggerFactory.getLogger(KptElementDBWriter.class);

    private final DetachedRecordsDao recordsDao;
    private final ResourceQualifier resourceQualifier;

    private Integer srid;

    protected KptElementDBWriter(DetachedRecordsDao recordsDao) {
        this.recordsDao = recordsDao;
        this.resourceQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, tmbTableName(getSchemaName()));
    }

    @Override
    public void writeBatch(List<KptElement> kptElements, SchemaDto schema, String dbName) {
        Map<String, Object>[] batch = kptElements.stream()
                                                 .map(prepareContentWithSrid(srid))
                                                 .toArray(Map[]::new);

        try {
            recordsDao.addRecordsAsBatch(resourceQualifier, batch, schema, dbName, DS_ID);
        } catch (CrgDaoException e) {
            String msg = "Ошибка при добавлении batch записей в таблицу: " + resourceQualifier + ". Подробно: " + e;

            throw new DataServiceException(msg);
        }
    }

    @Override
    public void setSrid(int srid) {
        this.srid = srid;
    }

    private Function<KptElement, Map<String, Object>> prepareContentWithSrid(Integer srid) {
        return kptElement -> {
            Map<String, Object> content = kptElement.getContent();
            if (srid == null) {
                log.debug("Для KptElementDBWriter: '{}' не определена srid", this.getClass().getSimpleName());

                return content;
            }

            Object oShape = content.get(DEFAULT_GEOMETRY_COLUMN_NAME);
            if (oShape != null) {
                Geometry shape = (Geometry) oShape;
                shape.setSrid(srid);
            }

            return content;
        };
    }
}
