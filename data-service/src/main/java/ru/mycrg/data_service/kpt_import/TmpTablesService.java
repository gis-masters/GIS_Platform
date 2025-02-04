package ru.mycrg.data_service.kpt_import;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.dao.ddl.tables.DdlTablesBase;
import ru.mycrg.data_service.dao.detached.DetachedRecordsDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dao.utils.wellknown_formula_generator.PropertyBuilderWithFormula;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import javax.sql.DataSource;
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

    private final DetachedRecordsDao recordsDao;
    private final DatasourceFactory datasourceFactory;
    private final PropertyBuilderWithFormula propertyBuilderWithFormula;

    public TmpTablesService(DetachedRecordsDao recordsDao,
                            DatasourceFactory datasourceFactory,
                            PropertyBuilderWithFormula propertyBuilderWithFormula) {
        this.recordsDao = recordsDao;
        this.datasourceFactory = datasourceFactory;
        this.propertyBuilderWithFormula = propertyBuilderWithFormula;
    }

    /**
     * Удаляет и заново создаёт временные таблицы в схеме {@value DatasourceFactory#SYSTEM_SCHEMA_NAME}
     * <p>
     * Название таблицы = kpt_[Название схемы], состав полей в соответствии со схемой
     */
    public void recreateTable(String dbName, Collection<SchemaDto> schemas) {

        DataSource dataSource = datasourceFactory.getNamedDataSource(dbName, SYSTEM_SCHEMA_NAME);
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        DdlTablesBase ddlTablesBase = new DdlTablesBase(jdbcTemplate, propertyBuilderWithFormula);

        for (SchemaDto schema : schemas) {
            String tableName = tmbTableName(schema.getName());

            log.info("Удаление временной таблицы {}", tableName);
            ddlTablesBase.drop(new ResourceQualifier(SYSTEM_SCHEMA_NAME, tableName));

            log.info("Создание временной таблицы {}", tableName);
            ddlTablesBase.create(SYSTEM_SCHEMA_NAME, tableName, schema.getProperties(), PRIMARY_KEY);
        }
    }

    public void cleanTmpTables(String dbName, List<SchemaDto> schemas) throws CrgDaoException {
        for (SchemaDto schema: schemas) {
            recordsDao.truncateTable(dbName,
                                     systemTable(tmbTableName(schema.getName())));
        }
    }
}
