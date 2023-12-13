package ru.mycrg.data_service.kpt_import;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.dao.detached.KptImportDao;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.dao.config.DaoProperties.PRIMARY_KEY;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.kpt_import.KptImportUtils.tmbTableName;

/**
 * Создаёт временныек таблицы для импорта КПТ
 */
@Service
public class TmpTablesCreator {
    private static final Logger log = LoggerFactory.getLogger(TmpTablesCreator.class);

    private final KptImportDao kptImportDao;

    public TmpTablesCreator(KptImportDao kptImportDao) {
        this.kptImportDao = kptImportDao;
    }

    /**
     * Создаёт временные таблицы в схеме {@value DatasourceFactory#SYSTEM_SCHEMA_NAME}
     * Название таблицы = kpt_[Название схемы], состав полей в соответствии со схемой
     */
    public void createIfNotExists(String dbName, Collection<SchemaDto> schemas) {
        List<String> requiredTableNames = schemas.stream()
                                            .map(schemaDto -> tmbTableName(schemaDto.getName()))
                                            .collect(Collectors.toList());
        List<String> existedTableNames = kptImportDao.findKptTablesByNames(dbName, requiredTableNames);
        List<SchemaDto> requiredSchemas = schemas.stream()
                .filter(it -> !existedTableNames.contains(tmbTableName(it.getName())))
                .collect(Collectors.toList());

        for (SchemaDto schema : requiredSchemas) {
            String tableName = tmbTableName(schema.getName());
            log.info("Создание временной таблицы {}", tableName);
            kptImportDao.createTable(dbName, SYSTEM_SCHEMA_NAME, tableName, schema.getProperties(),
                                     PRIMARY_KEY);
        }
    }
}
