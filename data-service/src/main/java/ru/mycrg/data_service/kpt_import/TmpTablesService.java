package ru.mycrg.data_service.kpt_import;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.dao.detached.DetachedRecordsDao;
import ru.mycrg.data_service.dao.detached.KptImportDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.Collection;
import java.util.List;

import static ru.mycrg.data_service.dao.config.DaoProperties.PRIMARY_KEY;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.kpt_import.KptImportUtils.tmbTableName;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.systemTable;

/**
 * Создаёт временные таблицы для импорта КПТ
 */
@Service
public class TmpTablesService {

    private static final Logger log = LoggerFactory.getLogger(TmpTablesService.class);

    private final KptImportDao kptImportDao;
    private final DetachedRecordsDao recordsDao;

    public TmpTablesService(KptImportDao kptImportDao,
                            DetachedRecordsDao recordsDao) {
        this.kptImportDao = kptImportDao;
        this.recordsDao = recordsDao;
    }

    /**
     * Удаляет и заново создаёт временные таблицы в схеме {@value DatasourceFactory#SYSTEM_SCHEMA_NAME}
     * <p>
     * Название таблицы = kpt_[Название схемы], состав полей в соответствии со схемой
     */
    public void recreateTable(String dbName, Collection<SchemaDto> schemas) {
        for (SchemaDto schema: schemas) {
            String tableName = tmbTableName(schema.getName());

            log.info("Удаление временной таблицы {}", tableName);
            kptImportDao.dropTable(dbName, SYSTEM_SCHEMA_NAME, tableName);

            log.info("Создание временной таблицы {}", tableName);
            kptImportDao.createTable(dbName, SYSTEM_SCHEMA_NAME, tableName, schema.getProperties(),
                    PRIMARY_KEY);
        }
    }

    public void cleanTmpTables(String dbName, List<SchemaDto> schemas) throws CrgDaoException {
        for (SchemaDto schema: schemas) {
            recordsDao.truncateTable(dbName,
                                     systemTable(tmbTableName(schema.getName())));
        }
    }
}
